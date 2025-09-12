'use client';
import ArrowRightSvg from '@/assets/arrow-right.svg';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ETFsTables from './etfs-tables';

export default function ETFsList() {
    return (
        <div className="flex h-full flex-col">
            <div className="mb-[15px] mt-[10px] flex flex-row items-center justify-between">
                {/* etf header */}
                <div className="space-y-[5px]">
                    <h1 className='text-[20px] font-semibold leading-[20px]'>{'Token ETFs'}</h1>
                    <div className="text-text text-[12px]">{'Trade ETFs, package deal tokens.'}</div>
                </div>
                {/* create new etf btn */}
                <Button
                    rounded
                    variant={'secondary'}
                    className="h-[25px] px-[10px] text-[11px] bg-[rgba(88,86,214,0.4)] border-[1px] border-solid border-[#5856D6] rounded-full"
                >
                    <Link className="flex h-[15px] size-full flex-row items-center justify-between" href={'#'}>
                        <div className="flex flex-col items-start space-y-0.5">
                            <h4 className="font-bold">{'Create New ETF'}</h4>
                        </div>
                        <ArrowRightSvg className="!w-3 !h-3" />
                    </Link>
                </Button>
            </div>

            <ETFsTables />
        </div>
    );
}
