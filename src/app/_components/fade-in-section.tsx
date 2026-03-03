"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps children in a fade-in + translateY animation triggered by
 * IntersectionObserver. Uses only transform + opacity for 60fps.
 */
export function FadeInSection({
  children,
  className,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 600ms ease-out, transform 600ms ease-out",
        willChange: "opacity, transform",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
