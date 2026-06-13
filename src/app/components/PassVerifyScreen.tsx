import { useState } from "react";

interface PassVerifyScreenProps {
  onBack?: () => void;
}

const VERIFY_DATA = {
  name: "陈孟秋",
  title: "产品经理实习生",
  passId: "CP-2026-0047",
  issued: "2026.06.09",
  expires: "2027.06.09",
  status: "有效",
  issuer: "CareerPass AI 评估系统",
  scores: [
    { label: "产品设计", grade: "A+", score: 94 },
    { label: "用户研究", grade: "B+", score: 78 },
    { label: "原型设计", grade: "A−", score: 88 },
    { label: "视觉设计", grade: "B", score: 72 },
    { label: "数据分析", grade: "C+", score: 61 },
    { label: "项目管理", grade: "B+", score: 76 },
  ],
  history: [
    { title: "PM模拟面试", company: "字节跳动", grade: "A+", date: "2026.06" },
    { title: "产品策略设计", company: "阿里巴巴", grade: "A−", date: "2026.04" },
    { title: "UX用户研究", company: "Figma Inc.", grade: "B+", date: "2026.01" },
  ],
};

export function PassVerifyScreen({ onBack }: PassVerifyScreenProps) {
  const [showHistory, setShowHistory] = useState(false);

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
        {onBack && (
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
        )}
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
          通行证验证
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px" }}>
        {/* Verification badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "16px",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            background: "#4CAF50",
            borderRadius: "50%",
          }} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            fontWeight: 700,
            color: "#4CAF50",
            letterSpacing: "0.1em",
          }}>
            验证通过 · 官方签发
          </span>
        </div>

        {/* Pass card */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "14px",
          overflow: "hidden",
        }}>
          <div style={{ background: "#1A1A1A", padding: "14px 16px" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "8px",
              fontWeight: 700,
              color: "#FAF9F6",
              opacity: 0.4,
              letterSpacing: "0.2em",
              marginBottom: "10px",
            }}>
              CAREERPASS · VERIFICATION
            </div>
            <div style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#FAF9F6",
              marginBottom: "4px",
            }}>
              {VERIFY_DATA.name}
            </div>
            <div style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "11px",
              color: "#FAF9F6",
              opacity: 0.55,
            }}>
              {VERIFY_DATA.title}
            </div>
          </div>

          <div style={{ padding: "14px 16px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "12px",
            }}>
              <div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#8C8C8C",
                  letterSpacing: "0.06em",
                  marginBottom: "2px",
                }}>
                  通行证编号
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                }}>
                  {VERIFY_DATA.passId}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#8C8C8C",
                  letterSpacing: "0.06em",
                  marginBottom: "2px",
                }}>
                  状态
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#4CAF50",
                }}>
                  {VERIFY_DATA.status}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#8C8C8C",
                  letterSpacing: "0.06em",
                  marginBottom: "2px",
                }}>
                  签发日期
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                }}>
                  {VERIFY_DATA.issued}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#8C8C8C",
                  letterSpacing: "0.06em",
                  marginBottom: "2px",
                }}>
                  过期日期
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                }}>
                  {VERIFY_DATA.expires}
                </div>
              </div>
            </div>

            <div style={{
              background: "#FAF9F6",
              border: "1.5px solid #E5E5E5",
              padding: "10px 12px",
              borderRadius: "4px",
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                fontWeight: 700,
                color: "#8C8C8C",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}>
                签发机构
              </div>
              <div style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}>
                {VERIFY_DATA.issuer}
              </div>
            </div>
          </div>
        </div>

        {/* Scores */}
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
            能力评分明细
          </div>
          {VERIFY_DATA.scores.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "10px 14px",
                borderBottom: i < VERIFY_DATA.scores.length - 1 ? "1px solid #E5E5E5" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}>
                {s.label}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  height: "4px",
                  width: "60px",
                  background: "#E5E5E5",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${s.score}%`,
                    background: "#FF4D00",
                  }} />
                </div>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  minWidth: "36px",
                  textAlign: "right",
                }}>
                  {s.grade}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Challenge history toggle */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "20px",
          overflow: "hidden",
        }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              color: "#1A1A1A",
              opacity: 0.45,
              letterSpacing: "0.15em",
            }}>
              挑战历史记录
            </span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{
                transform: showHistory ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <path d="M1 3L5 7L9 3" stroke="#8C8C8C" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
          </button>
          {showHistory && (
            <div>
              {VERIFY_DATA.history.map((h, i) => (
                <div
                  key={h.title}
                  style={{
                    padding: "10px 14px",
                    borderTop: "1px solid #E5E5E5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginBottom: "2px",
                    }}>
                      {h.title}
                    </div>
                    <div style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "10px",
                      color: "#8C8C8C",
                    }}>
                      {h.company}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#FF4D00",
                    }}>
                      {h.grade}
                    </span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      color: "#8C8C8C",
                    }}>
                      {h.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer trust mark */}
        <div style={{
          textAlign: "center",
          padding: "0 0 20px",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            color: "#8C8C8C",
            letterSpacing: "0.08em",
            marginBottom: "4px",
          }}>
            此验证页由 CareerPass 官方生成
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            color: "#8C8C8C",
            letterSpacing: "0.08em",
          }}>
            verify.careerpass.cn / v2.4.1
          </div>
        </div>
      </div>
    </div>
  );
}
