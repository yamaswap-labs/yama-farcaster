import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import {
  FC,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { SvgElProps } from 'types';

export type ClipboardTriggerProps = {
  text?: string;
  copyIcon?: ReactNode;
  iconSize?: SvgElProps['fontSize'];
  iconColor?: SvgElProps['stroke'];
  // default is left text right copy, if you want to reverse, please pass true
  reverse?: boolean;
  // default is click icon to copy, if you want to click the whole area, please pass true
  asButton?: boolean;
  // default is only copy text, if you want to show toast, please pass true
  toasted?: boolean;
};

export const copyToClipboard = (text?: string, toasted?: boolean) => {
  navigator.clipboard.writeText(text || '');
  if (toasted) {
    toast.success('Copied!', {
      id: 'copy-to-clipboard',
      className: 'mx-auto mt-10',
    });
  }
};

/**
 *
 * @param text 需要复制的完整文本，可以不传，不传时直接获取被包裹 children 的 textContent
 * @returns
 */
export const ClipboardTrigger: FC<HTMLAttributes<HTMLDivElement> & ClipboardTriggerProps> = ({
  text,
  children,
  className,
  copyIcon,
  iconSize = 16,
  iconColor = '#ffffff99',
  reverse,
  asButton,
  toasted,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const childRef = useRef<HTMLDivElement>(null);

  const handleCopyToClipboard = useCallback<MouseEventHandler>(
    (e) => {
      e.stopPropagation();

      if (childRef.current) {
        // Copy the text inside the text field
        copyToClipboard(text || childRef.current.textContent || '', toasted);
        setIsCopied(true);
        // Clear the message after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      }
    },
    [text, toasted],
  );

  const handleCopyIconOnClick = useCallback<MouseEventHandler>(
    (e) => {
      if (!asButton) {
        handleCopyToClipboard(e);
      }
    },
    [asButton, handleCopyToClipboard],
  );

  const handleOnClick = useCallback<MouseEventHandler>(
    (e) => {
      if (asButton) {
        handleCopyToClipboard(e);
      }
    },
    [asButton, handleCopyToClipboard],
  );

  return (
    <div
      className={cn(
        'flex justify-center items-center gap-2',
        reverse ? 'flex-row-reverse' : '',
        asButton ? 'cursor-pointer' : '',
        className,
      )}
      onClick={handleOnClick}
      {...props}
    >
      <div ref={childRef}>{children}</div>
      {children || text ? (
        <button onClick={handleCopyIconOnClick} title="Copy">
          {isCopied ? (
            <Check stroke={iconColor} size={iconSize} />
          ) : (
            copyIcon || <Copy stroke={iconColor} size={iconSize} />
          )}
        </button>
      ) : null}
    </div>
  );
};
