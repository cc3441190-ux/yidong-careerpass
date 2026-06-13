interface LanguageRegionScreenProps {
  onBack: () => void;
}

const LANGUAGES = [
  { code: "zh-CN", label: "简体中文", sub: "Simplified Chinese" },
  { code: "zh-TW", label: "繁體中文", sub: "Traditional Chinese" },
  { code: "en",    label: "English",   sub: "English" },
  { code: "ja",    label: "日本語",     sub: "Japanese" },
  { code: "ko",    label: "한국어",     sub: "Korean" },
];

const REGIONS = [
  { code: "CN", label: "中国大陆",  sub: "China Mainland" },
  { code: "HK", label: "中国香港",  sub: "Hong Kong SAR" },
  { code: "TW", label: "中国台湾",  sub: "Taiwan" },
  { code: "US", label: "美国",      sub: "United States" },
  { code: "JP", label: "日本",      sub: "Japan" },
  { code: "KR", label: "韩国",      sub: "South Korea" },
  { code: "SG", label: "新加坡",    sub: "Singapore" },
];

const TIMEZONES = [
  { code: "Asia/Shanghai",    label: "(UTC+8) 北京时间" },
  { code: "Asia/Hong_Kong",   label: "(UTC+8) 香港时间" },
  { code: "Asia/Taipei",      label: "(UTC+8) 台北时间" },
  { code: "Asia/Tokyo",       label: "(UTC+9) 东京时间" },
  { code: "Asia/Seoul",       label: "(UTC+9) 首尔时间" },
  { code: "America/New_York", label: "(UTC-5) 纽约时间" },
  { code: "America/Los_Angeles", label: "(UTC-8) 洛杉矶时间" },
];

export function LanguageRegionScreen({ onBack }: LanguageRegionScreenProps) {
  // In real app these would be state; kept as local vars for demo
  const selectedLang   = "zh-CN";
  const selectedRegion = "CN";
  const selectedTZ     = "Asia/Shanghai";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{
      background: "#FFFFFF",
      border: "2px solid #1A1A1A",
      borderRadius: "6px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
      marginBottom: "16px",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "10px 14px",
        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        color: "#1A1A1A",
        borderBottom: "1px solid #E5E5E5",
        opacity: 0.7,
        letterSpacing: "0.05em",
      }}>{title}</div>
      {children}
    </div>
  );

  const Row = ({ label, sub, active, onClick }: { label: string; sub?: string; active?: boolean; onClick?: () => void }) => (
    <div
      onClick={onClick}
      style={{
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: onClick ? "pointer" : "default",
        background: active ? "rgba(255,77,0,0.06)" : "transparent",
        borderBottom: "1px solid #F0F0F0",
        transition: "background-color 0.1s",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
          fontSize: "12px",
          color: active ? "#FF4D00" : "#1A1A1A",
          fontWeight: active ? 700 : 400,
        }}>{label}</div>
        {sub && (
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            color: "#8C8C8C",
            marginTop: "1px",
          }}>{sub}</div>
        )}
      </div>
      {active && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L6.5 11.5L13 5" stroke="#FF4D00" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      )}
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF9F6" }}>
      {/* Header */}
      <div style={{
        background: "#1A1A1A",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "relative",
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", alignItems: "center", gap: "6px",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M1 7L7 1M1 7L7 13" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", fontWeight: 700, color: "#FAF9F6", letterSpacing: "0.1em" }}>
            返回
          </span>
        </button>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          fontWeight: 700,
          color: "#FAF9F6",
          opacity: 0.45,
          letterSpacing: "0.15em",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          LANGUAGE
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "20px 20px 0" }}>
        <Section title="界面语言 / LANGUAGE">
          {LANGUAGES.map(l => (
            <Row key={l.code} label={l.label} sub={l.sub} active={selectedLang === l.code} />
          ))}
        </Section>

        <Section title="地区 / REGION">
          {REGIONS.map(r => (
            <Row key={r.code} label={r.label} sub={r.sub} active={selectedRegion === r.code} />
          ))}
        </Section>

        <Section title="时区 / TIMEZONE">
          {TIMEZONES.map(t => (
            <Row key={t.code} label={t.label} active={selectedTZ === t.code} />
          ))}
        </Section>

        <div style={{
          textAlign: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "8px",
          color: "#1A1A1A",
          opacity: 0.2,
          letterSpacing: "0.1em",
          marginBottom: "32px",
        }}>
          CAREERPASS LOCALE v2.4.1
        </div>
      </div>
    </div>
  );
}
