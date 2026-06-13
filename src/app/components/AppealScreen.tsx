import { useState } from "react";
import { showToast } from "./Toast";

interface AppealScreenProps {
  onBack: () => void;
}

export function AppealScreen({ onBack }: AppealScreenProps) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) {
      showToast("请填写申诉理由", "error");
      return;
    }
    setSubmitted(true);
    showToast("申诉已提交，24小时内复核", "success");
  };

  if (submitted) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF9F6", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{
          width: "64px",
          height: "64px",
          background: "#4CAF50",
          border: "2px solid #1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}>
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <path d="M2 10L10 18L26 2" stroke="#FAF9F6" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>
        <div style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "#1A1A1A",
          marginBottom: "8px",
          textAlign: "center",
        }}>
          申诉已提交
        </div>
        <div style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
          fontSize: "12px",
          color: "#8C8C8C",
          lineHeight: 1.6,
          textAlign: "center",
          marginBottom: "24px",
        }}>
          我们的评估团队将在 24 小时内对你的申诉进行人工复核，结果将通过消息通知你。
        </div>
        <button
          onClick={onBack}
          style={{
            padding: "10px 24px",
            background: "#1A1A1A",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            color: "#FAF9F6",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            cursor: "pointer",
          }}
        >
          返回评分详情
        </button>
      </div>
    );
  }

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
          评分申诉
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px" }}>
        {/* Info card */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "14px",
        }}>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: "6px",
          }}>
            申诉维度：产品思维
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            color: "#8C8C8C",
            letterSpacing: "0.06em",
            marginBottom: "10px",
          }}>
            当前得分 92 / 100
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "11px",
            color: "#1A1A1A",
            opacity: 0.6,
            lineHeight: 1.5,
          }}>
            请具体说明你认为评分未准确反映你回答的地方，例如"我在第三段明确提到了竞品差异化分析，但评分标准显示未检测到"。
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "14px",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.45,
            letterSpacing: "0.15em",
            marginBottom: "10px",
          }}>
            申诉理由
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="请详细描述你的申诉理由..."
            style={{
              width: "100%",
              height: "160px",
              padding: "12px",
              border: "2px solid #1A1A1A",
              borderRadius: "4px",
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              lineHeight: 1.6,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              background: "#FAF9F6",
            }}
          />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            color: "#8C8C8C",
            letterSpacing: "0.06em",
            marginTop: "6px",
            textAlign: "right",
          }}>
            {reason.length} / 500 字
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px 0",
            background: "#FF4D00",
            border: "2px solid #1A1A1A",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A",
            color: "#FAF9F6",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          提交申诉
        </button>
      </div>
    </div>
  );
}
