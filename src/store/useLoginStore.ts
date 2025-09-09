import { create } from 'zustand';

export type LoginState = {
  isLogin: boolean;
  token: string;
  walletAddress?: string; // optional
};

// define types of anctions
export type LoginActions = {
  // receive walletAddress and token when login
  login: (walletAddress: string, token: string) => void;
  // reset when logout
  logout: () => void;
};

// default status
export const initialState: LoginState = {
  isLogin: false,
  token: '',
  walletAddress: undefined,
};

// create store which includes LoginState & LoginActions
// recieve factory function (set) => {...} to update
// factory function: create and return an object, replacing new keyword
export const useLoginStore = create<LoginState & LoginActions>()((set) => ({
  // status attributes (isLogin, token, walletAddress)
  ...initialState,
  // operation methods
  login: (walletAddress: string, token: string) => {
    // set isLogin true, and store isLogin & token & walletAddress
    set({ isLogin: true, token, walletAddress });
  },
  logout: () => {
    // useLoginStore.persist.clearStorage();
    // store initialState to reset to initial status
    set(initialState);
  },
}));

export default useLoginStore;
