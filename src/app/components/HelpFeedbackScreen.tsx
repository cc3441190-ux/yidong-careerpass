import { useState } from "react";
import { showToast } from "./Toast";

interface HelpFeedbackScreenProps {
  onBack: () => void;
}

const FAQS = [
  {
    q: "什么是职业通行证（CareerPass）？",
    a: "CareerPass 是一份基于能力评估的职业数字身份凭证。通过标准化挑战验证你的真实能力，生成不可篡改的能力档案，帮助企业在招聘时快速、公正地识别人才。",
  },
  {
    q: "挑战成绩的有效期是多久？",
    a: "每次挑战成绩有效期为 6 个月。过期后你可以重新参加挑战以刷新成绩。企业看到的总是最新的能力评估结果。",
  },
  {
    q: "投递后多久能收到回复？",
    a: '认证企业通过 CareerPass 收到你的通行证后，通常会在 3-5 个工作日内给出反馈。你可以在"投递记录"中实时查看状态更新。',
  },
  {
    q: "我的数据会被泄露吗？",
    a: `我们采用端到端加密存储你的所有数据，并支持 GDPR 标准的隐私控制。你可以随时在"隐私设置"中管理数据的可见性和分享范围。`,
  },
  {
    q: "如何提升我的能力评级？",
    a: "参加更多领域的挑战来扩展你的能力图谱；在企业认证项目中积累实战经验；完善简历中的项目经历，系统会综合多维数据动态更新你的评级。",
  },
];

export function HelpFeedbackScreen({ onBack }: HelpFeedbackScreenProps) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedbackText.trim()) return;
    setSubmitted(true);
    showToast("感谢你的反馈！", "success");
    setTimeout(() => {
      setFeedbackText("");
      setFeedbackType("");
      setSubmitted(false);
    }, 2000);
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
          HELP
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "20px 20px 0" }}>
        {/* FAQ */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          fontWeight: 700,
          color: "#1A1A1A",
          opacity: 0.35,
          letterSpacing: "0.15em",
          marginBottom: "8px",
        }}>
          FAQ / 常见问题
        </div>

        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "20px",
          overflow: "hidden",
        }}>
          {FAQS.map((item, i) => {
            const open = expanded === i;
            return (
              <div key={i} style={{
                borderBottom: i < FAQS.length - 1 ? "1px solid #E5E5E5" : "none",
              }}>
                <div
                  onClick={() => setExpanded(open ? null : i)}
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    background: open ? "rgba(255,77,0,0.03)" : "transparent",
                    transition: "background-color 0.1s",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      lineHeight: 1.5,
                    }}>{item.q}</div>
                  </div>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                  >
                    <path d="M1 3.5L5 7.5L9 3.5" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </div>
                {open && (
                  <div style={{
                    padding: "0 14px 12px",
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "11px",
                    color: "#1A1A1A",
                    opacity: 0.65,
                    lineHeight: 1.7,
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          fontWeight: 700,
          color: "#1A1A1A",
          opacity: 0.35,
          letterSpacing: "0.15em",
          marginBottom: "8px",
        }}>
          FEEDBACK / 意见反馈
        </div>

        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "24px",
        }}>
          {/* Type selector */}
          <div style={{
            display: "flex",
            gap: "8px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}>
            {["功能建议", "Bug 反馈", "体验问题", "其他"].map(t => (
              <button
                key={t}
                onClick={() => setFeedbackType(t)}
                style={{
                  padding: "5px 12px",
                  background: feedbackType === t ? "#1A1A1A" : "transparent",
                  color: feedbackType === t ? "#FAF9F6" : "#1A1A1A",
                  border: "1.5px solid #1A1A1A",
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "11px",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.1s",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Text area */}
          <textarea
            value={feedbackText}
            onChange={e => setFeedbackText(e.target.value)}
            placeholder="请描述你的问题或建议（至少 10 个字）"
            style={{
              width: "100%",
              height: "100px",
              padding: "10px",
              border: "1.5px solid #E5E5E5",
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "12px",
              color: "#1A1A1A",
              lineHeight: 1.6,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "12px",
              borderRadius: "2px",
            }}
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!feedbackText.trim() || submitted}
            style={{
              width: "100%",
              height: "40px",
              background: submitted ? "#22C55E" : feedbackText.trim() ? "#FF4D00" : "#E5E5E5",
              border: "2px solid #1A1A1A",
              borderRadius: "6px",
              boxShadow: feedbackText.trim() ? "2px 2px 0px #1A1A1A" : "none",
              color: feedbackText.trim() ? "#FAF9F6" : "#8C8C8C",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: feedbackText.trim() ? "pointer" : "default",
              transition: "all 0.15s",
            }}
          >
            {submitted ? "✓ 已提交" : "提交反馈"}
          </button>
        </div>

        {/* Contact */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "32px",
        }}>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: "8px",
          }}>
            联系我们
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "11px",
            color: "#8C8C8C",
            lineHeight: 1.8,
          }}>
            商务合作：bd@careerpass.cn<br/>
            技术支持：support@careerpass.cn<br/>
            客服电话：400-888-0000（工作日 9:00-18:00）
          </div>
        </div>
      </div>
    </div>
  );
}
