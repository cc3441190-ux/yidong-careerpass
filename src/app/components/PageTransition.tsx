import { useEffect, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  direction: "forward" | "back";
  screenKey: string;
}

/**
 * 页面切换过渡组件
 * 提供平滑的页面切换动画
 */
export function PageTransition({ children, direction, screenKey }: PageTransitionProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsAnimating(true);
    setDisplayChildren(children);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300); // 动画持续时间

    return () => clearTimeout(timer);
  }, [screenKey]);

  const animationStyle: React.CSSProperties = {
    animation: direction === "forward" 
      ? "screenSlideIn 0.3s ease-out both" 
      : "screenFadeIn 0.3s ease-out both",
  };

  return (
    <div
      key={screenKey}
      style={{
        flex: 1,
        overflowY: "auto",
        scrollbarWidth: "none",
        ...animationStyle,
      }}
    >
      {displayChildren}
    </div>
  );
}
