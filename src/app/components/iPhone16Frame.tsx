import { ReactNode } from "react";

interface Iphone16FrameProps {
  children: ReactNode;
}

/**
 * iPhone 16 手机壳边框组件
 * 包含：灵动岛、状态栏、底部指示条
 * 尺寸：393px x 852px (iPhone 16 逻辑像素)
 */
export function Iphone16Frame({ children }: Iphone16FrameProps) {
  const FRAME_WIDTH = 393;
  const FRAME_HEIGHT = 852;
  const SCREEN_WIDTH = 393;
  const SCREEN_HEIGHT = 852 - 59; // 减去状态栏和底部指示条空间

  return (
    <div
      style={{
        width: `${FRAME_WIDTH}px`,
        height: `${FRAME_HEIGHT}px`,
        background: "#1A1A1A",
        borderRadius: "47px",
        padding: "8px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 2px #2C2C2E, inset 0 0 0 2px #000000",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* 手机外壳高光 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "40%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
          borderRadius: "47px 47px 0 0",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* 屏幕区域 */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1A1A1A",
          borderRadius: "40px",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 状态栏区域 */}
        <div
          style={{
            height: "59px",
            background: "#FAF9F6",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "0",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* 灵动岛 Dynamic Island */}
          <div
            style={{
              width: "126px",
              height: "37px",
              background: "#1A1A1A",
              borderRadius: "20px",
              position: "absolute",
              top: "11px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
            }}
          >
            {/* 摄像头 */}
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#2C2C2E",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                left: "28px",
                border: "1px solid #3C3C3E",
              }}
            />
            {/* 传感器 */}
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#2C2C2E",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: "28px",
                border: "1px solid #3C3C3E",
              }}
            />
          </div>

          {/* 状态栏信息 */}
          <div
            style={{
              width: "100%",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              marginTop: "15px",
            }}
          >
            {/* 时间 */}
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "14px",
                fontWeight: 600,
                color: "#1A1A1A",
              }}
            >
              9:41
            </span>

            {/* 右侧图标组 */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* 信号 */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: "14px" }}>
                {[4, 7, 10, 14].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: "3px",
                      height: `${h}px`,
                      background: "#1A1A1A",
                      borderRadius: "0.5px",
                    }}
                  />
                ))}
              </div>

              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  d="M8 9.5C6.9 9.5 5.9 9.9 5.2 10.6L8 13.4L10.8 10.6C10.1 9.9 9.1 9.5 8 9.5Z"
                  fill="#1A1A1A"
                />
                <path
                  d="M3.5 5.8C5.7 3.6 10.3 3.6 12.5 5.8L13.9 4.4C11.3 1.8 4.7 1.8 2.1 4.4L3.5 5.8Z"
                  fill="#1A1A1A"
                />
              </svg>

              {/* 电池 */}
              <div
                style={{
                  width: "25px",
                  height: "12px",
                  border: "1.5px solid #1A1A1A",
                  borderRadius: "2.5px",
                  padding: "1.5px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    height: "100%",
                    background: "#34C759",
                    borderRadius: "1px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "-3.5px",
                    top: "2.5px",
                    width: "2px",
                    height: "5px",
                    background: "#1A1A1A",
                    borderRadius: "0 1px 1px 0",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* App内容区域 */}
        <div
          style={{
            flex: 1,
            width: "100%",
            overflow: "auto",
            position: "relative",
            background: "transparent",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {children}
        </div>

        {/* 底部指示条 Home Indicator */}
        <div
          style={{
            height: "34px",
            background: "#FAF9F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "134px",
              height: "5px",
              background: "#1A1A1A",
              borderRadius: "3px",
              opacity: 0.3,
            }}
          />
        </div>
      </div>

      {/* 侧边按钮 */}
      {/* 静音键 */}
      <div
        style={{
          position: "absolute",
          left: "-3px",
          top: "128px",
          width: "3px",
          height: "32px",
          background: "#2C2C2E",
          borderRadius: "2px 0 0 2px",
        }}
      />
      {/* 音量+ */}
      <div
        style={{
          position: "absolute",
          left: "-3px",
          top: "186px",
          width: "3px",
          height: "62px",
          background: "#2C2C2E",
          borderRadius: "2px 0 0 2px",
        }}
      />
      {/* 音量- */}
      <div
        style={{
          position: "absolute",
          left: "-3px",
          top: "260px",
          width: "3px",
          height: "62px",
          background: "#2C2C2E",
          borderRadius: "2px 0 0 2px",
        }}
      />
      {/* 电源键 */}
      <div
        style={{
          position: "absolute",
          right: "-3px",
          top: "220px",
          width: "3px",
          height: "80px",
          background: "#2C2C2E",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}
