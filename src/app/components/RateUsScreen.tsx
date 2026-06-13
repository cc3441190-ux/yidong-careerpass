import { useState } from "react";
import { showToast } from "./Toast";

interface RateUsScreenProps {
  onBack: () => void;
}

const RATE_OPTIONS = [
  { score: 1, label: "极差", color: "#EF4444" },
  { score: 2, label: "失望", color: "#F97316" },
  { score: 3, label: "一般", color: "#EAB308" },
  { score: 4, label: "满意", color: "#22C55E" },
  { score: 5, label: "超赞", color: "#16A34A" },
];

export function RateUsScreen({ onBack }: RateUsScreenProps) {
  const [score, setScore]       = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    showToast("感谢你的评价！", "success");
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
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px 0",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M1 7L7 1M1 7L7 13" stroke="#FAF9F6" strokeWidth="1.5"
              strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
            fontWeight: 700, color: "#FAF9F6", letterSpacing: "0.1em" }}>
            返回
          </span>
        </button>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", fontWeight: 700,
          color: "#FAF9F6", opacity: 0.45, letterSpacing: "0.15em",
          position: "absolute", left: "50%", transform: "translateX(-50%)",
        }}>
          RATE US
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none",
        padding: "32px 20px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* App icon placeholder */}
        <div style={{
          width: "72px", height: "72px",
          background: "#1A1A1A",
          border: "2px solid #1A1A1A",
          boxShadow: "3px 3px 0px #FF4D00",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px",
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "22px", fontWeight: 700, color: "#FF4D00",
          }}>CP</span>
        </div>

        <div style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
          fontSize: "18px", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px",
        }}>
          CareerPass
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#8C8C8C",
          letterSpacing: "0.1em", marginBottom: "32px",
        }}>
          v2.4.1 · 构建 202606101
        </div>

        {/* Score prompt */}
        <div style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
          fontSize: "14px", fontWeight: 700, color: "#1A1A1A", marginBottom: "20px",
          textAlign: "center", lineHeight: 1.6,
        }}>
          {submitted
            ? "感谢你的评价！"
            : "你如何评价 CareerPass？\n欢迎留下你的真实感受"}
        </div>

        {!submitted && (
          <>
            {/* Star row */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setScore(s)} style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M18 4L22.5 13.5H33L24.5 20L27.5 31L18 24.5L8.5 31L11.5 20L3 13.5H13.5Z"
                      fill={s <= score ? "#FF4D00" : "none"}
                      stroke="#FF4D00" strokeWidth="2" strokeLinejoin="miter" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Label */}
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
              color: score > 0 ? RATE_OPTIONS[score - 1].color : "#8C8C8C",
              fontWeight: 700, letterSpacing: "0.08em", marginBottom: "28px", height: "16px",
            }}>
              {score > 0 ? RATE_OPTIONS[score - 1].label : "点击评分"}
            </div>

            {/* Optional feedback */}
            <div style={{
              width: "100%",
              background: "#FFFFFF",
              border: "2px solid #1A1A1A",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
              padding: "12px",
              marginBottom: "20px",
            }}>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="（选填）告诉我们更多你的想法..."
                style={{
                  width: "100%", height: "72px", border: "none", outline: "none",
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "12px", color: "#1A1A1A", lineHeight: 1.6,
                  resize: "none", padding: 0, background: "transparent",
                }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={score === 0}
              style={{
                width: "100%", maxWidth: "240px", height: "44px",
                background: score > 0 ? "#FF4D00" : "#E5E5E5",
                border: "2px solid #1A1A1A",
                borderRadius: "8px",
                boxShadow: score > 0 ? "2px 2px 0px #1A1A1A" : "none",
                color: score > 0 ? "#FAF9F6" : "#8C8C8C",
                fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.1em", cursor: score > 0 ? "pointer" : "default",
                transition: "all 0.15s", marginBottom: "32px",
              }}
            >
              提交评价
            </button>
          </>
        )}

        {submitted && (
          <div style={{ textAlign: "center", padding: "0 20px", marginBottom: "32px" }}>
            <div style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "12px", color: "#8C8C8C", lineHeight: 1.8,
            }}>
              你的反馈将帮助我们把 CareerPass 做得更好。<br/>
              如需进一步沟通，欢迎通过"帮助与反馈"联系我们。
            </div>
          </div>
        )}

        {/* Store links */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px",
          color: "#1A1A1A", opacity: 0.2, letterSpacing: "0.1em",
          textAlign: "center", lineHeight: 1.8, marginBottom: "32px",
        }}>
          APP STORE / GOOGLE PLAY / 腾讯应用宝<br/>
          去应用商店给我们五星好评 →
        </div>
      </div>
    </div>
  );
}
