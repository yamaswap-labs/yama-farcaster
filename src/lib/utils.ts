import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateString = (str: string = '', maxLen: number) => {
  return str?.length > maxLen ? `${str.substring(0, maxLen)}...` : str;
};

export function ellipsify(str = '', len = 4) {
  if (str.length > len * 2 + 2) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length);
  }

  return str;
}

export const round = (num: number, decimalPlaces: number) => {
  const factor = Math.pow(10, decimalPlaces);

  // 2.4567保留2位 => Math.round(245.67) ==> 246 => 246 / 100 => 2.46
  const result = Math.round(num * factor) / factor;

  return result;
};

export const formatBigNumber = (num: number | string = '0', options?: Intl.NumberFormatOptions) => {
  return formatNumber(Number(num) / 1e9, options);
};

export const formatNumber = (num: number | string = '0', options?: Intl.NumberFormatOptions) => {
  // Use the toLocaleString method to add suffixes to the number
  return Number(num).toLocaleString('en-US', {
    ...options,
    // add suffixes for thousands, millions, and billions
    // the maximum number of decimal places to use
    maximumFractionDigits: options?.maximumFractionDigits || 6,
    minimumFractionDigits: options?.minimumFractionDigits,
    // specify the abbreviations to use for the suffixes
    notation: options?.notation || 'compact',
    compactDisplay: options?.compactDisplay || 'short',
    currency: options?.currency || 'USD',
  });
};

export const formatDecimals = (num: number | string) => {
  const parts = num.toString().split('.');
  if (parts.length > 1) {
    const decimalPart = parts[1];
    const zeroCount = Array.from({ length: decimalPart.length })
      .fill(0)
      .reduce<number>((result, __, index) => {
        if (decimalPart[index] === '0' && result === index) {
          return result + 1;
        }
        return result;
      }, 0);
    const decimalPrefix =
      zeroCount > 1 ? `0${String.fromCharCode(zeroCount.toString().charCodeAt(0) + 8272)}` : '';
    const decimalSuffix = zeroCount ? decimalPart.slice(zeroCount) : decimalPart;

    return `${parts[0]}.${decimalPrefix}${decimalSuffix}`;
  }
  return num;
};

export function floorToTwoDecimalPlaces(num: string | number) {
  return Math.floor(Number(num || 0) * 100) / 100;
}
export function ceilToTwoDecimalPlaces(num: string | number) {
  return Math.ceil(Number(num || 0) * 100) / 100;
}
const S4 = function () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
export const guidGenerator = () => {
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};
