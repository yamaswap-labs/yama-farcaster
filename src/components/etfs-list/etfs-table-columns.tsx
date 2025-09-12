'use client';
import { CollectType } from '@/api/rest/etf_collect';
import { ETFDTO } from '@/api/rest/get_etf_list';
import MarkStarSvg from '@/assets/mark-star.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ClipboardTrigger } from '@/components/ui/clipboard';
import { Rate } from '@/components/ui/rate';
import LoadingSpinner from '@/components/ui/spinner';
import { BasicTooltip } from '@/components/ui/tooltip';
import { useCollectETFContext } from '@/contexts/CollectETFContext';
import { cn, ellipsify, formatBigNumber, formatNumber } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';
import { FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';

export type ETFModel = { isCollected: boolean } & ETFDTO;

export const MarkIcon = ({ pubKey }: { pubKey: string }) => {
  const { setCachedCollectedPubkeys, postCollect, cachedCollectedPubkeys } = useCollectETFContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  const toggleMarked = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e: any) => {
      e.stopPropagation();
      setIsSubmitting(true);
      postCollect(pubKey, isCollected ? CollectType.CANCEL : CollectType.COLLECT)
        .then(({ success }) => {
          if (success) {
            setIsCollected((prev: any) => !prev);
            setCachedCollectedPubkeys((prev: any) => {
              return isCollected ? prev.filter((p: any) => p !== pubKey) : prev.concat([pubKey]);
            });
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [pubKey, isCollected, postCollect, setCachedCollectedPubkeys],
  );

  useEffect(() => {
    if (cachedCollectedPubkeys.length) {
      setIsCollected(cachedCollectedPubkeys.includes(pubKey));
    }
  }, [cachedCollectedPubkeys, pubKey]);

  return isSubmitting ? (
    <LoadingSpinner size={20} />
  ) : (
    <Button
      onClick={toggleMarked}
      variant={'link'}
      className={cn(
        'p-0 [&_svg]:size-5',
        isCollected ? 'text-transparent [&_svg]:fill-[#FFCC00]' : 'text-white/40',
      )}
    >
      <MarkStarSvg />
    </Button>
  );
};

export const PublicKeyCell: FC<{
  name: string | undefined;
  token: string | undefined;
  avatar: string | undefined;
}> = ({ token, name, avatar }) => {
  return (
    <div className="flex w-max flex-row items-center gap-2">
      <Avatar className="size-8">
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-white/10">
          {name ? (
            <span className="text-sm">{name.charAt(0).toLocaleUpperCase()}</span>
          ) : (
            <span className="text-[10px]">{token?.slice(0, 3) || '-'}</span>
          )}
        </AvatarFallback>
      </Avatar>
      <div className="">
        <span className="text-sm">{name || '-'}</span>
        <div className="flex items-center gap-2">
          <ClipboardTrigger className="text-xs text-text" text={token}>
            <BasicTooltip content={token}>
              <span>{ellipsify(token)}</span>
            </BasicTooltip>
          </ClipboardTrigger>

          <a
            href={`https://solscan.io/token/${token}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Solscan"
            onClick={(e) => e.stopPropagation()}
          >
            <Image width={16} height={16} src="/solscan.webp" alt="solscan" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const getETFTableColumns = (): ColumnDef<ETFDTO>[] => {
  return [
    {
      accessorKey: 'public_key',
      header: '#',
      size: 24,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({
        row: {
          original: { public_key },
        },
      }) => <MarkIcon pubKey={public_key} />,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      enableColumnFilter: false,
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
      cell: ({
        row: {
          original: { latest_price },
        },
      }) => {
        return formatNumber(latest_price);
      },
    },
    {
      accessorKey: 'price_change',
      header: 'Change(%)',
      enableSorting: true,
      enableColumnFilter: false,
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
      accessorKey: 'latest_supply',
      header: 'Volume',
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({
        row: {
          original: { latest_supply },
        },
      }) => {
        if (!latest_supply) return null;

        return (
          <div className="flex flex-col">
            <div className="text-sm font-medium">{`${formatBigNumber(latest_supply)}`}</div>
            <div className="text-xs">
              <span className="text-number-positive">{`-`}</span>
              <span className="text-text">{`/`}</span>
              <span className="text-number-negative">{`-`}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'latest_holders',
      header: 'Holders',
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'aum',
      header: 'AUM',
      enableSorting: true,
      enableColumnFilter: false,
      sortingFn: (rowA, rowB) => {
        const valueA = Number(rowA.original.latest_supply) * Number(rowA.original.latest_price);
        const valueB = Number(rowB.original.latest_supply) * Number(rowB.original.latest_price);
        return valueA - valueB;
      },
      cell: ({
        row: {
          original: { latest_supply, latest_price },
        },
      }) => {
        return (
          <div>
            {formatBigNumber(Number(latest_supply) * Number(latest_price), {
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
      cell: ({
        row: {
          original: { ytd },
        },
      }) => {
        return <Rate>{formatNumber(ytd)}</Rate>;
      },
    },
    {
      accessorKey: 'create_at',
      header: 'ETF age',
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({
        row: {
          original: { create_at },
        },
      }) => {
        const createAt = dayjs.unix(create_at).format('YYYY-MM-DD');

        const years = dayjs().diff(createAt, 'year');
        if (years) {
          return `${years}Y`;
        }

        const months = dayjs().diff(createAt, 'month');
        if (months) {
          return `${months}M`;
        }

        const days = dayjs().diff(createAt, 'day');
        if (days) {
          return `${days}D`;
        }

        const hours = dayjs().diff(createAt, 'hour');
        if (hours) {
          return `${hours}h`;
        }

        const minutes = dayjs().diff(createAt, 'minute');
        if (minutes) {
          return `${minutes}m`;
        }
        const seconds = dayjs().diff(createAt, 'second');
        if (seconds) {
          return `${seconds}s`;
        }
      },
    },
    {
      accessorKey: 'status',
      header: 'NoMint',
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({
        row: {
          original: { status },
        },
      }) => {
        return <span className="text-number-negative">No</span>;
        // return status ? (
        //   <span className="text-number-positive">Yes</span>
        // ) : (
        //   <span className="text-number-negative">No</span>
        // );
      },
    },
  ];
};

export const getSimpleETFTableColumns = (): ColumnDef<ETFDTO>[] =>
  getETFTableColumns().filter((e) => {
    return e.id && ['collected', 'name', 'price', 'change', 'aum', 'ytd'].includes(e.id);
  });
