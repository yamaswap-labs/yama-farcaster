import { ETFDTO, ETFsResponse, getETFList, GetETFsQuery } from '@/api/rest/get_etf_list';
import InputSearchSvg from '@/assets/input-search.svg';
import ResultEmptySvg from '@/assets/result-empty.svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Rate } from '@/components/ui/rate';
import {
  ArrowUpDownIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from '@/components/ui/table';
import api from '@/lib/api';
import { cn, formatNumber, round } from '@/lib/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useDebouncedValue from '../etfs-detail/hooks/use-debounced-value';
import { PublicKeyCell } from './etfs-table-columns';
import { ETFTable } from './ETFTable';

export interface SearchETFDTO {
  id: number;
  name: string;
  symbol: string;
  image: string;
  description: string;
  public_key: string;
  creator: string;
  create_at: number;
  status: number;
  current_price: string;
  price_change_24h: string;
  market_cap: string;
  ytd_change: string;
}

const etfColumns: ColumnDef<ETFDTO>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    enableColumnFilter: false,
    size: 240,
    cell: ({
      row: {
        original: { name, public_key, image },
      },
    }) => {
      return <PublicKeyCell name={name} token={public_key} avatar={image} />;
    },
  },
  {
    accessorKey: 'latest_price',
    header: 'Price',
    enableSorting: true,
    enableColumnFilter: false,
    size: 100,
    cell: ({
      row: {
        original: { latest_price },
      },
    }) => {
      return round(Number(latest_price), 6);
    },
  },
  {
    accessorKey: 'price_change',
    header: 'Change(%)',
    enableSorting: true,
    enableColumnFilter: false,
    size: 140,
    cell: ({
      row: {
        original: { price_change },
      },
    }) => {
      const num = formatNumber(Number(price_change));
      return <Rate>{num}</Rate>;
    },
  },
  {
    accessorKey: 'aum',
    header: 'AUM',
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const valueA = Number(rowA.original.latest_supply) * Number(rowA.original.latest_price);
      const valueB = Number(rowB.original.latest_supply) * Number(rowB.original.latest_price);
      return valueA - valueB;
    },
    enableColumnFilter: false,
    size: 120,
    cell: ({
      row: {
        original: { latest_supply, latest_price },
      },
    }) => {
      return (
        <div>
          {formatNumber(Number(latest_supply) * Number(latest_price), {
            style: 'currency',
            currency: 'USD',
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'ytd',
    header: 'YTD(%)',
    enableSorting: true,
    enableColumnFilter: false,
    size: 120,
    cell: ({
      row: {
        original: { ytd },
      },
    }) => {
      return <Rate>{formatNumber(Number(ytd))}</Rate>;
    },
  },
];

const searchETFColumns: ColumnDef<SearchETFDTO>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    enableColumnFilter: false,
    size: 240,
    cell: ({
      row: {
        original: { name, public_key, image },
      },
    }) => {
      return <PublicKeyCell name={name} token={public_key} avatar={image} />;
    },
  },
  {
    accessorKey: 'current_price',
    header: 'Price',
    enableSorting: true,
    enableColumnFilter: false,
    size: 100,
    cell: ({
      row: {
        original: { current_price },
      },
    }) => {
      return round(Number(current_price), 6);
    },
  },
  {
    accessorKey: 'price_change_24h',
    header: 'Change(%)',
    enableSorting: true,
    enableColumnFilter: false,
    size: 140,
    cell: ({
      row: {
        original: { price_change_24h },
      },
    }) => {
      const num = formatNumber(Number(price_change_24h));
      return <Rate>{num}</Rate>;
    },
  },
  {
    accessorKey: 'aum',
    header: 'AUM',
    enableSorting: true,
    // sortingFn: (rowA, rowB) => {
    //   const valueA = Number(rowA.original.latest_supply) * Number(rowA.original.latest_price);
    //   const valueB = Number(rowB.original.latest_supply) * Number(rowB.original.latest_price);
    //   return valueA - valueB;
    // },
    enableColumnFilter: false,
    size: 120,
    cell: ({
      row: {
        // original: { latest_supply, latest_price },
      },
    }) => {
      return (
        <div>
          {'-'}
          {/* {formatNumber(Number(latest_supply) * Number(latest_price), {
            style: 'currency',
            currency: 'USD',
          })} */}
        </div>
      );
    },
  },
  {
    accessorKey: 'ytd_change',
    header: 'YTD(%)',
    enableSorting: true,
    enableColumnFilter: false,
    size: 120,
    cell: ({
      row: {
        original: { ytd_change },
      },
    }) => {
      return <Rate>{ytd_change}</Rate>;
    },
  },
];

const SORT_KEY_MAP: Record<string, Partial<keyof ETFDTO>> = {
  name: 'name',
  price: 'latest_price',
  change: 'price_change',
  createAt: 'create_at',
};

function SearchETFDialog({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const debouncedSearch = useDebouncedValue(search, 300);
  const queryClient = useQueryClient();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { sort, order } = useMemo<Pick<GetETFsQuery, 'order' | 'sort'>>(() => {
    const { desc = true, id = 'change' } = sorting[0] || {};

    return {
      order: desc ? 'DESC' : 'ASC',
      sort: SORT_KEY_MAP[id],
    };
  }, [sorting]);

  const {
    data: paginatedData,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery({
    enabled: !search,
    queryKey: ['searchDialogAllETFs'],
    initialPageParam: 1,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return getETFList({ page: pageParam, limit: 10, from_timestamp: 0, sort, order });
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const { totalPages, currentPage } = lastPage.meta;
      return currentPage + 1 > totalPages ? undefined : lastPageParam + 1;
    },
  });

  const { data: searchResult = [], isLoading: isSearchLoading } = useQuery({
    enabled: !!search,
    queryKey: ['searchETFs', debouncedSearch],
    retry(failureCount, error) {
      return failureCount < 5;
    },
    queryFn: () =>
      api.get<SearchETFDTO[]>('/main-api/etf/search', {
        params: { keyword: search.trim() },
      }),
  });

  const lastPageMeta = useMemo<ETFsResponse['meta'] | undefined>(() => {
    return paginatedData?.pages?.[paginatedData?.pages?.length - 1]?.meta ?? ({} as any);
  }, [paginatedData]);

  const totalRowCount = useMemo(() => lastPageMeta?.totalItems ?? 0, [lastPageMeta]);

  const flatData = useMemo(() => {
    return paginatedData?.pages?.flatMap((e) => e.items) ?? [];
  }, [paginatedData]);

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // once the user has scrolled within 66px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 66 * 2 &&
          !isFetchingNextPage &&
          flatData.length < totalRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetchingNextPage, flatData, totalRowCount],
  );

  //   const [debouncedFetchMore] = useDebounce(
  //     () => {
  //         fetchMoreOnBottomReached(tableContainerRef.current);
  //     },
  //     300,
  //   [tableContainerRef.current]);

  const searchTable = useReactTable({
    data: searchResult,
    columns: searchETFColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    sortDescFirst: true,
    state: {
      sorting,
    },
  });

  const table = useReactTable({
    data: flatData,
    columns: etfColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (s) => {
      setSorting(s);
      if (!!table.getRowModel().rows.length) {
        rowVirtualizer.scrollToIndex?.(0);
      }
    },
    getSortedRowModel: getSortedRowModel(),
    sortDescFirst: true,
    state: {
      sorting,
    },
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    enabled: !search,
    debug: process.env.NODE_ENV === 'development',
    count: rows.length,
    estimateSize: () => 66, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 1,
  });

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      queryClient.resetQueries({
        queryKey: ['searchDialogAllETFs'],
      });
      setSorting([]);
      setSearch('');
      setOpen(open);
    },
    [setOpen, queryClient],
  );

  // a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    if (open) {
      fetchMoreOnBottomReached(tableContainerRef.current);
    }
  }, [open, fetchMoreOnBottomReached]);

  useEffect(() => {
    if (!!sorting[0]) {
      queryClient.invalidateQueries({
        queryKey: ['searchDialogAllETFs'],
      });
    }
  }, [sorting, queryClient]);

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <div className="flex w-max cursor-pointer flex-row items-center justify-start gap-[10px] rounded-18px border border-input bg-white/[0.03] px-3 py-[5px] text-text">
          <InputSearchSvg />
          <span>{'Search by name, symbol or address'}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="h-max max-h-[calc(70vh)] w-[780px] max-w-[calc(100vw-32px)] p-0">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
        </VisuallyHidden.Root>
        <div className="border-b border-border">
          <Input
            variant={'borderless'}
            rounded
            size={'lg'}
            prefix={<InputSearchSvg />}
            value={search}
            onChange={(e) => {
              setSorting([]);
              setSearch(e.target.value);
            }}
            placeholder={'Search by name, ticker or address'}
          />
        </div>

        {!debouncedSearch ? (
          <div className="px-4">
            <p className="mb-[10px] px-4 text-text">{'Hot ETFs'}</p>
            {isLoading ? (
              <TableSkeleton rows={5} rowClassName="h-20" />
            ) : flatData.length ? (
              <div
                onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
                ref={tableContainerRef}
                style={{
                  overflow: 'auto', // our scrollable table container
                  position: 'relative', // needed for sticky header
                  height: '580px', // should be a fixed height
                }}
              >
                <Table style={{ display: 'grid' }}>
                  <TableHeader
                    style={{
                      display: 'grid',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      backgroundColor: '#26282C',
                    }}
                  >
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              key={header.id}
                              style={{
                                display: 'flex',
                                width: header.getSize(),
                              }}
                            >
                              <div
                                className={cn('flex w-max items-center gap-1')}
                                title={
                                  header.column.getCanSort()
                                    ? header.column.getNextSortingOrder() === 'asc'
                                      ? 'Sort ascending'
                                      : header.column.getNextSortingOrder() === 'desc'
                                        ? 'Sort descending'
                                        : 'Clear sort'
                                    : undefined
                                }
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getCanSort() && (
                                  <button onClick={header.column.getToggleSortingHandler()}>
                                    <ArrowUpDownIcon sort={header.column.getIsSorted()} />
                                  </button>
                                )}
                                {/* {header.column.getCanFilter() && <FilterHead />} */}
                              </div>
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody
                    style={{
                      display: 'grid',
                      height: `${rowVirtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
                      position: 'relative', // needed for absolute positioning of rows
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const row = rows[virtualRow.index] as Row<ETFDTO>;
                      return (
                        <TableRow
                          data-index={virtualRow.index} // needed for dynamic row height measurement
                          ref={(node) => rowVirtualizer.measureElement(node)} // measure dynamic row height
                          key={row.id}
                          style={{
                            display: 'flex',
                            position: 'absolute',
                            transform: `translateY(${virtualRow.start}px)`, // this should always be a `style` as it changes on scroll
                            width: '100%',
                          }}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <TableCell
                                key={cell.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  width: cell.column.getSize(),
                                }}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <ResultEmpty />
            )}
          </div>
        ) : null}
        {debouncedSearch ? (
          <div className="mx-4 mb-4 h-full overflow-hidden">
            <div className="h-[626px] overflow-auto">
              {isSearchLoading ? (
                <TableSkeleton rows={5} />
              ) : searchResult?.length ? (
                <ETFTable table={searchTable} tableProps={{}} />
              ) : (
                <ResultEmpty />
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

const ResultEmpty = () => {
  return (
    <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-[calc(50%+16px)] text-center">
      <ResultEmptySvg className="inline-block" />
      <p className="mt-9 text-18px">{'No results found'}</p>
      <p className="mt-2 text-sm text-text">{'Try searching by contract address'}</p>
    </div>
  );
};

export default SearchETFDialog;
