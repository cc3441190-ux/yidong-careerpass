interface EmptyStateScreenProps {
  onBrowse: () => void;
}

export function EmptyStateScreen({ onBrowse }: EmptyStateScreenProps) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: "100%",
        overflowY: "auto",
        background: "#FAF9F6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
        scrollbarWidth: "none",
      }}
    >
      {/* Archive label */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          fontWeight: 700,
          color: "#1A1A1A",
          opacity: 0.45,
          letterSpacing: "0.15em",
          marginBottom: "32px",
        }}
      >
        CHALLENGE / 挑战
      </div>

      {/* Document icon */}
      <div
        style={{
          width: "72px",
          height: "88px",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          background: "#FFFFFF",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          position: "relative",
        }}
      >
        {/* Folded corner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "18px",
            height: "18px",
            background: "#FAF9F6",
            borderLeft: "2px solid #1A1A1A",
            borderBottom: "2px solid #1A1A1A",
          }}
        />
        {/* Lines */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "40px",
              height: "2px",
              background: "#1A1A1A",
              opacity: i === 0 ? 0.5 : 0.15,
            }}
          />
        ))}
      </div>

      {/* Main text */}
      <div
        style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        暂无进行中的挑战
      </div>
      <div
        style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
          fontSize: "13px",
          color: "#8C8C8C",
          textAlign: "center",
          lineHeight: 1.6,
          marginBottom: "32px",
          maxWidth: "220px",
        }}
      >
        接受一个真实企业发布的能力挑战，用实战证明你的水平
      </div>

      {/* CTA */}
      <button
        onClick={onBrowse}
        style={{
          height: "52px",
          padding: "0 28px",
          background: "#1A1A1A",
          border: "2px solid #1A1A1A",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A",
          color: "#FAF9F6",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "transform 0.1s, box-shadow 0.1s",
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0px 2px rgba(0,0,0,0.08), 1px 1px 0px #1A1A1A";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A";
        }}
      >
        浏览挑战广场
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M1 5H13M9 1L13 5L9 9" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      </button>

      {/* Bottom note */}
      <div
        style={{
          marginTop: "24px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          color: "#1A1A1A",
          opacity: 0.35,
          letterSpacing: "0.08em",
          textAlign: "center",
        }}
      >
        已有 2,847 名候选人完成挑战
      </div>
    </div>
  );
}
