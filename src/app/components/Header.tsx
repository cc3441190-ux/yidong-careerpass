export function Header() {
  return (
    <div style={{ background: "#FAF9F6", flexShrink: 0 }}>
      {/* Orange classification strip */}
      <div style={{ height: "3px", background: "#FF4D00" }} />

      <div
        style={{
          padding: "10px 20px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #1A1A1A",
          height: "44px",
          boxSizing: "border-box",
        }}
      >
        {/* Wordmark block */}
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "15px",
              fontWeight: 700,
              color: "#1A1A1A",
              letterSpacing: "0.05em",
              lineHeight: 1,
              marginBottom: "3px",
            }}
          >
            CAREERPASS
          </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                fontWeight: 700,
                color: "#1A1A1A",
                opacity: 0.35,
                letterSpacing: "0.1em",
              }}
            >
              AI 人才能力平台
            </div>
        </div>

        {/* Right meta + notification */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                color: "#1A1A1A",
                opacity: 0.35,
                letterSpacing: "0.06em",
                lineHeight: 1.4,
              }}
            >
              2026.06.09
            </div>
          </div>

          {/* Rectangular notification badge */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                border: "2px solid #1A1A1A",
                borderRadius: "8px",
                background: "#FAF9F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.1s, transform 0.1s",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,77,0,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#FAF9F6";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#FAF9F6";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2C5.8 2 4 3.8 4 6V10L2 12V13H14V12L12 10V6C12 3.8 10.2 2 8 2Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinejoin="miter"
                />
                <path d="M6 14H10" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </div>
            <div
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-3px",
                  width: "9px",
                  height: "9px",
                  background: "#FF4D00",
                  border: "1.5px solid #FAF9F6",
                  borderRadius: "50%",
                }}
              />
          </div>
        </div>
      </div>
    </div>
  );
}
