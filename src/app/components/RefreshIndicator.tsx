import { useMemo } from "react";

interface RefreshIndicatorProps {
  pullDistance: number;
  isPulling: boolean;
  isRefreshing: boolean;
  threshold: number;
}

export function RefreshIndicator({ 
  pullDistance, 
  isPulling, 
  isRefreshing,
  threshold = 60 
}: RefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1);
  
  const arrowStyle: React.CSSProperties = useMemo(() => ({
    transform: `rotate(${progress * 180}deg)`,
    transition: isRefreshing ? "none" : "transform 0.2s ease",
    fontSize: "20px",
    color: isPulling ? "#FF4D00" : "#8C8C8C",
  }), [progress, isPulling, isRefreshing]);

  const containerStyle: React.CSSProperties = useMemo(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: `${pullDistance}px`,
    minHeight: "0px",
    overflow: "hidden",
    transition: isRefreshing ? "height 0.3s ease" : "none",
    gap: "8px",
  }), [pullDistance, isRefreshing]);

  return (
    <div style={containerStyle}>
      {isRefreshing ? (
        <div style={{
          width: "24px",
          height: "24px",
          border: "2px solid #E5E5E5",
          borderTopColor: "#FF4D00",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
      ) : (
        <span style={arrowStyle}>↓</span>
      )}
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "10px",
        color: isPulling ? "#FF4D00" : "#8C8C8C",
        fontWeight: isPulling ? 700 : 400,
      }}>
        {isRefreshing ? "刷新中..." : isPulling ? "释放刷新" : "下拉刷新"}
      </span>
    </div>
  );
}
