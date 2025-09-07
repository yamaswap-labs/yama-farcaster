import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const enum Net {
  Solana = 'Solana',
  Evm = 'Base',
  //   Sui = 'Sui',
  //   BSC = 'BSC',
  //   Aptos = 'Aptos',
  //   EvmJu = 'Juchain',
}

export const NetAtom = atomWithStorage<Net>('selected-network', Net.Solana);

export const NetConfig = [Net.Solana, Net.Evm].map((value) => ({
  value,
  text: value,
}));

export function useNet() {
  return useAtom(NetAtom);
}
