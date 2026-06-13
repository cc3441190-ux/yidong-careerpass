import { useState, useEffect } from "react";
import { PixelAvatarMini } from "./PixelAvatar";
import type { UserCareerState } from "../store/userCareerStore";

const PHASES = [
  { num: 1, label: "自我介绍", done: true },
  { num: 2, label: "案例分析", active: true },
  { num: 3, label: "方案设计", done: false },
  { num: 4, label: "压力追问", done: false },
  { num: 5, label: "总结反思", done: false },
];

const ROLES = [
  { id: "dev", name: "后端负责人", abbr: "DEV", color: "#1A1A1A", message: "这个方案开发周期要 6 周，能不能砍到 2 周？" },
  { id: "design", name: "设计总监", abbr: "DES", color: "#FF4D00", message: "Z世代用户对视觉风格很敏感，你的方案有考虑品牌调性吗？" },
];

const MATERIALS = [
  { id: "m1", label: "DAU 趋势图", type: "图表", desc: "近 6 个月 DAU 从 450w 降至 380w" },
  { id: "m2", label: "用户反馈截图", type: "文本", desc: "200 条核心用户评论，痛点集中在'创作门槛高'" },
  { id: "m3", label: "竞品功能对比", type: "表格", desc: "抖音/快手/视频号核心功能矩阵" },
];

interface ChallengeActiveScreenProps {
  onSubmit: (answer: string) => void;
  onBack: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ChallengeActiveScreen({ onSubmit, onBack, userCareerState }: ChallengeActiveScreenProps) {
  const career = userCareerState?.primaryCareer || "product";
  const level = Math.max(1, (userCareerState?.totalChallenges || 0) * 2 + 1);
  const userId = userCareerState?.userId || "chen-mengqiu";
  const gender = userCareerState?.gender || "female";
  const [timeLeft, setTimeLeft] = useState(872);
  const [inputVal, setInputVal] = useState("");
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [showMaterials, setShowMaterials] = useState(false);
  const [usedMaterials, setUsedMaterials] = useState<string[]>([]);
  const [avatarState, setAvatarState] = useState<"idle" | "thinking" | "stuck" | "attacking">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ── 化身状态机 ──
  useEffect(() => {
    if (isSubmitting) {
      setAvatarState("attacking");
      return;
    }
    if (timeLeft < 300 && inputVal.length === 0) {
      setAvatarState("stuck");
    } else if (inputVal.length > 0) {
      setAvatarState("thinking");
    } else {
      setAvatarState("idle");
    }
  }, [inputVal, timeLeft, isSubmitting]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setAvatarState("attacking");
    setTimeout(() => onSubmit(inputVal), 400);
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        background: "#FAF9F6",
      }}
    >
      {/* Top bar — 56px */}
      <div
        style={{
          height: "56px",
          background: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            transition: "opacity 0.1s",
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M15 6H1M5 1L1 6L5 11" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              fontWeight: 700,
              color: "#FAF9F6",
              letterSpacing: "0.02em",
            }}
          >
            字节跳动 PM 模拟面试
          </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                color: "#FAF9F6",
                opacity: 0.5,
                letterSpacing: "0.06em",
              }}
            >
              环节 2/5 · 案例分析
            </div>
        </div>
        {/* Save & Exit */}
        <button
          onClick={() => {
            if (confirm("保存当前进度并退出？你可以随时回来继续。")) {
              onBack();
            }
          }}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "4px 10px",
            cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            color: "#FAF9F6",
            opacity: 0.7,
            letterSpacing: "0.06em",
          }}
        >
          保存并退出
        </button>
        {/* Timer */}
        <div
          style={{
            background: timeLeft < 300 ? "#FF4D00" : "rgba(255,255,255,0.1)",
            border: "1.5px solid rgba(255,255,255,0.2)",
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" stroke="#FAF9F6" strokeWidth="1" />
            <path d="M5 2.5V5L6.5 6.5" stroke="#FAF9F6" strokeWidth="1" strokeLinecap="square" />
          </svg>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "13px",
              fontWeight: 700,
              color: "#FAF9F6",
              letterSpacing: "0.05em",
            }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Main scrollable content */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Timeline column — 32px */}
        <div
          style={{
            width: "32px",
            background: "#FAF9F6",
            borderRight: "2px solid #1A1A1A",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 0",
            gap: "0",
          }}
        >
          {PHASES.map((p, i) => (
            <div key={p.num} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  border: `2px solid ${p.active ? "#FF4D00" : p.done ? "#1A1A1A" : "#E5E5E5"}`,
                  background: p.active ? "#FF4D00" : p.done ? "#1A1A1A" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {p.done && !p.active && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                )}
                {p.active && (
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#FAF9F6",
                    }}
                  >
                    {p.num}
                  </span>
                )}
                {!p.done && !p.active && (
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "8px",
                      color: "#8C8C8C",
                    }}
                  >
                    {p.num}
                  </span>
                )}
              </div>
              {i < PHASES.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    height: "44px",
                    background: p.done ? "#1A1A1A" : "#E5E5E5",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            padding: "16px",
          }}
        >
          {/* Scenario card */}
          <div
            style={{
              background: "#1A1A1A",
              border: "2px solid #1A1A1A",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A, 3px 3px 0px #FF4D00",
              marginBottom: "14px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#FF4D00",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  fontWeight: 700,
                  color: "#FAF9F6",
                  letterSpacing: "0.15em",
                }}
              >
                案例背景
              </span>
            </div>
            <div style={{ padding: "14px 12px" }}>
              <div
                style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "13px",
                  color: "#FAF9F6",
                  lineHeight: 1.7,
                  opacity: 0.88,
                }}
              >
                字节跳动正在开发一款面向Z世代的短视频创作工具，目前处于0到1阶段。作为产品经理，你需要在30分钟内分析竞品生态，找出差异化切入点，并提出核心功能方案。
              </div>
            </div>
          </div>

          {/* Role cards */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              fontWeight: 700,
              color: "#1A1A1A",
              opacity: 0.45,
              letterSpacing: "0.15em",
              marginBottom: "8px",
            }}>
              协作角色 · 点击接收质疑
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(activeRole === role.id ? null : role.id)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: activeRole === role.id ? role.color : "#FFFFFF",
                    border: "2px solid #1A1A1A",
                    borderRadius: "6px",
                    boxShadow: activeRole === role.id ? "none" : "0 1px 2px rgba(0,0,0,0.06), 2px 2px 0px #1A1A1A",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: activeRole === role.id ? "#FAF9F6" : "#1A1A1A",
                    opacity: activeRole === role.id ? 0.7 : 0.45,
                    letterSpacing: "0.06em",
                    marginBottom: "4px",
                  }}>
                    {role.abbr}
                  </div>
                  <div style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: activeRole === role.id ? "#FAF9F6" : "#1A1A1A",
                  }}>
                    {role.name}
                  </div>
                </button>
              ))}
            </div>
            {activeRole && (
              <div style={{
                marginTop: "8px",
                background: "#FFFFFF",
                border: "2px solid #1A1A1A",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
                padding: "12px",
              }}>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  color: "#1A1A1A",
                  lineHeight: 1.6,
                  marginBottom: "8px",
                }}>
                  “{ROLES.find((r) => r.id === activeRole)?.message}”
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#8C8C8C",
                  letterSpacing: "0.06em",
                }}>
                  请在回答中回应此质疑
                </div>
              </div>
            )}
          </div>

          {/* Materials drawer */}
          <div style={{ marginBottom: "14px" }}>
            <button
              onClick={() => setShowMaterials(!showMaterials)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: showMaterials ? "#1A1A1A" : "#FFFFFF",
                border: "2px solid #1A1A1A",
                borderRadius: "6px",
                boxShadow: showMaterials ? "none" : "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="12" stroke={showMaterials ? "#FAF9F6" : "#1A1A1A"} strokeWidth="1.5" />
                  <path d="M4 5H10M4 7.5H8M4 10H6" stroke={showMaterials ? "#FAF9F6" : "#1A1A1A"} strokeWidth="1.2" strokeLinecap="square" />
                </svg>
                <span style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: showMaterials ? "#FAF9F6" : "#1A1A1A",
                }}>
                  资料包
                </span>
                {usedMaterials.length > 0 && (
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#FF4D00",
                    letterSpacing: "0.06em",
                  }}>
                    已引用 {usedMaterials.length}
                  </span>
                )}
              </div>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                style={{
                  transform: showMaterials ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <path d="M1 3L5 7L9 3" stroke={showMaterials ? "#FAF9F6" : "#8C8C8C"} strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </button>
            {showMaterials && (
              <div style={{
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                {MATERIALS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setUsedMaterials((prev) =>
                        prev.includes(m.id) ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                      );
                    }}
                    style={{
                      padding: "10px 12px",
                      background: usedMaterials.includes(m.id) ? "#1A1A1A" : "#FFFFFF",
                      border: "2px solid #1A1A1A",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "left",
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
                        color: usedMaterials.includes(m.id) ? "#FAF9F6" : "#1A1A1A",
                        marginBottom: "2px",
                      }}>
                        {m.label}
                        <span style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "7px",
                          color: usedMaterials.includes(m.id) ? "#FF4D00" : "#8C8C8C",
                          marginLeft: "6px",
                          letterSpacing: "0.06em",
                        }}>
                          {m.type}
                        </span>
                      </div>
                      <div style={{
                        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                        fontSize: "10px",
                        color: usedMaterials.includes(m.id) ? "#FAF9F6" : "#8C8C8C",
                        opacity: usedMaterials.includes(m.id) ? 0.7 : 1,
                      }}>
                        {m.desc}
                      </div>
                    </div>
                    {usedMaterials.includes(m.id) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#FF4D00" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI interviewer dialogue */}
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #1A1A1A",
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08), 4px 4px 0px #1A1A1A",
              marginBottom: "14px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Subtle embossed effect */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: "4px",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            
            {/* AI header */}
            <div
              style={{
                background: "linear-gradient(135deg, #FAF9F6 0%, #F5F4F0 100%)",
                borderBottom: "1.5px solid #1A1A1A",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  background: "#1A1A1A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "7px",
                    fontWeight: 700,
                    color: "#FF4D00",
                  }}
                >
                  PM
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                  }}
                >
                  王雅 · AI面试官
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "9px",
                    color: "#FF4D00",
                    letterSpacing: "0.06em",
                  }}
                >
                  正在发言...
                </div>
              </div>
            </div>
            {/* Dialogue content */}
            <div
              style={{
                padding: "14px 12px",
                borderLeft: "4px solid #FF4D00",
              }}
            >
              <div
                style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "13px",
                  color: "#1A1A1A",
                  lineHeight: 1.7,
                }}
              >
                好，陈孟秋，我来问你第一个问题：
                <br /><br />
                如果你是这款产品的 PM，面对抖音、快手、视频号三大竞品，你会从哪个维度切入，找到我们的差异化机会？请给我一个清晰的竞品分析框架，然后说明你的结论。
              </div>
            </div>
          </div>

          {/* Previous response hint */}
          <div
            style={{
              background: "#FAF9F6",
              border: "1.5px solid #E5E5E5",
              padding: "10px 12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                color: "#8C8C8C",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}
            >
              上一环节 · 自我介绍
            </div>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "11px",
                color: "#1A1A1A",
                opacity: 0.6,
                lineHeight: 1.5,
              }}
            >
              "我是陈孟秋，应届产品经理，主要背景是互联网产品设计方向，曾在阿里巴巴实习..."
            </div>
          </div>

        </div>
      </div>

      {/* ── 化身状态窗（行为栏上方，右对齐，纯素材无边框）── */}
      <div style={{
        padding: "6px 16px 2px", display: "flex", justifyContent: "flex-end",
        flexShrink: 0,
      }}>
        <div className={`avatar-state-${avatarState}`} style={{
          width: "56px", height: "56px",
          transition: "transform 0.3s, filter 0.3s",
          filter: avatarState === "stuck" ? "drop-shadow(0 0 8px rgba(255,77,0,0.6))" : "none",
        }}>
          <PixelAvatarMini
            userId={userId} career={career} level={level} gender={gender}
            cachedImageUrl={userCareerState?.avatarUrl}
            size={56} style={{ width: "56px", height: "56px" }}
          />
        </div>
      </div>

      {/* Fixed bottom input + submit */}
      <div
        style={{
          borderTop: "2px solid #1A1A1A",
          background: "#FAF9F6",
          padding: "12px 16px 16px",
          flexShrink: 0,
        }}
      >
        {/* Notes toggle */}
        <details style={{ marginBottom: "8px" }}>
          <summary
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              color: "#8C8C8C",
              letterSpacing: "0.06em",
              cursor: "pointer",
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 3L5 7L9 3" stroke="#8C8C8C" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
            挑战草稿箱 / 记录思路
          </summary>
          <textarea
            placeholder="在此记录你的思路、关键词、待补充点..."
            style={{
              width: "100%",
              height: "60px",
              marginTop: "6px",
              padding: "8px",
              border: "1.5px solid #E5E5E5",
              borderRadius: "4px",
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "11px",
              color: "#1A1A1A",
              lineHeight: 1.5,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </details>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              flex: 1,
              border: "2px solid #1A1A1A",
              borderRadius: "6px",
              background: "#FFFFFF",
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="输入你的回答..."
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "13px",
                color: "#1A1A1A",
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            style={{
              height: "44px",
              padding: "0 16px",
              background: "#FF4D00",
              border: "2px solid #1A1A1A",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A",
              color: "#FAF9F6",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0px 2px rgba(0,0,0,0.08), 1px 1px 0px #1A1A1A";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A";
            }}
          >
            提交本环节
          </button>
        </div>
      </div>
      {/* ── 化身动画 CSS ── */}
      <style>{`
        /* 空闲：站立呼吸 */
        .avatar-state-idle {
          animation: avatar-breathe 2s ease-in-out infinite;
        }
        @keyframes avatar-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        /* 思考中：轻微摇晃 */
        .avatar-state-thinking {
          animation: avatar-thinking 1.2s ease-in-out infinite;
        }
        @keyframes avatar-thinking {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.03) rotate(-1deg); }
          75% { transform: scale(1.03) rotate(1deg); }
        }

        /* 卡壳：颤抖 */
        .avatar-state-stuck {
          animation: avatar-stuck 0.4s ease-in-out infinite;
        }
        @keyframes avatar-stuck {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px) scale(1.03); }
          75% { transform: translateX(2px) scale(1.03); }
        }

        /* 提交：出击动作 */
        .avatar-state-attacking {
          animation: avatar-attack 0.4s ease-out forwards;
        }
        @keyframes avatar-attack {
          0% { transform: scale(1) translateY(0); }
          30% { transform: scale(1.2) translateY(-8px); }
          100% { transform: scale(1.05) translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
