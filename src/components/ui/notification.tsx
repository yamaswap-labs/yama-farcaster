import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from './button';

export type NotificationProps = React.HTMLAttributes<HTMLDivElement> & {
    title: ReactNode;
    content?: ReactNode;
    confirmButtonProps?: ButtonProps;
    confirmText?: ReactNode;
    footer?: ReactNode;
    onConfirm?: () => void;
    onClose: () => void;
};

export const Notification: FC<NotificationProps> = ({
    children,
    title,
    content,
    confirmText,
    confirmButtonProps,
    footer,
    onConfirm,
    onClose,
    className,
    style,
}) => {
    return (
        <div
            className={cn(
                'mx-4 mb-4 w-[394px] rounded-18px border border-[#C1C0FF] px-6 py-4 backdrop-blur-[32px]',
                className,
            )}
            style={{ backdropFilter: 'blur(32px)', boxShadow: '0px 0px 24px 0px #E9ABFC66', ...style }}
        >
            <div className="mb-2 flex items-center justify-between gap-4">
                {title && <div className="font-semibold">{title}</div>}
                <X className="size-5 cursor-pointer" onClick={onClose} />
            </div>
            {content && <div className="text-xs text-text">{content}</div>}
            {children}
            <div className="mt-3">
                {footer ?? (
                    <Button
                        variant={'link'}
                        onClick={onConfirm}
                        {...confirmButtonProps}
                        className={cn('p-0 text-sm underline', confirmButtonProps?.className)}
                    >
                        {confirmText || 'Confirm'}
                    </Button>
                )}
            </div>
        </div>
    );
};
