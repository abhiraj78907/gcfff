import React from "react";

type Props = React.PropsWithChildren<{ className?: string }>;

export default function MobileContainer({ className, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className={`mx-auto w-full max-w-[375px] px-4 sm:max-w-md ${className ?? ""}`}>{children}</div>
    </div>
  );
}


