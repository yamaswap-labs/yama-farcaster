'use client';

import { LoginOrRegisterResp } from '@/api/login-or-register/route';
import { useAnchorProvider } from '@/components/solana/solana-provider';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Notification } from '@/components/ui/notification';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Net, useNet } from '@/hooks/useNet';
import { useInviteCode } from '@/hooks/useUserInfo';
import { ApiCommonResponse } from '@/lib/api';
import { APP_ROUTES_MAP } from '@/lib/routes';
import { cn } from '@/lib/utils';
import useLoginStore from '@/store/useLoginStore';
import * as anchor from '@coral-xyz/anchor';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
// import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { WalletName } from '@solana/wallet-adapter-base';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';
import { useWallet, WalletNotSelectedError } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAccount, useDisconnect } from 'wagmi';
import idl from '../../../server/program/idl/iswap.json';
import { Iswap } from '../../../server/program/types/iswap';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const walletOptions = [
    // wallet only for solana
    {
        id: 'phantom',
        name: 'Phantom',
        type: 'solana',
        downloadUrl: 'https://phantom.app/download',
        installed: false,
    },
    // okx wallet supports both
    {
        id: 'okx',
        name: 'OKX',
        type: 'both', // both solana and evm
        downloadUrl: 'https://www.okx.com/web3/wallet',
        installed: false,
    },
    // wallet only for evm
    {
        id: 'metamask',
        name: 'MetaMask',
        type: 'evm',
        downloadUrl: 'https://metamask.io/download/',
        installed: false,
    },
];

const postLoginOrRegister = async ({
    walletAddress,
    inviterCode,
}: {
    walletAddress: string;
    inviterCode?: string;
}): Promise<LoginOrRegisterResp> => {
    return await fetch('/api/login-or-register', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, inviterCode: inviterCode ?? '' }),
    }).then((res) => res.json());
};

const NOTIFICATION_ID = {
    WALLET_CONNECT_SUCCESS: 'wallet-connect-success',
    USER_INITIALIZED: 'user-initialized',
} as const;

export function UnifiedWalletButton() {
    // is dialog open
    const [isOpen, setIsOpen] = useState(false);
    const [net, setNet] = useNet();
    // options of wallets
    const [wallets, setWallets] = useState(walletOptions);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useClickOutside<HTMLDivElement>(() => setDropdownOpen(false));
    const router = useRouter();
    const [inviteCode, setInviteCode] = useInviteCode();
    const isLogin = useLoginStore((state) => state.isLogin);

    const solanaWallet = useWallet();
    const evmAccount = useAccount();

    const isOkxConnected =
        typeof window !== 'undefined' &&
        window.okxwallet &&
        window.okxwallet.solana &&
        window.okxwallet.solana.isConnected;
    const { disconnect } = useDisconnect();
    const isSolanaConnected = solanaWallet.connected;
    const isEvmConnected = evmAccount.isConnected;
    // const isConnected =
    //     (net === Net.Solana && (isSolanaConnected || isOkxConnected)) ||
    //     (net === Net.Evm && isEvmConnected);

    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        const connected =
            (net === Net.Solana && (isSolanaConnected || isOkxConnected)) ||
            (net === Net.Evm && isEvmConnected);
        setIsConnected(connected);
    }, [net, solanaWallet.connected, isOkxConnected, isEvmConnected]);

    const provider = useAnchorProvider();
    const [program, setProgram] = useState<anchor.Program<Iswap> | null>(null);
    const [okxPublicKey, setOkxPublicKey] = useState<string | null>(null);

    const initializeProgram = useCallback(async () => {
        if (!provider) return;
        try {
            const programInstance = new anchor.Program(idl as Iswap, provider);
            setProgram(programInstance);
        } catch (error) {
            console.error('Failed to initialize program:', error);
        }
    }, [provider]);

    const toastUserInitialized = useCallback(() => {
        toast.custom(
            <Notification
                title={'User Account Initialized Success'}
                content={''}
                confirmText={'OK'}
                onConfirm={() => toast.remove(NOTIFICATION_ID.USER_INITIALIZED)}
                onClose={() => toast.remove(NOTIFICATION_ID.USER_INITIALIZED)}
            />,
            {
                id: NOTIFICATION_ID.USER_INITIALIZED,
                position: 'bottom-right',
            },
        );
    }, []);

    const getReferralCode = useCallback(() => {
        if (typeof window === 'undefined') return null;

        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('code');
    }, []);

    const inviterCode = getReferralCode() ?? '';

    const { mutate: loginOrRegister } = useMutation({
        mutationKey: ['dapp-login-or-register'],
        mutationFn: postLoginOrRegister,
        onSuccess: async (json) => {
            if (json.code !== 0) {
                throw new Error('Dapp login or register error');
            }

            if (!!json.data.token) {
                const { address, token } = json.data;
                await useLoginStore.getState().login(address, token);

                const res: ApiCommonResponse<{ code: string }> = await fetch(
                    '/point-api/dapp/user/get_invite_code',
                    {
                        method: 'GET',
                        headers: { 'x-token': token },
                    },
                ).then((res) => res.json());
                if (res.code !== 0) {
                    throw new Error('Dapp get invite code error, ' + res.msg);
                }
                setInviteCode(res.data.code);
            }
        },
    });

    const initializeUser = useCallback(
        async (loginResData: LoginOrRegisterResp['data']) => {
            if (!program || !loginResData.is_new) return;

            try {
                const referralCode = getReferralCode();
                let inviterAccount = null;

                if (referralCode) {
                    try {
                        inviterAccount = new PublicKey(referralCode);
                    } catch (error) {
                        console.error('Invalid referral code:', error);
                    }
                }

                await program.methods
                    .initializeUser(
                        'getf', // nickname
                        inviterAccount, // directInviter
                        'https://yama.mypinata.cloud/ipfs/bafkreie73g36u3qd7neiv74lzrfmnc2c2ujkvyc7r7wn3ghrmwhcw6m55m', //avatar.png
                    )
                    .accounts({
                        inviterAccount: inviterAccount,
                        user: loginResData.address,
                    })
                    .rpc();

                console.log('User initialized successfully');
                toastUserInitialized();
            } catch (error) {
                console.error('Failed to initialize user:', error);
            }
        },
        [getReferralCode, program, toastUserInitialized],
    );

    useEffect(() => {
        if ((solanaWallet.connected || isOkxConnected) && !program) {
            initializeProgram();
        }
    }, [initializeProgram, program, solanaWallet.connected, isOkxConnected]);

    useEffect(() => {
        console.log({
            isSolanaConnected: solanaWallet.connected,
            isEvmConnected: evmAccount.isConnected,
            solanaWallet: solanaWallet.publicKey?.toString(),
            evmAccount: evmAccount.address,
            isOkxConnected,
            okxWallet: okxPublicKey,
            isLogin,
        });

        if (!isLogin && program && solanaWallet.connected && !!solanaWallet.publicKey) {
            loginOrRegister({ walletAddress: solanaWallet.publicKey.toString(), inviterCode });
            return;
        }

        if (!isLogin && program && isOkxConnected && !!okxPublicKey) {
            loginOrRegister({ walletAddress: okxPublicKey, inviterCode });
            return;
        }

        if (!isLogin && evmAccount.isConnected && !!evmAccount.address) {
            loginOrRegister({ walletAddress: evmAccount.address, inviterCode });
            return;
        }
    }, [
        program,
        solanaWallet.connected,
        solanaWallet.publicKey,
        isOkxConnected,
        okxPublicKey,
        evmAccount.isConnected,
        evmAccount.address,
        loginOrRegister,
        inviterCode,
        isLogin,
    ]);

    useEffect(() => {
        const cleanupWalletState = async () => {
            if (net === Net.Solana && isEvmConnected) {
                await disconnect();
            } else if (net === Net.Evm && isSolanaConnected) {
                await solanaWallet.disconnect();
            }
        };
        cleanupWalletState();
    }, [net, isEvmConnected, isSolanaConnected, disconnect, solanaWallet]);

    useEffect(() => {
        const checkInstalledWallets = async () => {
            const updatedWallets = [...walletOptions];

            /**
             * mini app environment
             */
            // use mini app API to detect wallet
            if (typeof fc !== 'undefined' && typeof fc.request === 'function') {
                const installedWallets = await fc.request({
                    method: 'wallet_getInstalled'
                });

                updatedWallets.forEach(wallet => {
                    wallet.installed = installedWallets.includes(wallet.id);
                });
                setWallets(updatedWallets);
                return;
            }

            /**
             * normal environment
             */
            if (window.phantom) {
                const phantomIndex = updatedWallets.findIndex((w) => w.id === 'phantom');
                if (phantomIndex !== -1) {
                    updatedWallets[phantomIndex].installed = true;
                }
            }

            if (window.ethereum?.isMetaMask) {
                const metamaskIndex = updatedWallets.findIndex((w) => w.id === 'metamask');
                if (metamaskIndex !== -1) {
                    updatedWallets[metamaskIndex].installed = true;
                }
            }

            if (window.ethereum?.isCoinbaseWallet) {
                const coinbaseIndex = updatedWallets.findIndex((w) => w.id === 'coinbase');
                if (coinbaseIndex !== -1) {
                    updatedWallets[coinbaseIndex].installed = true;
                }
            }

            if (window.okxwallet) {
                const okxIndex = updatedWallets.findIndex((w) => w.id === 'okx');
                if (okxIndex !== -1) {
                    updatedWallets[okxIndex].installed = true;
                }
            }

            setWallets(updatedWallets);
        };

        checkInstalledWallets();
    }, []);

    const toastWalletConnectSuccess = useCallback(() => {
        const address = net === Net.Solana ? solanaWallet.publicKey?.toBase58() : evmAccount.address;

        if (!address) return;

        toast.custom(
            <Notification
                title={'Wallet Connect Success'}
                content={`Your wallet address is ${address}`}
                confirmText={'OK'}
                onConfirm={() => toast.remove(NOTIFICATION_ID.WALLET_CONNECT_SUCCESS)}
                onClose={() => toast.remove(NOTIFICATION_ID.WALLET_CONNECT_SUCCESS)}
            />,
            {
                id: NOTIFICATION_ID.WALLET_CONNECT_SUCCESS,
                position: 'bottom-right',
            },
        );
    }, [net, solanaWallet.publicKey, evmAccount.address]);

    useEffect(() => {
        if (net === Net.Evm && isEvmConnected) {
            toastWalletConnectSuccess();
        }
    }, [net, isEvmConnected, toastWalletConnectSuccess]);

    useEffect(() => {
        if (net === Net.Solana && isSolanaConnected) {
            toastWalletConnectSuccess();
        }
    }, [net, isSolanaConnected, toastWalletConnectSuccess]);

    const handleConnectWallet = async (walletId: string) => {
        // current walllet options
        const wallet = wallets.find((w: any) => w.id === walletId);

        if (!wallet) return;

        // when wallet isn't installed
        if (!wallet.installed) {
            /**
             * mini app environment
             */
            if (typeof fc !== 'undefined' && typeof fc.request === 'function') {
                // 使用小程序打开下载链接
                fc.request({
                    method: 'openUrl',
                    params: { url: wallet.downloadUrl }
                });
                return;
            }
            /**
             * normal environment
             */
            else if (window?.open) {
                setIsOpen(false);
                window.open(wallet.downloadUrl, '_blank');
                return;
            }
            else {
                console.error("[handleConnectWallet]: without fc or window");
            }
            setIsOpen(false);
            return;
        }

        // installed
        try {
            /**
             * mini app environment
             */
            if (typeof fc !== 'undefined' && typeof fc.request === 'function') {
                // solana
                if (net === Net.Solana) {
                    // okx
                    if (wallet.id === 'okx') {
                        const result = await fc.request({
                            method: 'wallet_connectSolana',
                            params: { wallet: 'okx' }
                        });
                        if (result.publicKey) {
                            setOkxPublicKey(result.publicKey);
                            setIsOpen(false);
                            console.log(`OKX Solana address: ${result.publicKey}`);
                        }
                    }
                    // other wallet
                    else {
                        await solanaWallet.select(wallet.id as WalletName);
                        await solanaWallet.connect();
                    }
                }
                // evm
                else if (net === Net.Evm) {
                    const accounts = await fc.request({
                        method: 'wallet_requestAccounts',
                        params: { wallet: wallet.id }
                    });
                    if (accounts && accounts[0]) {
                        setEvmAddress(accounts[0]);
                    }
                }
            }
            /**
             * normal environment
            */
            else {
                /**
                 * solana
                 */
                // okx wallet & solana
                // logic to handling okx wallet remains the same
                if (wallet.id === 'okx' && net === Net.Solana) {
                    // console.log("------okx------");
                    if (typeof window !== 'undefined' && window?.okxwallet?.solana) {
                        try {
                            // connect okx wallet
                            const provider = window.okxwallet.solana;
                            const resp = await provider.connect();

                            if (resp && resp.publicKey) {
                                // record public key of okx
                                setOkxPublicKey(resp.publicKey.toString());
                                // close dialog
                                setIsOpen(false);
                                console.log(`OKX Solana address: ${resp.publicKey.toString()}`);
                            }
                            return;
                        }
                        catch (error) {
                            console.error('OKX Solana connect error:', error);
                            return;
                        }
                    }
                    else {
                        console.error("[handleConnectWallet]: fc doesn't exist & OKX wallet plugin dosen't detect solana provider")
                        toast.error('OKX 钱包插件未检测到 solana provider');
                    }
                }

                // (other wallets only for solana || for both) & solana
                // simplify the process on wallet connection
                else if ((wallet.type === 'solana' || wallet.type === 'both') && net === Net.Solana) {
                    // console.log("-------solana------");
                    const validWalletName = wallet.id as WalletName;

                    await solanaWallet.disconnect();
                    validWalletName === 'phantom'
                        ? await solanaWallet.select(PhantomWalletName)
                        : await solanaWallet.select(validWalletName);

                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Connection timeout')), 5000),
                    );

                    await Promise.race([solanaWallet.connect(), timeoutPromise]);

                    await initializeProgram();
                }

                /**
                 * evm
                 */
                // (other wallets only for evm || for both) & evm
                else if ((wallet.type === 'evm' || wallet.type === 'both') && net === Net.Evm) {
                    if (wallet.id === 'okx') {
                        if (typeof window !== 'undefined' && window.okxwallet && window.okxwallet.request) {
                            try {
                                const accounts = await window.okxwallet.request({ method: 'eth_requestAccounts' });
                                if (accounts && accounts[0]) {
                                    // TODO: can setState or do something such as storing evm address
                                    console.log('OKX EVM address:', accounts[0]);
                                    // close dialog
                                    setIsOpen(false);
                                    // can show toast or update other UI
                                }
                                return;
                            } catch (error) {
                                console.error('OKX EVM connect error:', error);
                                return;
                            }
                        } else {
                            toast.error('OKX 钱包插件未检测到 EVM provider');
                            return;
                        }
                    } else {
                        document.getElementById('rainbow-connect-button')?.click();
                    }
                }
            }

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            if (error instanceof WalletNotSelectedError) {
                console.warn('Wallet not selected');
            }
        }
        setIsOpen(false);

    };

    const switchEcosystem = (ecosystem: 'solana' | 'evm') => {
        if (ecosystem === 'solana') {
            setNet(Net.Solana);
        } else {
            setNet(Net.Evm);
        }
    };

    // return wallets in current net
    const getCurrentWallets = () => {
        if (net === Net.Solana) {
            return wallets.filter((w: any) => w.type === 'solana' || w.type === 'both');
        } else {
            return wallets.filter((w: any) => w.type === 'evm' || w.type === 'both');
        }
    };

    return (
        <>
            {!isConnected ? (
                // disconnected
                <button
                    onClick={() => setIsOpen(true)}
                    className={cn('btn bg-0 btn-sm shadow-none border-[#fff] rounded-full border-[1px] pt-2 pr-3 pb-2 pl-3 text-xs text-white bg-transparent font-normal')}
                >
                    Connect wallet
                </button>
            ) : (
                // connected
                <div className="dropdown dropdown-end" onClick={() => setDropdownOpen((v: any) => !v)}>
                    <div tabIndex={0} role="button" className="btn bg-0 btn-sm shadow-none rounded-full border-white border-[1px] pt-1 pr-1.5 pb-1 pl-1.5 text-xs text-white bg-transparent font-normal">
                        <div className="avatar size-6 rounded-full border-[1px] border-white bg-white"></div>
                        {net === Net.Solana
                            ? okxPublicKey
                                ? okxPublicKey.slice(0, 4) + '...' + okxPublicKey.slice(-4)
                                : solanaWallet.publicKey?.toBase58().slice(0, 4) +
                                '...'
                            : evmAccount.address
                                ? evmAccount.address.slice(0, 4) + '...'
                                : ''}
                        <ChevronDown className="size-4 text-text stroke-[#9f9fa3]" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu z-50 w-52 gap-2 rounded-box p-2 shadow-sm bg-black"
                    >
                        <li>
                            <Link
                                className="flex h-[38px] items-center"
                                href={APP_ROUTES_MAP.PORTFOLIO}
                                onClick={() => {
                                    setDropdownOpen(false);
                                }}
                            >
                                <Image src="/myWallet.png" alt="my wallet" width={16.67} height={13.33} />
                                My Wallet
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={'/referral'}
                                className="flex h-[38px] items-center"
                                onClick={() => {
                                    setDropdownOpen(false);
                                }}
                            >
                                <Image src="/gift.png" alt="referral" width={16.67} height={13.33} />
                                <span className="text-sm text-white">Referral</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                className="flex h-[38px] items-center"
                                onClick={async () => {
                                    setDropdownOpen(false);
                                    if (net === Net.Solana) {
                                        if (
                                            typeof window !== 'undefined' &&
                                            window.okxwallet &&
                                            window.okxwallet.solana &&
                                            okxPublicKey
                                        ) {
                                            await window.okxwallet.solana.disconnect();
                                            setOkxPublicKey(null);
                                        } else {
                                            await solanaWallet.disconnect();
                                        }
                                    } else if (net === Net.Evm) {
                                        disconnect();
                                    }

                                    useLoginStore.getState().logout();
                                    window.location.reload();
                                }}
                            >
                                <Image src="/logOut.png" alt="disconnect" width={16.67} height={13.33} />
                                <span className="text-sm text-white">Disconnect</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* connect wallet dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="h-[353px] w-[315px] rounded-[18px] border border-[#FFFFFF66] bg-[#FFFFFF0D] p-0 backdrop-blur-[32px]">
                    <VisuallyHidden>
                        <DialogTitle></DialogTitle>
                    </VisuallyHidden>
                    <div className="relative flex flex-col gap-[16px] p-[20px]">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-[20px] top-[16px] flex h-[24px] w-[24px] items-center justify-center"
                        ></button>

                        {/* header */}
                        <h2 className="font-[PingFang SC] text-[16px] font-semibold leading-[24px] tracking-[0%] text-white">
                            Connect Wallet
                        </h2>

                        <div className="flex flex-col gap-[10px]">
                            {getCurrentWallets().map((wallet: any) => (
                                <button
                                    key={wallet.id}
                                    className="flex h-[40px] w-[275px] items-center justify-between rounded-[8px] border border-[#FFFFFF33] px-[10px] py-[6px] transition-colors hover:bg-[#FFFFFF1A]"
                                    onClick={() => handleConnectWallet(wallet.id)}
                                >
                                    <span className="font-[PingFang SC] text-[14px] font-medium leading-[22px] tracking-[0%] text-white">
                                        {wallet.name}
                                    </span>
                                    {wallet.installed && (
                                        <span className="font-[PingFang SC] text-[14px] font-medium leading-[22px] tracking-[0%] text-[#FFFFFF80]">
                                            installed
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
