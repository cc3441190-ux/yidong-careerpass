interface IconProps { active: boolean }

function TwinIcon({ active }: IconProps) {
  const c = active ? "#FF4D00" : "#8C8C8C";
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
      <rect x="2" y="3" width="11" height="14" stroke={c} strokeWidth="1.5" fill={active ? "rgba(255,77,0,0.2)" : "none"} />
      <rect x="9" y="3" width="11" height="14" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
    </svg>
  );
}

function ChallengeIcon({ active }: IconProps) {
  const c = active ? "#FF4D00" : "#8C8C8C";
  const fg = active ? "#FAF9F6" : c;
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="14" height="16" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
      <path d="M6 6.5H11" stroke={fg} strokeWidth="1.3" strokeLinecap="square" opacity="0.5" />
      <path d="M6 11.5L8.5 14L14 9" stroke={fg} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function PassIcon({ active }: IconProps) {
  const c = active ? "#FF4D00" : "#8C8C8C";
  const fg = active ? "#FAF9F6" : c;
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
      <rect x="1" y="1" width="22" height="16" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
      <rect x="3" y="3.5" width="5.5" height="7" stroke={fg} strokeWidth="1.2" fill="none" opacity="0.8" />
      <path d="M11 4.5H21" stroke={fg} strokeWidth="1.2" strokeLinecap="square" opacity="0.8" />
      <path d="M11 7.5H19" stroke={fg} strokeWidth="1.2" strokeLinecap="square" opacity="0.55" />
      <path d="M11 10.5H17" stroke={fg} strokeWidth="1.2" strokeLinecap="square" opacity="0.35" />
      <rect x="1" y="14" width="22" height="3" fill={active ? "rgba(250,249,246,0.25)" : "rgba(26,26,26,0.1)"} />
    </svg>
  );
}

function MeIcon({ active }: IconProps) {
  const c = active ? "#FF4D00" : "#8C8C8C";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="6.5" y="2" width="7" height="7" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
      <path d="M3 18C3 15.2 6.1 13 10 13C13.9 13 17 15.2 17 18" stroke={c} strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

type NavItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<IconProps>;
  hasNotif?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: "twin",      label: "化身",   Icon: TwinIcon,      hasNotif: false },
  { id: "challenge", label: "挑战",   Icon: ChallengeIcon, hasNotif: true  },
  { id: "pass",      label: "通行证", Icon: PassIcon,      hasNotif: false },
  { id: "me",        label: "我的",   Icon: MeIcon,        hasNotif: false },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div
      style={{
        height: "83px",
        background: "#FAF9F6",
        borderTop: "2px solid #1A1A1A",
        display: "flex",
        alignItems: "flex-end",
        flexShrink: 0,
        position: "relative",
        paddingBottom: "20px",
      }}
    >
      {NAV_ITEMS.map(({ id, label, Icon, hasNotif }, idx) => {
        const isActive = activeTab === id;
        const isPass = id === "pass";

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1,
              height: "49px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              position: "relative",
              padding: 0,
              borderRight:
                idx < NAV_ITEMS.length - 1
                  ? "1px solid rgba(26,26,26,0.07)"
                  : "none",
              transition: "background-color 0.1s, transform 0.1s",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,77,0,0.12)";
              (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            {/* Active indicator — orange pill background */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  top: "6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "56px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "rgba(255,77,0,0.08)",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Active bottom bar — 32px wide 3px orange rounded bar */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  bottom: "2px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "32px",
                  height: "3px",
                  borderRadius: "2px",
                  background: "#FF4D00",
                }}
              />
            )}

            {/* Icon + notification badge */}
            <div style={{ position: "relative", display: "flex" }}>
              <Icon active={isActive} />
              {hasNotif && !isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: "-3px",
                    right: "-4px",
                    width: "8px",
                    height: "8px",
                    background: "#FF4D00",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontFamily: "'Space Grotesk', 'PingFang SC', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                color: isActive ? "#FF4D00" : "#8C8C8C",
                lineHeight: 1,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
