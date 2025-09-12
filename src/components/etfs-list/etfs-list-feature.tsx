'use client';
import CollectETFProvider from '@/providers/CollectETFProvider';
import ClientInitializer from '../client-initializer';
import ETFsList from './etfs-list-ui';

export default function ETFList() {
    return (
        <CollectETFProvider>
            <ClientInitializer>
                <ETFsList />
            </ClientInitializer>
        </CollectETFProvider>
    );
}
