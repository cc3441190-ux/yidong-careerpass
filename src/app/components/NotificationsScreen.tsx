import { useState } from "react";

interface NotificationsScreenProps {
  onBack: () => void;
}

const NOTIFICATIONS = [
  {
    id: 1,
    type: "challenge",
    title: "挑战结果通知",
    content: "恭喜！你已通过「产品经理实习生 - 春招挑战」，能力指数提升 12 分",
    time: "10 分钟前",
    read: false,
  },
  {
    id: 2,
    type: "system",
    title: "企业查看通知",
    content: "你的职业能力通行证已被 3 家企业查看",
    time: "2 小时前",
    read: false,
  },
  {
    id: 3,
    type: "challenge",
    title: "挑战即将截止",
    content: "「UI设计师 - 暑期实习挑战」将于 24 小时后截止，请尽快完成",
    time: "5 小时前",
    read: true,
  },
  {
    id: 4,
    type: "job",
    title: "面试邀约",
    content: "字节跳动向你发出了产品经理实习生岗位的面试邀请，请点击查看详情",
    time: "1 天前",
    read: true,
  },
  {
    id: 5,
    type: "challenge",
    title: "新挑战上线",
    content: "腾讯发布了「UX研究员 - 秋招挑战」，与你的能力匹配度 85%",
    time: "2 天前",
    read: true,
  },
];

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markAsRead = (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    if (type === "challenge") {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="2" width="14" height="16" stroke="#1A1A1A" strokeWidth="1.5" />
          <path d="M6 6.5H11" stroke="#1A1A1A" strokeWidth="1.3" strokeLinecap="square" opacity="0.5" />
          <path d="M6 10L8.5 12.5L13 7.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      );
    }
    if (type === "job") {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="6" width="16" height="10" stroke="#1A1A1A" strokeWidth="1.5" />
          <path d="M7 6V4C7 2.3 8.3 1 10 1C11.7 1 13 2.3 13 4V6" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C7.2 2 5 4.2 5 7V11L3 13V14H17V13L15 11V7C15 4.2 12.8 2 10 2Z" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
        <path d="M7.5 16.5C7.5 17.9 8.6 19 10 19C11.4 19 12.5 17.9 12.5 16.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    );
  };

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
          消息通知
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 16px" }}>
        {notifs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8C8C8C", fontFamily: "'PingFang SC', sans-serif", fontSize: "13px" }}>
            暂无消息通知
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                style={{
                  background: notif.read ? "#FFFFFF" : "rgba(255,77,0,0.04)",
                  border: "2px solid #1A1A1A",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "background-color 0.1s",
                  position: "relative",
                }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,77,0,0.06)"; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = notif.read ? "#FFFFFF" : "rgba(255,77,0,0.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = notif.read ? "#FFFFFF" : "rgba(255,77,0,0.04)"; }}
              >
                {!notif.read && (
                  <div style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    width: "8px",
                    height: "8px",
                    background: "#FF4D00",
                    borderRadius: "50%",
                  }} />
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ flexShrink: 0, marginTop: "2px" }}>{getIcon(notif.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginBottom: "4px",
                    }}>
                      {notif.title}
                    </div>
                    <div style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "12px",
                      color: "#8C8C8C",
                      lineHeight: 1.5,
                      marginBottom: "6px",
                    }}>
                      {notif.content}
                    </div>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      color: "#8C8C8C",
                      opacity: 0.6,
                    }}>
                      {notif.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
