import React, { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export default function ImageWithFallback({ src, alt, width, height, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const ratioPadding = `${(height / width) * 100}%`;

  return (
    <div className={`relative overflow-hidden rounded-lg bg-muted ${className ?? ""}`} style={{ width, height }}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
      )}
      {error ? (
        <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">Image unavailable</div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`h-full w-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}


