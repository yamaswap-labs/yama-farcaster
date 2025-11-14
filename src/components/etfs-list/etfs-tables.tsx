'use client';
import { getETFList } from '@/api/rest/get_etf_list';
import HotSvg from '@/assets/tab-hot.svg';
import MarkedSvg from '@/assets/tab-marked.svg';
import NewSvg from '@/assets/tab-new.svg';
// import { BasicTable, BasicTableProps } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollectETFContext } from '@/contexts/CollectETFContext';
import { useQuery } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';
import dayjs, { ManipulateType } from 'dayjs';
// import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
// import CollectedETFTable from './CollectedETFTable';
// import { ETFListContent } from './ETFTable';
import SearchETFDialog from './SearchETFDialog';

export const TABLE_TABS_MAP = {
    // 热门
    HOT: { value: 'hot', label: 'Hot', icon: HotSvg },
    // 最新
    NEW: { value: 'new', label: 'New', icon: NewSvg },
    // 已收藏
    MARKED: { value: 'marked', label: 'Marked', icon: MarkedSvg },
};

// export const ETFsListTable = <T extends { public_key: string }>({
//     table,
//     tableProps = {},
// }: BasicTableProps<T>) => {
//     const router = useRouter();

//     return (
//         <BasicTable<T>
//             table={table}
//             tableProps={tableProps}
//             bodyRowProps={{
//                 className: 'hover:cursor-pointer',
//                 onClick: (e, data) => {
//                     router.push(`/etfs/${data.public_key}`);
//                 },
//             }}
//         />
//     );
// };

export type PageFilters = {
    // table tab
    view: string;
    // duration tab
    dur: string;
};

function ETFTables() {
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [fastSort, setFastSort] = useState<string>(TABLE_TABS_MAP.HOT.value);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'price_change', desc: true }]);
    const [duration, setDuration] = useState<{ period: number; unit: ManipulateType }>({
        period: 5,
        unit: 'm',
    }); // 5m
    const { fetchCollected, myCollected } = useCollectETFContext();

    const fetchETFs = useCallback(() => {
        const { id: sortKey = 'id', desc: sortDesc = true } = sorting[0] || {};

        return getETFList({
            from_timestamp: dayjs().subtract(duration.period, duration.unit).unix(),
            page: 1,
            limit: 100,
            order: sortDesc ? 'DESC' : 'ASC',
            sort: sortKey,
        }).then((d: any) => {
            setIsInitialLoading(false);
            return {
                items: d.items.filter((item: any) =>
                    [
                        '2KqrSZvEJw5D9vqW3SJvEgMC3Zp4qgbeWXufMkj2auYn',
                        '2QRYmLQtpdcBPojNhSaaFJqaYFNrUngx3kBiXXuBxVRT',
                    ].includes(item.public_key),
                ),
                meta: d.meta,
            };
        });
    }, [sorting, duration]);

    const { data: etfs = [] } = useQuery({
        enabled: fastSort !== 'marked',
        queryKey: ['getETFs', duration],
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        // refetchInterval: process.env.NODE_ENV === 'development' ? 20000 : 5000,
        select: ({ items }) => items,
        queryFn: fetchETFs,
    });

    const onFastSortChange = useCallback((value: string) => {
        setFastSort(value);
        setSorting([
            {
                id: { hot: 'price_change', new: 'create_at', marked: 'id' }[value] as string,
                desc: true,
            },
        ]);
        // updateParams({ view: value });
    }, []);

    const onTabChange = useCallback((value: string) => {
        switch (value) {
            case '5m':
                setDuration({ period: 5, unit: 'm' });
                break;
            case '1h':
                setDuration({ period: 1, unit: 'h' });
                break;
            case '4h':
                setDuration({ period: 4, unit: 'h' });
                break;
            case '24h':
                setDuration({ period: 24, unit: 'h' });
                break;
            case '7d':
                setDuration({ period: 7, unit: 'd' });
                break;
            default:
                break;
        }
        // updateParams({ dur: value });
    }, []);

    useEffect(() => {
        // refetch on each fast-sort tab switch
        fetchCollected();
    }, [fastSort, fetchCollected]);

    return (
        // TODO
        false ?
            <p className="flex flex-col items-center font-bold">Coming Soon</p> :
            <div className="h-full w-full overflow-x-auto rounded-18px bg-white/5 p-6 backdrop-blur-[32px]">
                <div className="flex justify-between gap-6">
                    <div className="flex gap-6">
                        <Tabs defaultValue="hot" onValueChange={onFastSortChange}>
                            <TabsList className={`bg-white/[0.03]`}>
                                {Object.values(TABLE_TABS_MAP).map(({ value, label, icon: Icon }) => {
                                    return (
                                        <TabsTrigger key={value} value={value}>
                                            <Icon viewBox="0 0 16 17" />
                                            {label}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                        <SearchETFDialog open={searchDialogOpen} setOpen={setSearchDialogOpen} />
                    </div>
                    <Tabs defaultValue="5m" onValueChange={onTabChange}>
                        <TabsList className={`bg-white/[0.03]`}>
                            <TabsTrigger value="5m">{'5m'}</TabsTrigger>
                            <TabsTrigger value="1h">{'1h'}</TabsTrigger>
                            <TabsTrigger value="4h">{'4h'}</TabsTrigger>
                            <TabsTrigger value="24h">{'24h'}</TabsTrigger>
                            <TabsTrigger value="7d">{'7d'}</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                {/* 
            <div className="mt-4">
                {fastSort !== TABLE_TABS_MAP.MARKED.value && (
                    <ETFListContent
                        data={etfs}
                        isInitialLoading={isInitialLoading}
                        sorting={sorting}
                        setSorting={setSorting}
                    />
                )}
                {fastSort === TABLE_TABS_MAP.MARKED.value && <CollectedETFTable data={myCollected} />}
            </div> */}
            </div>
    );
}

export default ETFTables;
