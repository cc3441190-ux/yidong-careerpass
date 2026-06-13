import { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  fontSize?: string;
  color?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  lineHeight?: string;
  style?: React.CSSProperties;
}

export function AnimatedNumber({
  value,
  duration = 800,
  fontSize = "48px",
  color = "#1A1A1A",
  fontWeight = 700,
  fontFamily = "'IBM Plex Mono', monospace",
  lineHeight = "1",
  style,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    const startValue = displayValue;
    startValueRef.current = startValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = Math.round(
        startValueRef.current + (value - startValueRef.current) * eased
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        lineHeight,
        display: "inline-block",
        ...style,
      }}
    >
      {displayValue}
    </span>
  );
}
