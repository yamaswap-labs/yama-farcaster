import { Net, NetConfig, useNet } from '@/hooks/useNet';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// networkIcons
const networkIcons = {
    [Net.Solana]: '/solana.png',
    [Net.Evm]: '/base.png',
    //   [Net.Sui]: '/sui.png',
    //   [Net.EvmJu]: '/bsc.png',
};

export const NetButton = () => {
    const [selected, setSelected] = useNet();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (net: Net) => {
        setSelected(net);
        setIsOpen(false);
    }

    return (
        <div className={'dropdown dropdown-end'}>

            <div tabIndex={0} role="button" className="relative size-6">
                <Image fill src={networkIcons[selected]} alt={selected} />
            </div>

            <ul tabIndex={0} className="z-1 dropdown-content menu w-52 rounded-18px p-2 shadow-sm bg-black">
                <li className="menu-title font-normal text-zinc-400">Select a network</li>
                {NetConfig.map((item) => (
                    <li key={item.value}>
                        <a
                            onClick={() => {
                                setSelected(item.value);
                            }}
                        >
                            <div className="relative size-5">
                                <Image fill className="size-full" src={networkIcons[item.value]} alt={item.text} />
                            </div>
                            <span>{item.text}</span>
                            {selected === item.value && (
                                <div className="badge badge-xs size-2 bg-green-500"></div>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}