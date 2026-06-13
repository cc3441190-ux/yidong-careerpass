import { useState } from "react";

interface Criterion {
  label: string;
  score: number;
  max: number;
  pass: boolean;
  aiComment: string;
}

interface DimensionDetail {
  name: string;
  totalScore: number;
  criteria: Criterion[];
}

const DETAIL_DATA: DimensionDetail = {
  name: "产品思维",
  totalScore: 92,
  criteria: [
    {
      label: "问题拆解清晰度",
      score: 23,
      max: 25,
      pass: true,
      aiComment: "你能够从用户、竞品、商业三个维度拆解问题，结构完整。",
    },
    {
      label: "方案逻辑自洽性",
      score: 24,
      max: 25,
      pass: true,
      aiComment: "功能设计与目标用户匹配度高，推导过程无明显漏洞。",
    },
    {
      label: "优先级判断能力",
      score: 22,
      max: 25,
      pass: true,
      aiComment: "MVP 范围界定合理，但第二优先级功能论证稍弱。",
    },
    {
      label: "数据/假设支撑",
      score: 23,
      max: 25,
      pass: true,
      aiComment: "关键假设均有对应数据或逻辑支撑，量化意识良好。",
    },
  ],
};

interface ScoreDetailScreenProps {
  onBack: () => void;
  onAppeal: () => void;
}

export function ScoreDetailScreen({ onBack, onAppeal }: ScoreDetailScreenProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

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
          评分详情
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px" }}>
        {/* Dimension header card */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              fontWeight: 700,
              color: "#1A1A1A",
              opacity: 0.45,
              letterSpacing: "0.15em",
              marginBottom: "4px",
            }}>
              维度
            </div>
            <div style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              color: "#1A1A1A",
            }}>
              {DETAIL_DATA.name}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "32px",
              fontWeight: 700,
              color: "#4CAF50",
              lineHeight: 1,
            }}>
              {DETAIL_DATA.totalScore}
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              color: "#8C8C8C",
              letterSpacing: "0.06em",
            }}>
              满分 100
            </div>
          </div>
        </div>

        {/* Rubric explanation banner */}
        <div style={{
          background: "#1A1A1A",
          borderRadius: "6px",
          padding: "12px 14px",
          marginBottom: "14px",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            fontWeight: 700,
            color: "#FF4D00",
            letterSpacing: "0.1em",
            marginBottom: "6px",
          }}>
            评分标准说明
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "11px",
            color: "#FAF9F6",
            opacity: 0.8,
            lineHeight: 1.6,
          }}>
            该维度从 4 个细分标准评估，每个标准满分 25 分。AI 根据你的回答内容逐条匹配评分 rubric，生成分数与评语。
          </div>
        </div>

        {/* Criteria list */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "14px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "10px 14px",
            borderBottom: "2px solid #1A1A1A",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.45,
            letterSpacing: "0.15em",
          }}>
            细分标准拆解
          </div>
          {DETAIL_DATA.criteria.map((c, i) => (
            <div
              key={c.label}
              style={{
                borderBottom: i < DETAIL_DATA.criteria.length - 1 ? "1px solid #E5E5E5" : "none",
              }}
            >
              <button
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: c.pass ? "#4CAF50" : "#FF4D00",
                    width: "20px",
                  }}>
                    {c.pass ? "✓" : "△"}
                  </span>
                  <span style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                  }}>
                    {c.label}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: c.pass ? "#4CAF50" : "#FF4D00",
                  }}>
                    {c.score}/{c.max}
                  </span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    style={{
                      transform: expandedIdx === i ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <path d="M1 3L5 7L9 3" stroke="#8C8C8C" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </div>
              </button>
              {expandedIdx === i && (
                <div style={{ padding: "0 14px 12px 44px" }}>
                  <div style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "11px",
                    color: "#1A1A1A",
                    opacity: 0.7,
                    lineHeight: 1.6,
                    padding: "10px 12px",
                    background: "#FAF9F6",
                    borderLeft: `3px solid ${c.pass ? "#4CAF50" : "#FF4D00"}`,
                  }}>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#8C8C8C",
                      letterSpacing: "0.06em",
                      marginBottom: "4px",
                    }}>
                      AI 评语
                    </div>
                    {c.aiComment}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Appeal CTA */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "20px",
        }}>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: "6px",
          }}>
            对评分有异议？
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "11px",
            color: "#8C8C8C",
            lineHeight: 1.5,
            marginBottom: "12px",
          }}>
            如果你认为某个评分标准未准确反映你的回答，可以提交申诉，我们将在 24 小时内进行人工复核。
          </div>
          <button
            onClick={onAppeal}
            style={{
              width: "100%",
              padding: "10px 0",
              background: "#FAF9F6",
              border: "2px solid #1A1A1A",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06), 2px 2px 0px #1A1A1A",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              fontWeight: 700,
              color: "#1A1A1A",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            提交评分申诉
          </button>
        </div>
      </div>
    </div>
  );
}
