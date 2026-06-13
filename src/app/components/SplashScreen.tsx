import { useState } from "react";

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#1A1A1A",
      overflow: "hidden",
    }}>
      {/* Full-screen gradient background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(ellipse at 50% 0%, rgba(255,77,0,0.12) 0%, transparent 70%), radial-gradient(ellipse at 50% 100%, rgba(255,77,0,0.05) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Dot grid texture */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23FAF9F6' fill-opacity='0.08'/%3E%3C/svg%3E")`,
        backgroundSize: "20px 20px",
        pointerEvents: "none",
      }} />

      {/* Logo mark */}
      <div style={{
        width: "80px",
        height: "80px",
        border: "3px solid #FF4D00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px",
        animation: loaded ? "none" : "logoPulse 1.5s ease-in-out infinite",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "28px",
          fontWeight: 700,
          color: "#FF4D00",
          letterSpacing: "-0.05em",
        }}>
          CP
        </span>
      </div>

      {/* App name */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "24px",
        fontWeight: 700,
        color: "#FAF9F6",
        letterSpacing: "0.2em",
        marginBottom: "8px",
      }}>
        CareerPass
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
        fontSize: "12px",
        color: "#FAF9F6",
        opacity: 0.45,
        letterSpacing: "0.15em",
        marginBottom: "60px",
      }}>
        职业能力通行证
      </div>

      {/* Loading bar */}
      <div style={{
        width: "120px",
        height: "2px",
        background: "rgba(250,249,246,0.1)",
        marginBottom: "40px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: loaded ? "100%" : "30%",
          background: "#FF4D00",
          transition: "width 0.8s ease-out",
        }} />
      </div>

      {/* Enter button */}
      <button
        onClick={() => {
          setLoaded(true);
          setTimeout(onEnter, 300);
        }}
        style={{
          background: "none",
          border: "2px solid #FF4D00",
          borderRadius: "8px",
          padding: "12px 48px",
          cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px",
          fontWeight: 700,
          color: "#FF4D00",
          letterSpacing: "0.15em",
          transition: "background-color 0.2s, transform 0.1s",
        }}
        onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.96)"; }}
        onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        进入 →
      </button>

      {/* Version */}
      <div style={{
        position: "absolute",
        bottom: "50px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "10px",
        color: "#FAF9F6",
        opacity: 0.3,
        letterSpacing: "0.1em",
      }}>
        v2.4.1
      </div>

      <style>{`
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
