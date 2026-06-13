import { useMemo, useState } from "react";
import { ShareModal } from "./ShareModal";
import { PixelAvatarMini } from "./PixelAvatar";
import type { EvaluateResult } from "./LoadingScreen";
import type { UserCareerState } from "../store/userCareerStore";
import { CAREER_INFO, type CareerType } from "../config/avatarConfig";
import { buildEquipmentExplanations } from "../config/equipmentMapping";

function StarburstIcon() {
  const pts = useMemo(() => {
    const n = 16; const outer = 52; const inner = 36;
    return Array.from({ length: n * 2 }, (_, i) => {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / n - Math.PI / 2;
      return `${60 + r * Math.cos(angle)},${60 + r * Math.sin(angle)}`;
    }).join(" ");
  }, []);
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <polygon points={pts} fill="#FF4D00" />
      <polygon points={pts} fill="none" stroke="#1A1A1A" strokeWidth="2" />
      <circle cx="60" cy="60" r="26" fill="#FAF9F6" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M47 60L55 68L73 50" stroke="#FF4D00" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

interface SuccessScreenProps {
  onViewPass: () => void;
  onViewDetail?: () => void;
  onShare: () => void;
  onContinueChallenge: () => void;
  result?: EvaluateResult | null;
  userCareerState?: UserCareerState | null;
}

function getTierLabel(score: number): string {
  if (score >= 90) return "金质";
  if (score >= 80) return "银质";
  if (score >= 70) return "铜质";
  if (score >= 55) return "基础";
  return "木质";
}

function getTierColor(score: number): string {
  if (score >= 90) return "#FFD700";
  if (score >= 80) return "#C0C0C0";
  if (score >= 70) return "#CD7F32";
  if (score >= 55) return "#808080";
  return "#8B4513";
}

function EquipmentBeforeAfter({
  growth,
  userCareerState,
  animPhase,
}: {
  growth: Record<string, { before: number; after: number; change: string }>;
  userCareerState?: UserCareerState | null;
  animPhase: number;
}) {
  const entries = Object.entries(growth);

  return (
    <div
      className={`ss-fade-up ${animPhase >= 1 ? "show" : ""}`}
      style={{
        width: "100%", background: "#FFFFFF", border: "2px solid #1A1A1A",
        borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
        overflow: "hidden", marginBottom: "14px",
      }}
    >
      <div style={{
        background: "#1A1A1A", padding: "8px 14px", display: "flex", justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
          color: "#FAF9F6", opacity: 0.6, letterSpacing: "0.1em",
        }}>
          EQUIPMENT CHANGE / 装备变化
        </span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
          color: "#4CAF50", fontWeight: 700,
        }}>
          {entries.filter(([, v]) => v.after - v.before > 0).length}件装备升级
        </span>
      </div>

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {entries.map(([skillName, entry], i) => {
          const before = entry.before || 50;
          const after = entry.after || before;
          const upgraded = after > before;
          const beforeTier = getTierLabel(before);
          const afterTier = getTierLabel(after);
          const afterColor = getTierColor(after);
          const tierChanged = beforeTier !== afterTier;

          return (
            <div
              key={skillName}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px",
                background: upgraded ? "rgba(76,175,80,0.04)" : "rgba(0,0,0,0.02)",
                borderRadius: "6px",
                border: upgraded ? "1px solid rgba(76,175,80,0.15)" : "1px solid transparent",
              }}
            >
              {/* 装备图标 */}
              <div style={{
                width: "32px", height: "32px", borderRadius: "4px",
                background: tierChanged ? afterColor + "22" : "#E5E5E5",
                border: tierChanged ? `2px solid ${afterColor}` : "2px solid #E5E5E5",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, position: "relative",
              }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                  fontWeight: 700, color: tierChanged ? afterColor : "#8C8C8C",
                }}>
                  {skillName.substring(0, 2)}
                </span>
                {tierChanged && (
                  <div style={{
                    position: "absolute", top: "-4px", right: "-4px",
                    width: "12px", height: "12px", borderRadius: "50%",
                    background: "#4CAF50", display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid #FFFFFF",
                  }}>
                    <span style={{ color: "#FFFFFF", fontSize: "8px", lineHeight: 1 }}>↑</span>
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "11px", fontWeight: 700, color: "#1A1A1A",
                  marginBottom: "2px",
                }}>
                  {skillName}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                    color: "#8C8C8C",
                  }}>
                    {beforeTier} → {afterTier}
                  </span>
                  {tierChanged && (
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px",
                      background: afterColor + "15", color: afterColor,
                      padding: "1px 6px", borderRadius: "3px", fontWeight: 700,
                    }}>
                      {afterTier}级
                    </span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", fontWeight: 700,
                  color: upgraded ? "#4CAF50" : "#8C8C8C",
                }}>
                  {upgraded ? `+${after - before}` : "—"}
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px",
                  color: "#8C8C8C", opacity: 0.6,
                }}>
                  {before}→{after}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 提示文字 */}
      <div style={{
        padding: "8px 14px", background: "rgba(255,77,0,0.04)",
        borderTop: "1px solid rgba(255,77,0,0.1)",
        textAlign: "center",
      }}>
        <span style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "10px",
          color: "#FF4D00", fontWeight: 700,
        }}>
          🎒 装备已自动更新至你的职业化身
        </span>
      </div>
    </div>
  );
}

function scoreToGrade(s: number): string {
  if (s >= 95) return "A+"; if (s >= 85) return "A"; if (s >= 75) return "B+";
  if (s >= 65) return "B"; if (s >= 55) return "C+"; return "C";
}

export function SuccessScreen({ onViewPass, onViewDetail, onShare, onContinueChallenge, result, userCareerState }: SuccessScreenProps) {
  const [showShare, setShowShare] = useState(false);
  const [animPhase, setAnimPhase] = useState(0); // 0→1→2 逐段展开
  const score = result?.overallScore ?? 85;
  const grade = scoreToGrade(score);

  // 逐步展开动画
  if (animPhase < 2) {
    setTimeout(() => setAnimPhase(p => p + 1), animPhase === 0 ? 600 : 800);
  }

  const growth = result?.skillGrowth || {};
  const growthEntries = Object.entries(growth);
  const equipUnlocks = result?.capabilities?.filter(c => c.unlockEquip) || [];
  const rankAfter = result?.rankChange?.after || userCareerState?.rank || "TOP 50%";
  const career = userCareerState?.primaryCareer || "product";
  const userId = userCareerState?.userId || "default";
  const level = Math.max(1, (userCareerState?.totalChallenges || 0) * 2 + 1);
  const gender = userCareerState?.gender || "female";

  return (
    <div style={{ flex:1, background:"#FAF9F6", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 28px", boxSizing:"border-box", overflowY:"auto", scrollbarWidth:"none" }}>
      <style>{`
        .ss-glow {
          animation: ssGlow 0.6s ease-out both;
          animation-delay: 0.3s;
        }
        @keyframes ssGlow {
          0% { filter: drop-shadow(0 0 0 transparent); }
          50% { filter: drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 40px #FF4D00); }
          100% { filter: drop-shadow(0 0 8px rgba(255,77,0,0.5)); }
        }
        .ss-equip-upgrade {
          animation: ssEquipPop 0.5s ease-out both;
          animation-delay: 0.6s;
        }
        @keyframes ssEquipPop {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .ss-growth-bar {
          animation: ssBarGrow 0.7s ease-out both;
        }
        @keyframes ssBarGrow {
          from { width: 0%; opacity: 0; }
          to { opacity: 1; }
        }
        .ss-fade-up {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.4s, transform 0.4s;
        }
        .ss-fade-up.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* ── 头部 ── */}
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"10px", fontWeight:700, color:"#1A1A1A", opacity:0.45, letterSpacing:"0.2em", marginBottom:"16px" }}>
        CHALLENGE COMPLETE
      </div>

      <StarburstIcon />
      <div style={{ fontFamily:"'PingFang SC',sans-serif", fontSize:"28px", fontWeight:700, color:"#1A1A1A", marginTop:"16px", marginBottom:"4px" }}>
        挑战完成
      </div>
      <div style={{ fontFamily:"'PingFang SC',sans-serif", fontSize:"12px", color:"#8C8C8C", marginBottom:"24px" }}>
        全部环节通过 · 能力已更新
      </div>

      {/* ── 化身发光升级 ── */}
      <div className={`${animPhase >= 0 ? "show" : ""}`} style={{
        width: "80px", height: "80px", borderRadius: "6px",
        border: "2px solid #FFD700",
        boxShadow: "0 0 16px rgba(255,215,0,0.4), 3px 3px 0px #1A1A1A",
        marginBottom: "8px", overflow: "hidden",
      }}>
        <PixelAvatarMini userId={userId} career={career} level={level} gender={gender} cachedImageUrl={userCareerState?.avatarUrl} size={80} />
      </div>
      <div style={{ fontFamily:"'PingFang SC',sans-serif", fontSize:"10px", color:"#FF4D00", fontWeight:700, marginBottom:"20px" }}>
        Lv.{level} · {CAREER_INFO[career as CareerType]?.label || career}
      </div>

      {/* ── 装备升级 ── */}
      {equipUnlocks.length > 0 && (
        <div className={`ss-equip-upgrade ss-fade-up ${animPhase >= 1 ? "show" : ""}`} style={{
          width:"100%", background:"#1A1A1A", border:"2px solid #1A1A1A", borderRadius:"8px",
          boxShadow:"0 0 12px rgba(255,215,0,0.3), 3px 3px 0px #FFD700",
          padding:"12px 14px", marginBottom:"16px", textAlign:"center",
        }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"8px", color:"#FFD700", letterSpacing:"0.12em", marginBottom:"6px" }}>
            ⚒ EQUIPMENT UPGRADE
          </div>
          {equipUnlocks.map((eq: any, i: number) => (
            <div key={i} style={{ fontFamily:"'PingFang SC',sans-serif", fontSize:"13px", fontWeight:700, color:"#FAF9F6" }}>
              {eq.name} 升级！ {eq.unlockEquip?.includes("golden") ? "★金色装备" : eq.unlockEquip?.includes("silver") ? "☆银质装备" : "解锁新装备"}
            </div>
          ))}
        </div>
      )}

      {/* ── 能力变化 ── */}
      {growthEntries.length > 0 && (
        <div className={`ss-fade-up ${animPhase >= 1 ? "show" : ""}`} style={{
          width:"100%", background:"#FFFFFF", border:"2px solid #1A1A1A", borderRadius:"8px",
          boxShadow:"0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          overflow:"hidden", marginBottom:"14px",
        }}>
          <div style={{ background:"#1A1A1A", padding:"8px 14px", display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"9px", color:"#FAF9F6", opacity:0.6, letterSpacing:"0.1em" }}>
              SKILL GROWTH
            </span>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"9px", color:"#4CAF50", fontWeight:700 }}>
              +{growthEntries.reduce((s,[,v])=>s+(v.after-v.before),0)} 总成长
            </span>
          </div>
          <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", gap:"10px" }}>
            {growthEntries.map(([name, entry]: any) => {
              const before = entry.before || 50;
              const after = entry.after || before;
              const change = after - before;
              return (
                <div key={name}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
                    <span style={{ fontFamily:"'PingFang SC',sans-serif", fontSize:"11px", color:"#1A1A1A", fontWeight:700 }}>
                      {name}
                    </span>
                    <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"10px", color: change>0?"#4CAF50":"#8C8C8C", fontWeight:700 }}>
                      {scoreToGrade(before)} → {scoreToGrade(after)}
                      {change > 0 && <span style={{ marginLeft:"4px", fontSize:"9px" }}>+{change}</span>}
                    </span>
                  </div>
                  <div style={{ height:"4px", background:"#E5E5E5", borderRadius:"2px", position:"relative" }}>
                    <div className="ss-growth-bar" style={{
                      position:"absolute", left:0, top:0, height:"100%", width:`${after}%`,
                      background: change>0?"#4CAF50":"#FF4D00", borderRadius:"2px",
                      maxWidth:"100%",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 装备变化对比 ── */}
      {growthEntries.length > 0 && (
        <EquipmentBeforeAfter
          growth={growth}
          userCareerState={userCareerState}
          animPhase={animPhase}
        />
      )}

      {/* ── 战利品 ── */}
      <div className={`ss-fade-up ${animPhase >= 2 ? "show" : ""}`} style={{
        width:"100%", background:"#FAF9F6", border:"2px solid #1A1A1A", borderRadius:"8px",
        boxShadow:"0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #FF4D00",
        padding:"14px", marginBottom:"14px",
        display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0",
      }}>
        {[
          { label:"综合得分", value:`${score}`, color:"#FF4D00" },
          { label:"排名变化", value:rankAfter, color:"#1A1A1A" },
          { label:"解锁徽章", value:`+${equipUnlocks.length || 1}`, color:"#FFD700" },
        ].map((s,i) => (
          <div key={s.label} style={{
            padding:"8px 6px", textAlign:"center",
            borderRight: i<2?"1px solid #E5E5E5":"none",
          }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"8px", color:"#8C8C8C", letterSpacing:"0.04em", marginBottom:"4px" }}>
              {s.label}
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"18px", fontWeight:700, color:s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── 成长报告时间戳 ── */}
      <div style={{
        width:"100%", padding:"8px 14px", background:"#1A1A1A", border:"2px solid #1A1A1A", borderRadius:"6px",
        marginBottom:"20px", textAlign:"center",
      }}>
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"7px", color:"#FAF9F6", opacity:0.35, letterSpacing:"0.12em", marginBottom:"3px" }}>
          📋 化身档案已更新
        </div>
        <div style={{ fontFamily:"'PingFang SC',sans-serif", fontSize:"10px", color:"#FAF9F6", opacity:0.75 }}>
          {new Date().toISOString().slice(0,10)} 完成挑战 → {growthEntries.map(([n, e]: any) => `${n}+${e.after - e.before}`).join(" · ")}
          {equipUnlocks.length > 0 && ` → 解锁${equipUnlocks.map((e:any)=>e.unlockEquip).join("·")}`}
        </div>
      </div>

      {/* ── 按钮区 ── */}
      <button onClick={onContinueChallenge} style={{
        width:"100%", height:"52px", background:"#FF4D00", border:"2px solid #1A1A1A", borderRadius:"8px",
        boxShadow:"2px 2px 0px #1A1A1A", color:"#FAF9F6",
        fontFamily:"'IBM Plex Mono',monospace", fontSize:"13px", fontWeight:700, letterSpacing:"0.1em", cursor:"pointer", marginBottom:"10px",
      }}>
        继续挑战 →
      </button>

      {onViewDetail && (
        <button onClick={onViewDetail} style={{
          width:"100%", height:"44px", background:"#1A1A1A", border:"2px solid #1A1A1A", borderRadius:"8px",
          boxShadow:"2px 2px 0px #FF4D00", color:"#FAF9F6",
          fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", cursor:"pointer", marginBottom:"10px",
        }}>
          查看详细报告
        </button>
      )}

      <button onClick={onViewPass} style={{
        width:"100%", height:"48px", background:"#FAF9F6", border:"2px solid #1A1A1A", borderRadius:"8px",
        boxShadow:"2px 2px 0px #1A1A1A", color:"#1A1A1A",
        fontFamily:"'IBM Plex Mono',monospace", fontSize:"12px", fontWeight:700, letterSpacing:"0.08em", cursor:"pointer", marginBottom:"10px",
      }}>
        查看能力通行证
      </button>

      <button onClick={() => setShowShare(true)} style={{
        width:"100%", height:"44px", background:"transparent", border:"1.5px solid #1A1A1A", borderRadius:"8px",
        color:"#1A1A1A", fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", cursor:"pointer", opacity:0.6,
      }}>
        分享成绩
      </button>

      <ShareModal visible={showShare} onClose={() => setShowShare(false)} title="分享成绩" shareText={`我的CareerPass挑战成绩 - 产品设计${grade}`} />
    </div>
  );
}
