import LuckyDrawColorfulSvg from '@/assets/lucky-draw-colorful.svg';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useUserInfo from '@/hooks/useUserInfo';
import { ApiCommonResponse } from '@/lib/api';
import { APP_ROUTES_MAP } from '@/lib/routes';
import useLoginStore from '@/store/useLoginStore';
import useLuckyDrawDialogStore from '@/store/useLuckyDrawDialogStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Notification } from '../ui/notification';
import { WithSkeleton } from '../ui/skeleton';

const LOTTERY_CONSUMPTION = 100;
const BASE_TURN = 6;
const REWARDS = [1, 5, 0.1, 10, 3, 7, 0.4, 0];
const REWARD_DEG_MAP: Record<number, number> = Array.from(
  { length: REWARDS.length },
  (_, i) => i * (360 / REWARDS.length),
).reduce((res, curr, index) => ({ ...res, [REWARDS[index]]: curr }), {});

export type UserLotteryResponse = ApiCommonResponse<{
  amount: number;
  id: number;
  name: string;
}>;

export interface LotteryInfo {
  amount: number;
  id: number;
  name: string;
}

const LuckyDrawDialog = () => {
  const isLogin = useLoginStore((state) => state.isLogin);
  const { isOpen, show, hide } = useLuckyDrawDialogStore();
  const [rotatedDeg, setRotatedDeg] = useState(0);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const router = useRouter();
  const token = useLoginStore((state) => state.token);
  const [lotteryResult, setLotteryResult] = useState<LotteryInfo>();
  const { userInfo, refetchUserInfo, isUserInfoLoading } = useUserInfo();

  const pointsExhausted = useMemo(
    () => userInfo && userInfo.points < LOTTERY_CONSUMPTION,
    [userInfo],
  );

  const toastLoginFirst = useCallback(() => {
    toast.custom(
      <Notification
        title={'Please connect your wallet'}
        content={'You need to be logged in to use this feature.'}
        confirmText={'OK'}
        onConfirm={() => toast.remove('login-first')}
        onClose={() => toast.remove('login-first')}
      />,
      {
        id: 'login-first',
        position: 'bottom-right',
        duration: 5000,
      },
    );
  }, []);

  const toastPointsExhausted = useCallback(() => {
    toast.custom(
      <Notification
        title={'Your points are exhausted'}
        content={'You need at least 100 points to play'}
        confirmText={'OK'}
        onConfirm={() => toast.remove('points-exhausted')}
        onClose={() => toast.remove('points-exhausted')}
      />,
      {
        id: 'points-exhausted',
        position: 'bottom-right',
        duration: 5000,
      },
    );
  }, []);

  //   const { data: lotteryInfo } = useQuery({
  //     queryKey: ['get-lottery-info'],
  //     queryFn: () =>
  //       fetch('/point-api/dapp/get_lottery_info', { method: 'POST' }).then<
  //         ApiCommonResponse<LotteryInfo[]>
  //       >((res) => res.json()),
  //     select: (data) => data.data,
  //   });

  const handleOpenChange = useCallback(() => {
    refetchUserInfo();
    setRotateDeg(0);
    setRotatedDeg(0);
    setIsSpinning(false);
    isOpen ? hide() : show();
  }, [refetchUserInfo, isOpen, hide, show]);

  const handleLotteryOnClick = useCallback(async () => {
    if (!isLogin) {
      toastLoginFirst();
      return;
    }
    if (pointsExhausted) {
      toastPointsExhausted();
      return;
    }
    if (isSpinning) return;

    setIsSpinning(true);
    setRotatedDeg((prev: any) => prev + BASE_TURN * 360);
    await fetch('/point-api/dapp/user/lottery', {
      method: 'POST',
      headers: {
        'x-token': token,
      },
    })
      .then<ApiCommonResponse<LotteryInfo>>((res) => res.json())
      .then((res) => {
        refetchUserInfo();
        setLotteryResult(res.data);
        const rewards = (res.data?.amount || 0) / 1000;
        const currDeg = REWARD_DEG_MAP[rewards] || 0;
        setRotateDeg(currDeg);
      })
      .catch((e) => {
        console.log('[API Error]', e);
      });
  }, [
    isSpinning,
    isLogin,
    toastLoginFirst,
    toastPointsExhausted,
    pointsExhausted,
    token,
    refetchUserInfo,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button>
          <LuckyDrawColorfulSvg />
        </button>
      </DialogTrigger>

      <DialogContent className="w-[400px]" onPointerDownOutside={(e: any) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{'Lucky Draw Wheel'}</DialogTitle>
        </DialogHeader>

        <div className="w-[290px] h-[290px] mt-[18px] mx-auto relative">
          <Image
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            src={'/lucky-wheel-back.png'}
            alt="lucky-wheel-back"
            width={284}
            height={284}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[197px] h-[197px]">
            <Image
              className="w-full h-full"
              style={{
                transformOrigin: 'center center',
                transform: `rotate(${rotatedDeg}deg)`,
                transition: `transform ${isSpinning ? 2 : 0.2}s linear`,
              }}
              onTransitionEnd={() => {
                if (isSpinning) {
                  setIsSpinning(false);
                  const remainDeg = 360 - (rotatedDeg % 360 || 360);
                  setRotatedDeg((prev: any) => prev + remainDeg + rotateDeg);
                  setRotateDeg(0);
                } else if (!!lotteryResult?.name) {
                  toast.success(`You got ${lotteryResult?.name}!`, { className: 'mt-4' });
                }
              }}
              src={'/lucky-wheel-front.png'}
              alt="lucky-wheel-front"
              width={197}
              height={197}
            />
          </div>

          <div
            className={`absolute left-1/2 top-1/2 cursor-pointer -translate-x-1/2 -translate-y-[calc(50%+6px)] w-[79px/2] h-[88px/2]`}
          >
            <button onClick={isUserInfoLoading ? () => { } : handleLotteryOnClick}>
              <Image
                className="w-full h-full"
                src={'/lucky-wheel-go.png'}
                alt="lucky-wheel-go"
                width={46}
                height={46}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center text-xs text-text pb-3 pt-[10px] gap-[10px]">
            <div className="flex space-x-1">
              <span>{`Remaining points:`}</span>
              <WithSkeleton loading={isUserInfoLoading} className="w-14 h-[22px]">
                <span>{userInfo?.points || '-'}</span>
              </WithSkeleton>
            </div>
            <div className="flex space-x-1">
              <span>{`Each consumption:`}</span>
              <span>{LOTTERY_CONSUMPTION}</span>
            </div>
          </div>

          {isLogin && (
            <button
              className="text-xs text-[#007AFF] pb-[18px]"
              onClick={(e) => {
                hide();

                const path = `${APP_ROUTES_MAP.POINTS}/lottery`;
                if (!window.location.pathname.includes(path)) {
                  router.push(path);
                }
              }}
            >
              {'Lottery Records >'}
            </button>
          )}

          <Button
            size={'sm'}
            variant={'outline'}
            className={`w-full transition-all duration-300 ease-linear ${pointsExhausted ? 'h-9 opacity-100' : 'h-0 opacity-0'
              }`}
            onClick={() => {
              hide();

              if (window.location.pathname !== APP_ROUTES_MAP.POINTS) {
                router.push(APP_ROUTES_MAP.POINTS);
              }
            }}
          >
            {`Today's draw has run out, click to get more points`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LuckyDrawDialog;
