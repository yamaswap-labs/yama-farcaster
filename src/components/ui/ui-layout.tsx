'use client';

import { PropsWithChildren, ReactNode, Suspense, useEffect, useRef } from 'react';
import { RainbowKit } from '../rainbowkit-provider';
// import toast, { Toaster } from 'react-hot-toast';
// import AiDialog from '../ai-dialog';
// import { ExplorerLink } from '../cluster/cluster-ui';
import AppNav from '../nav';

export function UiLayout({ children }: PropsWithChildren) {
    return (
        <RainbowKit>
            <AppNav />

            <div className="h-[calc(100vh-128px-env(safe-area-inset-bottom))] w-screen overflow-y-auto overflow-x-hidden sm:h-[calc(100vh-64px)]">
                <div className="mx-auto h-full w-full px-4 md:px-10">
                    <Suspense
                        fallback={
                            <div className="my-32 text-center">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        }
                    >
                        {children}
                    </Suspense>
                </div>

                {/* <Toaster
            toastOptions={{
              style: {
                background: '#101018',
                color: 'white',
                border: '1px solid #FFFFFF66',
              },
            }}
            containerStyle={{ left: 0, right: 0, top: 0, bottom: 0 }}
          /> */}
            </div>

            {/* <AiDialog /> */}
        </RainbowKit>
    );
}