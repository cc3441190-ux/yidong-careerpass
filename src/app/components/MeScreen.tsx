import { PixelAvatarMini } from "./PixelAvatar";
import type { UserCareerState } from "../store/userCareerStore";
import { CAREER_INFO, type CareerType } from "../config/avatarConfig";

const MENU_ICONS: Record<string, React.ReactNode> = {
  "投递记录": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M7 7H13M7 10H13M7 13H10" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="square" />
      <circle cx="14" cy="14" r="4" fill="#FF4D00" stroke="#FAF9F6" strokeWidth="1.5" />
      <path d="M12.5 14H15.5M14 12.5V15.5" stroke="#FAF9F6" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  ),
  "我的简历": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="14" height="16" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M7 6H13M7 9H13M7 12H10" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  ),
  "挑战记录": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="14" height="16" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M6 6.5H11" stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="square" opacity="0.5" />
      <path d="M6 10L8.5 12.5L13 7.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  ),
  "消息通知": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C7.2 2 5 4.2 5 7V11L3 13V14H17V13L15 11V7C15 4.2 12.8 2 10 2Z" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      <path d="M7.5 16.5C7.5 17.9 8.6 19 10 19C11.4 19 12.5 17.9 12.5 16.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  ),
  "隐私设置": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="8" width="12" height="9" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M7 8V5.5C7 3.6 8.3 2 10 2C11.7 2 13 3.6 13 5.5V8" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" />
      <circle cx="10" cy="12" r="1.5" fill="#1A1A1A" />
    </svg>
  ),
  "语言与地区": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M2 10H18M10 3C11.5 5 12.5 7.5 12.5 10C12.5 12.5 11.5 15 10 17M10 3C8.5 5 7.5 7.5 7.5 10C7.5 12.5 8.5 15 10 17" stroke="#1A1A1A" strokeWidth="1.2" />
    </svg>
  ),
  "帮助与反馈": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M7.5 7.5C7.5 5.5 8.7 4.5 10 4.5C11.3 4.5 12.5 5.5 12.5 7.5C12.5 9 11.5 10 10 10.5V12" stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="square" />
      <circle cx="10" cy="14.5" r="0.8" fill="#1A1A1A" />
    </svg>
  ),
  "给我们评分": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L12.2 7.2H17.6L13.3 10.6L15.1 16L10 12.5L4.9 16L6.7 10.6L2.4 7.2H7.8Z" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinejoin="miter" />
    </svg>
  ),
  "退出登录": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7 3H4C3.4 3 3 3.4 3 4V16C3 16.6 3.4 17 4 17H7" stroke="#FF4D00" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M13 14L17 10L13 6M17 10H7" stroke="#FF4D00" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  ),
};

interface MeScreenProps {
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
  userCareerState?: UserCareerState | null;
}

const MENU_ROUTE_MAP: Record<string, string> = {
  "投递记录": "application-record",
  "我的简历": "my-resume",
  "挑战记录": "challenge-record",
  "消息通知": "notifications",
  "隐私设置": "privacy-settings",
  "语言与地区": "language-region",
  "帮助与反馈": "help-feedback",
  "给我们评分": "rate-us",
  "退出登录": "logout",
};

const MENU_ITEMS = [
  { iconKey: "投递记录",   label: "投递记录",   sub: "2 个面试邀约",     arrow: true, badge: "2" },
  { iconKey: "我的简历",   label: "我的简历",   sub: "更新于 2026.06.01", arrow: true },
  { iconKey: "挑战记录",   label: "挑战记录",   sub: "共 7 次挑战",     arrow: true },
  { iconKey: "消息通知",   label: "消息通知",   sub: "3 条未读",        arrow: true, badge: "3" },
  { iconKey: "隐私设置",   label: "隐私设置",   sub: "谁可以查看我的通行证", arrow: true },
  { iconKey: "语言与地区", label: "语言与地区", sub: "简体中文 · 中国大陆", arrow: true },
  { iconKey: "帮助与反馈", label: "帮助与反馈", sub: "常见问题 / 联系我们", arrow: true },
  { iconKey: "给我们评分", label: "给我们评分", sub: "在应用商店评分", arrow: true },
  { iconKey: "退出登录",   label: "退出登录",   sub: "", arrow: false, danger: true },
];

export function MeScreen({ onNavigate, onLogout, userCareerState }: MeScreenProps) {
  const career = userCareerState?.primaryCareer || "product";
  const careerLabel = (CAREER_INFO[career as CareerType]?.label) || career;
  const level = Math.max(1, (userCareerState?.totalChallenges || 0) * 2 + 1);
  const userName = userCareerState?.name || "未知用户";
  const userId = userCareerState?.userId || "default";
  const gender = userCareerState?.gender || "female";
  const visualTraits = userCareerState?.visualTraits;

  // CP 编码
  const cpCode = (() => {
    const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const num = 1000 + (hash % 9000);
    return `CP-2026-${num}`;
  })();

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#FAF9F6",
        scrollbarWidth: "none",
      }}
    >
      <div style={{ padding: "20px 20px 0" }}>
        {/* Archive label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.45,
            letterSpacing: "0.15em",
          }}
        >
          MY ACCOUNT / 我的
        </span>
          <div style={{ flex: 1, height: "1px", background: "#E5E5E5" }} />
        </div>

        {/* User card */}
        <div
          style={{
            background: "#1A1A1A",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #FF4D00",
            marginBottom: "16px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* Avatar */}
          <PixelAvatarMini
            userId={userId}
            career={career}
            level={level}
            skills={Object.entries(userCareerState?.currentSkills || {}).map(([name, score]) => ({ name, score }))}
            gender={gender}
            visualTraits={visualTraits}
            cachedImageUrl={userCareerState?.avatarUrl}
            size={52}
            style={{ border: "2px solid #FF4D00", borderRadius: "4px", flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#FAF9F6",
                marginBottom: "3px",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "11px",
                color: "#FAF9F6",
                opacity: 0.55,
                marginBottom: "6px",
              }}
            >
              {careerLabel}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                color: "#FF4D00",
                letterSpacing: "0.1em",
              }}
            >
              {cpCode}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 13L7 1L13 13M3.5 9H10.5" stroke="#FAF9F6" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="square" />
          </svg>
        </div>

        {/* Resume progress */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            padding: "14px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              简历完整度
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "18px",
                fontWeight: 700,
                color: "#FF4D00",
              }}
            >
              75%
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "#E5E5E5",
              border: "1.5px solid #1A1A1A",
              position: "relative",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: "75%",
                background: "#FF4D00",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "10px",
              color: "#8C8C8C",
            }}
          >
            补充"项目经历"可提升至 90% · 更多机会曝光
          </div>
        </div>

        {/* Function list */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          {MENU_ITEMS.map((item, i) => (
            <div
              key={item.label}
              onClick={() => {
                if (item.label === "退出登录") {
                  onLogout?.();
                } else {
                  const route = MENU_ROUTE_MAP[item.label];
                  if (route) {
                    onNavigate?.(route);
                  }
                }
              }}
              style={{
                padding: "13px 14px",
                borderBottom: i < MENU_ITEMS.length - 1 ? "1px solid #E5E5E5" : "none",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "background-color 0.1s",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,77,0,0.06)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <span style={{ flexShrink: 0 }}>{MENU_ICONS[item.iconKey]}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "13px",
                    fontWeight: item.danger ? 400 : 700,
                    color: item.danger ? "#FF4D00" : "#1A1A1A",
                  }}
                >
                  {item.label}
                </div>
                {item.sub && (
                  <div
                    style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "10px",
                      color: "#8C8C8C",
                      marginTop: "1px",
                    }}
                  >
                    {item.sub}
                  </div>
                )}
              </div>
              {item.badge && (
                <div
                  style={{
                    background: "#FF4D00",
                    padding: "2px 6px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#FAF9F6",
                  }}
                >
                  {item.badge}
                </div>
              )}
              {item.arrow && (
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                  <path d="M1 1L7 6L1 11" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Version */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "8px",
              color: "#1A1A1A",
              opacity: 0.2,
              letterSpacing: "0.1em",
              marginBottom: "3px",
            }}
          >
            CAREERPASS v2.4.1
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "7px",
              color: "#1A1A1A",
              opacity: 0.15,
              letterSpacing: "0.06em",
            }}
          >
            © 2026 CareerPass Technology Co., Ltd.
          </div>
        </div>
      </div>
    </div>
  );
}
