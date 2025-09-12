import { ETFDTO } from '@/api/rest/get_etf_list';
import { BasicTable, BasicTableProps, TableSkeleton } from '@/components/ui/table';
import {
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { getETFTableColumns } from './etfs-table-columns';

export type TableFilters = {
  data: ETFDTO[];
  isInitialLoading: boolean;
  sorting: SortingState;
  setSorting?: OnChangeFn<SortingState>;
};

export const ETFTable = <T extends { public_key: string }>({
  table,
  tableProps = {},
}: BasicTableProps<T>) => {
  const router = useRouter();

  return (
    <BasicTable<T>
      table={table}
      tableProps={tableProps}
      bodyRowProps={{
        className: 'hover:cursor-pointer',
        onClick: (e, data) => {
          router.push(`/etfs/${data.public_key}`);
        },
      }}
    />
  );
};

export const ETFListContent = ({ sorting, setSorting, data, isInitialLoading }: TableFilters) => {
  const columns = useMemo(() => getETFTableColumns(), []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    sortDescFirst: true,
    state: {
      sorting,
    },
  });

  if (isInitialLoading) {
    // first fetch
    return <TableSkeleton rows={5} />;
  }

  return <ETFTable table={table} />;
};

export default ETFListContent;
