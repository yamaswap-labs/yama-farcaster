import * as React from 'react';

import SortAscSvg from '@/assets/sort-asc.svg';
import SortDescSvg from '@/assets/sort-desc.svg';

import {
  Column,
  flexRender,
  SortDirection,
  Table as TanStackTableType,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Filter } from 'lucide-react';
import { HTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Input, InputProps } from './input';
import { Skeleton } from './skeleton';

const tableVariants = cva(['w-full caption-bottom'], {
  variants: {},
  defaultVariants: {},
});

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <table ref={ref} className={cn(tableVariants({ className }))} {...props} />
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('text-text [&_tr]:border-b [&_tr]:hover:bg-transparent', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  ),
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border transition-colors hover:bg-white/10 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'sticky top-0 h-[38px] w-max px-3 text-left align-middle font-medium text-white/40 [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-3 align-middle text-sm [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

export type BasicTableProps<T> = {
  table: TanStackTableType<T>;
  tableProps?: TableProps;
  bodyProps?: TableBodyProps;
  bodyRowProps?: Omit<TableRowProps, 'onClick'> & {
    onClick?: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, data: T) => void;
  };
};

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  size = 'md',
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputProps, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <Input
      {...props}
      type="text"
      size={size}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

function FilterHead({ column }: { column: Column<any, unknown> }) {
  const [filterValue, setFilterValue] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const { filterVariant, userWallet, filterOptions } =
    (column.columnDef.meta as {
      filterVariant: 'range' | 'select' | 'account';
      userWallet?: string;
      filterOptions?: string[];
    }) ?? {};

  const renderFilterIcon = useCallback(() => {
    return (
      <Filter className={cn('size-4 cursor-pointer', column.getIsFiltered() ? 'text-white' : '')} />
    );
  }, [column]);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === 'range'
        ? []
        : Array.from(filterOptions ?? column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column, filterVariant, filterOptions],
  );

  if (filterVariant === 'account') {
    return (
      <DropdownMenu
        open={filterOpen}
        onOpenChange={(v) => {
          // if there has cell custom filter value, toggle to reset filter value first
          if (v && columnFilterValue && columnFilterValue !== filterValue) {
            column.setFilterValue('');
            return;
          }

          setFilterOpen(v);
        }}
      >
        <DropdownMenuTrigger asChild>{renderFilterIcon()}</DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-2">
          <DebouncedInput
            value={filterValue}
            onChange={(value) => setFilterValue(value.toString())}
          />
          {!!userWallet ? (
            <Button
              size={'sm'}
              variant={'plain'}
              className="bg-white/35"
              onClick={() => setFilterValue(userWallet ?? '')}
            >
              {'Filter your wallet'}
            </Button>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size={'sm'}
              variant={'plain'}
              className="bg-white/35"
              onClick={() => {
                setFilterValue('');
                column.setFilterValue('');
                setFilterOpen(false);
              }}
            >
              {'Reset'}
            </Button>
            <Button
              size={'sm'}
              variant={'plain'}
              className="bg-white/95 text-black"
              onClick={() => {
                column.setFilterValue(filterValue);
                setFilterOpen(false);
              }}
            >
              {'Apply'}
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (filterVariant === 'select') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{renderFilterIcon()}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem key={'All'} onSelect={() => column.setFilterValue('')}>
            All
          </DropdownMenuItem>
          {sortedUniqueValues.map((value) => (
            //  dynamically generated select options from faceted values feature
            <DropdownMenuItem key={value} onSelect={() => column.setFilterValue(value)}>
              {value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (filterVariant === 'range') {
    return (
      <div>
        <div className="flex space-x-2">
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [value, old?.[1]])
            }
            placeholder={`Min ${
              column.getFacetedMinMaxValues()?.[0] !== undefined
                ? `(${column.getFacetedMinMaxValues()?.[0]})`
                : ''
            }`}
            className="w-24 rounded border shadow"
          />
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [old?.[0], value])
            }
            placeholder={`Max ${
              column.getFacetedMinMaxValues()?.[1]
                ? `(${column.getFacetedMinMaxValues()?.[1]})`
                : ''
            }`}
            className="w-24 rounded border shadow"
          />
        </div>
        <div className="h-1" />
      </div>
    );
  }

  return <Filter className="size-4 cursor-pointer" />;
}

export const ArrowUpDownIcon = ({ sort }: { sort: false | SortDirection }) => {
  return (
    <div className="flex flex-col">
      <SortAscSvg
        className={cn('-mb-[3px]', !!sort && sort === 'asc' && 'text-white')}
      ></SortAscSvg>
      <SortDescSvg
        className={cn('-mt-[3px]', !!sort && sort === 'desc' && 'text-white')}
      ></SortDescSvg>
    </div>
  );
};

const BasicTable = <T,>({
  table,
  tableProps = {},
  bodyRowProps = {},
  bodyProps = {},
}: BasicTableProps<T>) => {
  return (
    <Table {...tableProps}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: `${header.getSize()}px` }}
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
                    {header.column.getCanSort() ? (
                      <button onClick={header.column.getToggleSortingHandler()}>
                        <ArrowUpDownIcon sort={header.column.getIsSorted()} />
                      </button>
                    ) : null}
                    {header.column.getCanFilter() ? (
                      <div>
                        <FilterHead column={header.column} />
                      </div>
                    ) : null}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody {...bodyProps}>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              {...bodyRowProps}
              onClick={(e) => bodyRowProps.onClick?.(e, row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={12} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

const TableSkeleton = ({
  rows = 5,
  rowClassName,
}: {
  rows: number;
  rowClassName?: HTMLAttributes<HTMLDivElement>['className'];
}) => {
  return Array.from({ length: rows }).map((__, index) => {
    return (
      <Skeleton
        key={`table-row-skeleton__${index}`}
        className={cn('mb-2 h-24', rowClassName)}
      ></Skeleton>
    );
  });
};

export {
  BasicTable,
  FilterHead,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
};
