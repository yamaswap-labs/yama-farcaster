import { ApiCommonResponse } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

// login resopnse struct
export type DappLoginResData = {
    expires_at: number;
    address: string;
    token: string;
};

// login response type
export type DappLoginResp = ApiCommonResponse<DappLoginResData>;

// register response type
export type DappRegisterResp = ApiCommonResponse<void>;

// check register response type
export type DappCheckRegisterResp = ApiCommonResponse<{
    address: string;
    is_registered: boolean;
}>;

// check register or login response type
export type LoginOrRegisterResp = ApiCommonResponse<DappLoginResData & { is_new: boolean }>; // is new user

// register or login response struct
export type LoginOrRegisterReqBody = {
    walletAddress: string;
    inviterCode?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_POINT_API_URL;
const APIS = {
    LOGIN: `${BASE_URL}/dapp/login`,
    REGISTER: `${BASE_URL}/dapp/register`,
    CHECK_REGISTER: `${BASE_URL}/dapp/check_register`,
};

export type LoginOrRegisterResponse = NextResponse<LoginOrRegisterResp | { error: string }>;

export async function POST(req: NextRequest) {
    try {
        // parse req body
        const body = (await req.json()) as LoginOrRegisterReqBody;
        console.log('login or register request body:\n', body);
        const { walletAddress, inviterCode } = body;

        // response ressult
        let result = {};

        // walletAddress doesn't exist
        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Required fields are missing (walletAddress).' },
                { status: 400 },
            );
        }

        // check register
        const checkRegisterRes = await fetch(APIS.CHECK_REGISTER, {
            method: 'POST',
            body: JSON.stringify({ address: walletAddress }),
        }).then<DappCheckRegisterResp>((res) => res.json());
        console.log('checkRegisterRes: ', checkRegisterRes);

        // registered user
        if (checkRegisterRes.data?.is_registered) {
            // login
            const dappLoginRes = await fetch(APIS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ address: walletAddress }),
            }).then<DappLoginResp>((res) => res.json());
            // response result: mark old user
            result = { ...dappLoginRes, data: { ...dappLoginRes.data, is_new: false } };
        }
        // new user
        else {
            // be able to register with referral code
            const dappRegisterRes = await fetch(APIS.REGISTER, {
                method: 'POST',
                body: JSON.stringify({ address: walletAddress, invite_code: inviterCode }),
            }).then<DappRegisterResp>((res) => res.json());
            console.log('dappRegisterRes: ', dappRegisterRes);

            // response result: register success
            if (dappRegisterRes.code === 0) {
                const dappLoginRes = await fetch(APIS.LOGIN, {
                    method: 'POST',
                    body: JSON.stringify({ address: walletAddress }),
                }).then<DappLoginResp>((res) => res.json());
                console.log('dappLoginRes: ', dappLoginRes);
                // mark new user
                result = { ...dappLoginRes, data: { ...dappLoginRes.data, is_new: true } };
            }
        }

        // success resonse
        return NextResponse.json(result as LoginOrRegisterResp, { status: 200 });
    } catch (error) {
        return NextResponse.json<{ error: string }>(
            { error: `Internal server error, ${error}` },
            { status: 400 },
        );
    }
}
