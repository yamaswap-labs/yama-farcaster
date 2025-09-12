import { cn } from '@/lib/utils';
import { NavLogo } from './NavLogo';
import { NetButton } from './NetButton';
import LuckyDrawDialog from '../lucky-draw/LuckyDrawDialog';
import { UnifiedWalletButton } from '../custom-wallet/unifiedWalletButton';

export default function AppNav() {
    return (
        <>
            <div
                className={cn(
                    'navbar sticky inset-x-0 top-0 z-50 h-16 px-4 backdrop-blur-[32px] md:px-10',
                )}
            >
                <div className="navbar-start">
                    <NavLogo />
                </div>

                <div className="navbar-end gap-[10px]">
                    <LuckyDrawDialog />

                    <NetButton />

                    <UnifiedWalletButton />
                </div>
            </div>
        </>
    );
}