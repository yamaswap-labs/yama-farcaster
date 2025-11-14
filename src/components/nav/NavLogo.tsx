import Image from 'next/image';
import Link from 'next/link';

export const NavLogo = () => {
  return (
    <>
      <Image
        src={'../../icon.svg'}
        alt="logo"
        width={21}
        height={21}
        className="size-6 sm:size-7 md:size-8 mx-[4px]"
      />
      <span className="text-white font-bold">YAMASWAP</span>
    </>
  );
};
