import { useEffect, useState } from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = "16px", style }: SkeletonProps) {
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShimmer(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width,
        height,
        background: shimmer 
          ? "linear-gradient(90deg, #E5E5E5 25%, #F5F5F5 50%, #E5E5E5 75%)"
          : "#E5E5E5",
        backgroundSize: shimmer ? "200% 100%" : "auto",
        animation: shimmer ? "shimmer 1.5s ease-in-out infinite" : "none",
        borderRadius: "4px",
        ...style,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "2px solid #1A1A1A",
        borderRadius: "6px",
        padding: "14px",
        marginBottom: "10px",
      }}
    >
      <Skeleton width="60%" height="20px" style={{ marginBottom: "10px" }} />
      <Skeleton width="100%" height="12px" style={{ marginBottom: "8px" }} />
      <Skeleton width="80%" height="12px" />
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <Skeleton width="60px" height="24px" />
        <Skeleton width="60px" height="24px" />
        <Skeleton width="60px" height="24px" />
      </div>
    </div>
  );
}
