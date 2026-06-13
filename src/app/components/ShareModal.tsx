interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  shareUrl?: string;
  shareText?: string;
}

export function ShareModal({ visible, onClose, title = "分享", shareUrl = "https://careerpass.cn/pass/CP-2026-0047", shareText = "我的CareerPass能力通行证" }: ShareModalProps) {
  if (!visible) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("链接已复制到剪贴板！");
    }).catch(() => {
      // Fallback
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      alert("链接已复制到剪贴板！");
    });
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    let shareUrlStr = "";
    
    switch (platform) {
      case "wechat":
        alert("请截屏后通过微信分享");
        return;
      case "weibo":
        shareUrlStr = `https://service.weibo.com/share/share.php?title=${text}&url=${url}`;
        break;
      case "twitter":
        shareUrlStr = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "linkedin":
        shareUrlStr = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    if (shareUrlStr) {
      window.open(shareUrlStr, "_blank");
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: "#FAF9F6",
        border: "2px solid #1A1A1A",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15), 6px 6px 0px #1A1A1A",
        padding: "24px",
        width: "320px",
        maxWidth: "90%",
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            fontWeight: 700,
            color: "#1A1A1A",
            letterSpacing: "0.1em",
          }}>
            {title}
          </span>
          <button onClick={onClose} style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        {/* Share URL */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          padding: "10px 12px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{
            flex: 1,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            color: "#8C8C8C",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {shareUrl}
          </span>
          <button onClick={handleCopyLink} style={{
            background: "#1A1A1A",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            fontWeight: 700,
            color: "#FAF9F6",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}>
            复制
          </button>
        </div>

        {/* Platform buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "10px",
        }}>
          {[
            { id: "wechat", label: "微信", color: "#07C160" },
            { id: "weibo", label: "微博", color: "#FF4D00" },
            { id: "twitter", label: "Twitter", color: "#1DA1F2" },
            { id: "linkedin", label: "LinkedIn", color: "#0077B5" },
          ].map(platform => (
            <button
              key={platform.id}
              onClick={() => handleShare(platform.id)}
              style={{
                background: "#FFFFFF",
                border: "2px solid #1A1A1A",
                borderRadius: "8px",
                padding: "12px 8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                transition: "background-color 0.1s, transform 0.1s",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: platform.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700 }}>
                  {platform.label[0]}
                </span>
              </div>
              <span style={{
                fontFamily: "'PingFang SC', sans-serif",
                fontSize: "9px",
                color: "#1A1A1A",
              }}>
                {platform.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
