import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-[#ffffff0d]', className)} {...props} />;
}

function WithSkeleton({
  loading,
  children,
  ...restProps
}: { loading: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return loading ? <Skeleton {...restProps} /> : children;
}

export { Skeleton, WithSkeleton };
