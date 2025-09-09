import { ApiCommonResponse } from '@/lib/api';
import useLoginStore from '@/store/useLoginStore'; // Zustand store, handle login status
import { useQuery } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai'; // status management

// invite code management
const inviteCodeAtom = atom('');
export const useInviteCode = () => useAtom(inviteCodeAtom);

export interface UserInfo {
    address: string;
    points: number;
}

const useUserInfo = () => {
    // when using useLoginStore for the first time, store is created
    const token = useLoginStore((state: any) => state.token);
    const isLogin = useLoginStore((state: any) => state.isLogin);

    const {
        data: userInfo, // data acquired
        isLoading: isUserInfoLoading, // is the request processing
        refetch: refetchUserInfo, // provide method to refetch data manually
    } = useQuery({
        // request again when token changes, which means login method is executed
        queryKey: ['get-user-info', { token }],
        // check only when user login and token exists
        enabled: isLogin && !!token,
        // refetch data when the component is mounted
        refetchOnMount: true,
        // get actual data
        select: (data: any) => data.data,
        // function to acquire data
        queryFn: () =>
            fetch('/point-api/dapp/user/user_info', {
                // use x-token header to pass token
                headers: { 'x-token': token },
            }).then<ApiCommonResponse<UserInfo>>((res) => res.json()),
    });

    return { userInfo, isUserInfoLoading, refetchUserInfo };
};

export default useUserInfo;
