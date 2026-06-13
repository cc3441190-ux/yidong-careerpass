import { useMemo, useState, useEffect } from "react";
import { AnimatedNumber } from "./AnimatedNumber";
import { ShareModal } from "./ShareModal";
import { showToast } from "./Toast";
import type { UserCareerState } from "../store/userCareerStore";

function StarburstSeal() {
  const pts = useMemo(() => {
    const n = 20;
    const outer = 40;
    const inner = 29;
    return Array.from({ length: n * 2 }, (_, i) => {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / n - Math.PI / 2;
      return `${44 + r * Math.cos(angle)},${44 + r * Math.sin(angle)}`;
    }).join(" ");
  }, []);

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
      <polygon points={pts} fill="#FF4D00" />
      <polygon points={pts} fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="44" cy="44" r="20" fill="none" stroke="#FAF9F6" strokeWidth="1.5" />
      <text x="44" y="40" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="5" fontWeight="700" fill="#FAF9F6" letterSpacing="0.5">AI认证</text>
      <text x="44" y="50" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fontWeight="700" fill="#FAF9F6">2026</text>
    </svg>
  );
}

function QRCode() {
  const size = 17;
  const mod = 3;
  const matrix = useMemo(() => {
    const m: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    // Finder patterns — top-left, top-right, bottom-left
    const drawFinder = (r: number, c: number) => {
      for (let dr = 0; dr < 7; dr++) {
        for (let dc = 0; dc < 7; dc++) {
          const onOuter = dr === 0 || dr === 6 || dc === 0 || dc === 6;
          const onInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
          if (onOuter || onInner) m[r + dr][c + dc] = true;
        }
      }
    };
    drawFinder(0, 0);
    drawFinder(0, 10);
    drawFinder(10, 0);
    // Data fill
    let seed = 42;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!m[r][c]) {
          seed = (seed * 1664525 + 1013904223) & 0xffffffff;
          m[r][c] = (seed >>> 16) % 3 !== 0;
        }
      }
    }
    return m;
  }, []);

  return (
    <svg
      width={size * mod}
      height={size * mod}
      viewBox={`0 0 ${size * mod} ${size * mod}`}
      style={{ display: "block" }}
    >
      {matrix.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect key={`${r}-${c}`} x={c * mod} y={r * mod} width={mod} height={mod} fill="#1A1A1A" />
          ) : null
        )
      )}
    </svg>
  );
}

const DEFAULT_SCORES = [
  { label: "产品设计", grade: "A+", score: 94, top: true },
  { label: "用户研究", grade: "B+", score: 78, top: false },
  { label: "原型设计", grade: "A−", score: 88, top: false },
  { label: "视觉设计", grade: "B",  score: 72, top: false },
  { label: "数据分析", grade: "C+", score: 61, top: false },
  { label: "项目管理", grade: "B+", score: 76, top: false },
];

const DEFAULT_HISTORY = [
  { company: "字节跳动", title: "PM模拟面试", grade: "A+", date: "2026.06", top: true },
  { company: "阿里巴巴", title: "产品策略设计", grade: "A−", date: "2026.04", top: false },
  { company: "Figma Inc.", title: "UX用户研究", grade: "B+", date: "2026.01", top: false },
  { company: "腾讯", title: "视觉设计挑战", grade: "B",  date: "2025.11", top: false },
];

interface PassScreenProps {
  onCapabilityDetail: () => void;
  onFindOpportunity: () => void;
  onViewCompanyJobs?: (company: string) => void;
  onVerifyPass?: () => void;
  userCareerState?: UserCareerState | null;
}

export function PassScreen({ onCapabilityDetail, onFindOpportunity, onViewCompanyJobs, onVerifyPass, userCareerState }: PassScreenProps) {
  const [showShare, setShowShare] = useState(false);

  const us = userCareerState;
  const userName = us?.name || "陈孟秋";
  const userId = us?.userId || "chen-mengqiu";
  const cpCode = (() => { const h = userId.split("").reduce((a,c) => a+c.charCodeAt(0), 0); return `CP-2026-${String(1000+(h%9000))}`; })();

  const SCORES = useMemo(() => {
    const skills = us?.currentSkills || {};
    const entries = Object.entries(skills);
    if (entries.length === 0) return DEFAULT_SCORES;
    const maxScore = Math.max(...entries.map(([,s]) => s));
    return entries.map(([name, score]) => ({
      label: name, score,
      grade: score>=95?"S":score>=85?"A+":score>=78?"A":score>=70?"B+":score>=60?"B":"C+",
      top: score === maxScore,
    }));
  }, [us?.currentSkills]);

  const HISTORY = useMemo(() => {
    const ch = us?.challengeHistory || [];
    if (ch.length === 0) return DEFAULT_HISTORY;
    return ch.map((c) => ({ company: "挑战", title: c.date, grade: "A", date: c.date, top: false }));
  }, [us?.challengeHistory]);

  const capabilityIndex = useMemo(() => {
    const scores = Object.values(us?.currentSkills || {});
    return scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 78;
  }, [us?.currentSkills]);
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
        {/* Header label */}
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
            CAPABILITY PASS / 能力通行证
          </span>
          <div style={{ flex: 1, height: "1px", background: "#E5E5E5" }} />
        </div>

        {/* Main pass card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            marginBottom: "16px",
            overflow: "visible",
            position: "relative",
            // 添加证件质感
            backgroundImage: `
              linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.4) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(26,26,26,0.02) 3px, rgba(26,26,26,0.02) 4px)
            `,
          }}
        >
          {/* Holographic stripe */}
          <div
            style={{
              position: "absolute",
              top: "80px",
              left: 0,
              right: 0,
              height: "28px",
              background: "linear-gradient(90deg, rgba(255,77,0,0.15) 0%, rgba(255,255,255,0.4) 25%, rgba(255,77,0,0.1) 50%, rgba(255,255,255,0.3) 75%, rgba(255,77,0,0.15) 100%)",
              zIndex: 1,
              pointerEvents: "none",
              opacity: 0.6,
            }}
          />
          
          {/* Security mesh overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(26,26,26,0.03) 8px, rgba(26,26,26,0.03) 9px),
                repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(26,26,26,0.03) 8px, rgba(26,26,26,0.03) 9px)
              `,
              pointerEvents: "none",
              zIndex: 0,
              borderRadius: "6px",
            }}
          />
          {/* Starburst — absolute top-right */}
          <div
            style={{
              position: "absolute",
              top: "-22px",
              right: "8px",
              zIndex: 2,
            }}
          >
            <StarburstSeal />
          </div>

          {/* Dark header */}
          <div
            style={{
              background: "#1A1A1A",
              padding: "14px 16px",
              position: "relative",
              // 添加微妙的浮雕效果
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                fontWeight: 700,
                color: "#FAF9F6",
                opacity: 0.4,
                letterSpacing: "0.2em",
                marginBottom: "10px",
              }}
            >
              CAREERPASS · CAPABILITY CERTIFICATION
            </div>

            <div style={{ display: "flex", gap: "14px", alignItems: "flex-end" }}>
              {/* Mini ID photo */}
              <div
                style={{
                  width: "48px",
                  height: "58px",
                  border: "2px solid #FF4D00",
                  background: "#2A2A2A",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    border: "1.5px solid #FF4D00",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "#FF4D00",
                    }}
                  >
                    陈
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "7px",
                    color: "#FAF9F6",
                    opacity: 0.5,
                    letterSpacing: "0.08em",
                  }}
                >
                  PHOTO
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#FAF9F6",
                    lineHeight: 1.1,
                    marginBottom: "4px",
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
                  产品经理实习生 · 应届生
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
            </div>
          </div>

          {/* Score grid 2×3 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1.5px solid #1A1A1A",
            }}
          >
            {SCORES.map((s, i) => (
              <div
                key={s.label}
                onClick={s.top ? onCapabilityDetail : undefined}
                style={{
                  padding: "10px 12px",
                  borderRight: i % 2 === 0 ? "1.5px solid #1A1A1A" : "none",
                  borderBottom: i < 4 ? "1.5px solid #1A1A1A" : "none",
                  cursor: s.top ? "pointer" : "default",
                  background: s.top ? "rgba(255,77,0,0.04)" : "transparent",
                }}
              >
                <div
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "10px",
                    color: "#8C8C8C",
                    marginBottom: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{s.label}</span>
                  {s.top && (
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "7px",
                        color: "#FF4D00",
                        fontWeight: 700,
                      }}
                    >
                      →
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: s.top ? "#FF4D00" : "#1A1A1A",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  {s.grade}
                </div>
                <div
                  style={{
                    height: "3px",
                    background: "#E5E5E5",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${s.score}%`,
                      background: s.top ? "#FF4D00" : "#1A1A1A",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* QR + serial */}
          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={onVerifyPass}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  color: "#1A1A1A",
                  opacity: 0.35,
                  letterSpacing: "0.1em",
                  marginBottom: "6px",
                }}
              >
                SCAN TO VERIFY
              </div>
              <QRCode />
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "7px",
                color: "#FF4D00",
                letterSpacing: "0.06em",
                marginTop: "4px",
              }}>
                点击模拟企业验证
              </div>
            </button>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#1A1A1A",
                  opacity: 0.3,
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}
              >
                ISSUED · 2026.06.09
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#1A1A1A",
                  opacity: 0.3,
                  letterSpacing: "0.08em",
                  marginBottom: "12px",
                }}
              >
                EXP · 2027.06.09
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  fontWeight: 700,
                  color: "#FF4D00",
                  letterSpacing: "0.1em",
                }}
              >
                能力指数 <AnimatedNumber value={capabilityIndex} fontSize="8px" color="#FF4D00" />
              </div>
            </div>
          </div>

          {/* Machine-readable strip */}
          <div
            style={{
              background: "#1A1A1A",
              height: "14px",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "7px",
                color: "#FAF9F6",
                opacity: 0.35,
                letterSpacing: "0.08em",
              }}
            >
              CP2026004701CHENMENGQIU0610190000PM00000000A01
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            style={{
              flex: 1,
              height: "52px",
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
              transition: "transform 0.1s, box-shadow 0.1s",
              animation: "buttonPress 0.3s ease-in-out",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0px 2px rgba(0,0,0,0.08), 1px 1px 0px #1A1A1A";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A";
            }}
            onClick={() => {
                setShowShare(true);
                showToast("准备分享通行证...", "info");
              }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A";
            }}
          >
            分享通行证
          </button>
          <button
            onClick={() => {
              onFindOpportunity?.();
            }}
            style={{
              flex: 1,
              height: "52px",
              background: "#FAF9F6",
              border: "2px solid #1A1A1A",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A",
              color: "#1A1A1A",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              cursor: "pointer",
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
            寻找机会
          </button>
        </div>

        {/* Trusted companies */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.45,
            letterSpacing: "0.15em",
            marginBottom: "10px",
          }}
        >
          认证企业
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {["字节跳动", "阿里巴巴", "腾讯", "Figma", "美团"].map((co) => (
            <button
              key={co}
              onClick={() => onViewCompanyJobs?.(co)}
              style={{
                border: "1.5px solid #1A1A1A",
                borderRadius: "2px",
                padding: "5px 10px",
                background: "#FFFFFF",
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                color: "#1A1A1A",
                cursor: "pointer",
                transition: "background-color 0.1s",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#1A1A1A";
                (e.currentTarget as HTMLElement).style.color = "#FAF9F6";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
                (e.currentTarget as HTMLElement).style.color = "#1A1A1A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
                (e.currentTarget as HTMLElement).style.color = "#1A1A1A";
              }}
            >
              {co}
            </button>
          ))}
        </div>

        {/* Challenge history */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            fontWeight: 700,
            color: "#1A1A1A",
            opacity: 0.45,
            letterSpacing: "0.15em",
            marginBottom: "10px",
          }}
        >
          挑战历史
        </div>
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            marginBottom: "32px",
          }}
        >
          {HISTORY.map((h, i) => (
            <div
              key={h.title}
              style={{
                padding: "12px 14px",
                borderBottom: i < HISTORY.length - 1 ? "1px solid #E5E5E5" : "none",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: h.top ? "#FF4D00" : "#1A1A1A",
                  border: "1.5px solid #1A1A1A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#FAF9F6",
                    lineHeight: 1,
                  }}
                >
                  {h.grade}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    marginBottom: "2px",
                  }}
                >
                  {h.title}
                </div>
                <div
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "10px",
                    color: "#8C8C8C",
                  }}
                >
                  {h.company}
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  color: "#8C8C8C",
                  letterSpacing: "0.06em",
                }}
              >
                {h.date}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ShareModal
        visible={showShare}
        onClose={() => setShowShare(false)}
        title="分享通行证"
        shareText="我的CareerPass能力通行证 - 产品设计A+"
      />
    </div>
  );
}
