import { useState, useMemo } from "react";
import { PixelAvatar } from "./PixelAvatar";
import { getGrowthStage, CAREER_INFO, type CareerType } from "../config/avatarConfig";
import type { UserCareerState } from "../store/userCareerStore";
import { buildEquipmentExplanations } from "../config/equipmentMapping";

interface TwinDetailScreenProps {
  onBack: () => void;
  userCareerState?: UserCareerState | null;
}

function makeDefaultBadges() {
  return [
    { name: "字节跳动", label: "认证徽章", color: "#FF4D00" },
    { name: "阿里巴巴", label: "认证徽章", color: "#FF6B35" },
    { name: "腾讯",     label: "认证徽章", color: "#3498DB" },
  ];
}

function makeDefaultTimeline() {
  return [
    { date: "入职", active: false },
    { date: "1月",  active: false },
    { date: "3月",  active: false },
    { date: "5月",  active: false },
    { date: "现在", active: true }
  ];
}

export function TwinDetailScreen({ onBack, userCareerState }: TwinDetailScreenProps) {
  const [currentTimeIdx, setCurrentTimeIdx] = useState(4);

  // ── 从全局状态或默认数据计算 ──
  const career = userCareerState?.primaryCareer || "product";
  const careerLabel = (CAREER_INFO[career as CareerType]?.label) || career;
  const level = Math.max(1, (userCareerState?.totalChallenges || 0) * 2 + 1);
  const userName = userCareerState?.name || "陈孟秋";
  const userId = userCareerState?.userId || "chen-mengqiu";
  const gender = userCareerState?.gender || "female";
  const visualTraits = userCareerState?.visualTraits;
  const skills = useMemo(() =>
    Object.entries(userCareerState?.currentSkills || {}).map(([name, score]) => ({ name, score })),
    [userCareerState?.currentSkills]
  );

  // 挑战历史 → 徽章
  const badges = useMemo(() => {
    if (!userCareerState?.challengeHistory?.length) return makeDefaultBadges();
    const badgeColors = ["#FF4D00", "#FF6B35", "#3498DB", "#2ECC71", "#9B59B6"];
    return userCareerState.challengeHistory.slice(0, 5).map((ch, i) => ({
      name: ch.challengeId.replace("challenge-", "#"),
      label: "认证徽章",
      color: badgeColors[i % badgeColors.length],
    }));
  }, [userCareerState?.challengeHistory]);

  // 时间轴
  const timeline = useMemo(() => {
    if (!userCareerState?.challengeHistory?.length) return makeDefaultTimeline();
    const nodes = [
      { date: "入职", active: false },
      ...userCareerState.challengeHistory.map((ch, i) => ({
        date: ch.date,
        active: false,
      })),
      { date: "现在", active: true },
    ];
    // 最多展示 5 个节点
    if (nodes.length > 5) {
      const step = Math.floor(nodes.length / 4);
      return [nodes[0], ...nodes.filter((_, i) => i > 0 && i < nodes.length - 1 && i % step === 0).slice(0, 3), nodes[nodes.length - 1]];
    }
    return nodes.slice(0, 5);
  }, [userCareerState?.challengeHistory]);

  // 职业数据统计
  const stats = useMemo(() => {
    const scores = Object.values(userCareerState?.currentSkills || {});
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 78;
    const winRate = userCareerState?.totalChallenges
      ? Math.round(((userCareerState.achievements?.length || 0) / userCareerState.totalChallenges) * 100)
      : 71;
    return [
      { label: "总挑战", value: `${userCareerState?.totalChallenges || 7}` },
      { label: "胜率", value: `${winRate}%` },
      { label: "均分", value: `${avgScore}` },
      { label: "企业查看", value: "23次" },
    ];
  }, [userCareerState]);

  const cpCode = useMemo(() => {
    const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return `#CP-2026-${String(1000 + (hash % 9000))}`;
  }, [userId]);

  // 装备构成说明
  const equipmentExplanations = useMemo(() => {
    return buildEquipmentExplanations(
      userCareerState?.currentSkills || {},
      userCareerState?.unlockedEquips || [],
    );
  }, [userCareerState?.currentSkills, userCareerState?.unlockedEquips]);

  return (
    <div style={{ flex:1, display: "flex", flexDirection: "column", background: "#FAF9F6", overflow: "hidden" }}>
      {/* Nav bar */}
      <div style={{
        height: "44px",
        borderBottom: "2px solid #1A1A1A",
        display: "flex", alignItems: "center", padding: "0 20px", gap: "12px",
        flexShrink: 0, background: "#FAF9F6",
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px 0",
          display: "flex", alignItems: "center", gap: "6px", transition: "opacity 0.1s",
        }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M15 6H1M5 1L1 6L5 11" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", color: "#1A1A1A", opacity: 0.5, letterSpacing: "0.1em" }}>
            返回
          </span>
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", fontWeight: 700, color: "#1A1A1A", opacity: 0.35, letterSpacing: "0.15em" }}>
          职业档案
        </span>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY: "auto", scrollbarWidth: "none", padding: "20px" }}>
        {/* Avatar hero */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          marginBottom: "20px",
        }}>
          <PixelAvatar
            userId={userId}
            career={career}
            level={level}
            gender={gender}
            visualTraits={visualTraits}
            skills={skills}
            cachedImageUrl={userCareerState?.avatarUrl}
            size={140}
            glow={true}
            style={{ cursor: "pointer", transition: "transform 0.2s" }}
          />
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1A1A1A",
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: "#FF4D00",
              border: "1.5px solid #FF4D00",
              borderRadius: "2px",
              padding: "2px 6px",
            }}>
              Lv.{level}
            </span>
            <span>{getGrowthStage(1).label} → {getGrowthStage(level).label}</span>
          </div>
        </div>

        {/* 化身构成说明 */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "8px", fontWeight: 700, color: "#1A1A1A",
          opacity: 0.35, letterSpacing: "0.2em",
          marginBottom: "10px",
        }}>
          化身构成
        </div>
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "20px",
        }}>
          {/* 装备映射表 */}
          {equipmentExplanations.length > 0 ? (
            equipmentExplanations.map((eq, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 0",
                  borderBottom: i < equipmentExplanations.length - 1 ? "1px solid #E5E5E5" : "none",
                }}
              >
                <span style={{ fontSize: "18px", flexShrink: 0, opacity: eq.isWeakness ? 0.4 : 1 }}>
                  {eq.isWeakness ? "⚠️" : eq.equipmentEmoji}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                    <span style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "11px", fontWeight: 700,
                      color: eq.isWeakness ? "#8C8C8C" : "#1A1A1A",
                    }}>
                      {eq.equipmentName}
                    </span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", fontWeight: 700,
                      padding: "1px 5px", borderRadius: "2px",
                      background: eq.gradeColor + "18", color: eq.gradeColor,
                      border: `1px solid ${eq.gradeColor}33`,
                    }}>
                      {eq.grade}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "8px", color: "#8C8C8C", letterSpacing: "0.04em",
                  }}>
                    来源：{eq.skillName} · {eq.score}分
                  </div>
                </div>
                {eq.isWeakness && (
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "7px",
                    color: "#FF4D00", fontWeight: 700, background: "rgba(255,77,0,0.06)",
                    padding: "2px 6px", borderRadius: "2px", border: "1px solid rgba(255,77,0,0.15)",
                  }}>
                    待强化
                  </span>
                )}
              </div>
            ))
          ) : (
            <div style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "11px", color: "#8C8C8C", textAlign: "center", padding: "8px 0",
            }}>
              暂无装备数据，上传简历或完成挑战后自动生成
            </div>
          )}
        </div>

        {/* 为什么长这样 */}
        <div style={{
          background: "rgba(255,77,0,0.04)",
          border: "1.5px solid rgba(255,77,0,0.15)",
          borderRadius: "6px",
          padding: "12px 14px",
          marginBottom: "20px",
        }}>
          <div style={{ fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "10px", fontWeight: 700, color: "#FF4D00", marginBottom: "4px" }}>
            💡 为什么长这样？
          </div>
          <div style={{ fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "9px", color: "#8C8C8C", lineHeight: 1.6 }}>
            你的化身基于简历中的项目经历、技能标签、挑战战绩自动生成。
            装备颜色和等级代表你的能力水平，灰色装备意味着该能力尚有提升空间。
          </div>
        </div>

        {/* Capability evolution timeline */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "8px", fontWeight: 700, color: "#1A1A1A",
          opacity: 0.35, letterSpacing: "0.2em",
          marginBottom: "10px",
        }}>
          能力演化时间轴
        </div>
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "3px 3px 0px #1A1A1A",
          padding: "16px 14px",
          marginBottom: "20px",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "relative",
          }}>
            {/* Connecting line */}
            <div style={{
              position: "absolute", top: "8px", left: "8px", right: "8px",
              height: "2px", background: "#E5E5E5", zIndex: 0,
            }} />
            {timeline.map((t: any, i: number) => (
              <button
                key={t.date}
                onClick={() => setCurrentTimeIdx(i)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "6px", position: "relative", zIndex: 1,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                <div style={{
                  width: "18px", height: "18px",
                  background: i === currentTimeIdx ? "#FF4D00" : t.active ? "#1A1A1A" : "#E5E5E5",
                  border: "2px solid #1A1A1A",
                  transition: "background 0.2s",
                }} />
                <span style={{
                  fontFamily: "'PingFang SC', sans-serif",
                  fontSize: "9px", fontWeight: i === currentTimeIdx ? 700 : 400,
                  color: i === currentTimeIdx ? "#FF4D00" : "#8C8C8C",
                }}>
                  {t.date}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Badges Wall */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "8px", fontWeight: 700, color: "#1A1A1A",
          opacity: 0.35, letterSpacing: "0.2em",
          marginBottom: "10px",
        }}>
          挑战战绩墙
        </div>
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "3px 3px 0px #1A1A1A",
          padding: "14px",
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
        }}>
          {badges.map((badge: any, i: number) => (
            <div key={i} style={{
              flex: 1,
              padding: "12px 8px",
              background: `${badge.color}10`,
              border: `1.5px solid ${badge.color}30`,
              borderRadius: "4px",
              textAlign: "center",
              cursor: "pointer",
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "7px", color: badge.color, fontWeight: 700,
                letterSpacing: "0.1em", marginBottom: "4px",
              }}>
                {badge.name}
              </div>
              <div style={{
                width: "24px", height: "24px",
                margin: "0 auto 4px",
                background: badge.color,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", fontWeight: 700, color: "#FAF9F6" }}>
                  {badge.name.substring(0, 1)}
                </span>
              </div>
              <div style={{
                fontFamily: "'PingFang SC', sans-serif",
                fontSize: "8px", color: "#8C8C8C",
              }}>
                {badge.label}
              </div>
            </div>
          ))}
        </div>

        {/* Career data */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "8px", fontWeight: 700, color: "#1A1A1A",
          opacity: 0.35, letterSpacing: "0.2em",
          marginBottom: "10px",
        }}>
          职业数据
        </div>
        <div style={{
          background: "#1A1A1A",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "3px 3px 0px #FF4D00",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex", justifyContent: "space-around",
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "22px", fontWeight: 700, color: "#FF4D00",
                lineHeight: 1, marginBottom: "4px",
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'PingFang SC', sans-serif",
                fontSize: "9px", color: "#FAF9F6", opacity: 0.5,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Share button */}
        <button
          style={{
            width: "100%", height: "52px",
            background: "#FF4D00",
            border: "2px solid #1A1A1A",
            borderRadius: "8px",
            boxShadow: "3px 3px 0px #1A1A1A",
            color: "#FAF9F6",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px",
          }}
        >
          分享我的职业档案
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5H13M9 1L13 5L9 9" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </button>
        <div style={{ height: "20px" }} />
      </div>
    </div>
  );
}
