import { useState, useMemo } from "react";
import { showToast } from "./Toast";
import { RefreshIndicator } from "./RefreshIndicator";
import { usePullRefresh } from "../hooks/usePullRefresh";

interface ChallengeSquareScreenProps {
  onAccept: () => void;
  onBack: () => void;
  onViewDetail?: (id: string) => void;
  userCareerState?: import("../store/userCareerStore").UserCareerState | null;
}

interface Challenge {
  id: string;
  company: string;
  role: string;
  title: string;
  duration: string;
  difficulty: number;
  difficultyLabel: string;
  tags: string[];
  status: "open" | "closing" | "closed";
}

const ALL_CHALLENGES: Challenge[] = [
  {
    id: "ch-001",
    company: "字节跳动",
    role: "产品经理",
    title: "模拟面试挑战",
    duration: "90分钟",
    difficulty: 3,
    difficultyLabel: "较难",
    tags: ["产品设计", "竞品分析"],
    status: "open",
  },
  {
    id: "ch-002",
    company: "腾讯",
    role: "UI设计师",
    title: "暑期实习挑战",
    duration: "60分钟",
    difficulty: 2,
    difficultyLabel: "中等",
    tags: ["视觉设计", "原型设计"],
    status: "closing",
  },
  {
    id: "ch-003",
    company: "阿里巴巴",
    role: "前端开发",
    title: "秋招挑战",
    duration: "120分钟",
    difficulty: 3,
    difficultyLabel: "较难",
    tags: ["React", "TypeScript"],
    status: "open",
  },
  {
    id: "ch-004",
    company: "美团",
    role: "数据分析师",
    title: "春招挑战",
    duration: "75分钟",
    difficulty: 2,
    difficultyLabel: "中等",
    tags: ["SQL", "数据可视化"],
    status: "closed",
  },
  {
    id: "ch-005",
    company: "字节跳动",
    role: "后端开发",
    title: "模拟面试挑战",
    duration: "90分钟",
    difficulty: 3,
    difficultyLabel: "较难",
    tags: ["系统架构", "性能优化"],
    status: "open",
  },
];

const COMPANIES = ["全部", "字节跳动", "腾讯", "阿里巴巴", "美团"];
const ROLES = ["全部", "产品经理", "UI设计师", "前端开发", "后端开发", "数据分析师"];
const DIFFICULTIES = [
  { value: 0, label: "全部" },
  { value: 1, label: "⚡ 简单" },
  { value: 2, label: "⚡⚡ 中等" },
  { value: 3, label: "⚡⚡⚡ 较难" },
];

export function ChallengeSquareScreen({ onAccept, onBack, onViewDetail, userCareerState }: ChallengeSquareScreenProps) {
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("全部");
  const [roleFilter, setRoleFilter] = useState("全部");
  const [difficultyFilter, setDifficultyFilter] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshKey(prev => prev + 1);
  };

  // ── 军师模式：计算每道挑战的能力匹配度 ──
  const ROLE_SKILL_MAP: Record<string, string[]> = {
    "产品经理": ["产品设计", "用户研究", "原型设计", "数据分析"],
    "UI设计师": ["视觉设计", "原型设计", "用户研究"],
    "前端开发": ["视觉设计", "原型设计"],
    "后端开发": ["数据分析"],
    "数据分析师": ["数据分析", "原型设计"],
  };

  const getMatchRate = useMemo(() => {
    return (challenge: Challenge): number => {
      if (!userCareerState) return 72;
      const needed = ROLE_SKILL_MAP[challenge.role] || ["产品设计", "用户研究"];
      const userSkills = userCareerState.currentSkills;
      let total = 0;
      needed.forEach(sk => {
        total += userSkills[sk] || 50;
      });
      const avgUser = total / needed.length;
      // 挑战难度越高，匹配度越低
      const diffPenalty = (challenge.difficulty - 1) * 5;
      return Math.max(30, Math.min(95, Math.round(avgUser - diffPenalty)));
    };
  }, [userCareerState]);

  const getMatchLabel = (rate: number) => {
    if (rate >= 80) return { text: "高度匹配 · 推荐挑战", color: "#4CAF50" };
    if (rate >= 65) return { text: "匹配良好", color: "#FF4D00" };
    return { text: "建议先训练", color: "#FF9800" };
  };

  // ── 军师分析：逐项技能对比 ──
  const getSkillAnalysis = (challenge: Challenge) => {
    if (!userCareerState) return null;
    const us = userCareerState;
    const needed = ROLE_SKILL_MAP[challenge.role] || ["产品设计", "用户研究"];
    const items = needed.map(sk => ({
      name: sk,
      userScore: us.currentSkills[sk] || 50,
      threshold: 60 + challenge.difficulty * 5,
    }));
    const weakSkills = items.filter(i => i.userScore < i.threshold);
    const weakNames = weakSkills.map(i => i.name);
    let advice: string;
    if (weakSkills.length === 0) {
      advice = "✅ 所有关键能力达标，放心挑战！";
    } else if (weakSkills.length === 1) {
      advice = `⚠️ 「${weakNames[0]}」可能成为瓶颈，建议先针对性强化，或直接挑战锻炼`;
    } else {
      advice = `⚠️ 「${weakNames.join("、")}」短板明显，建议先完成训练再挑战`;
    }
    return { items, weakSkills, advice };
  };

  const { containerRef, pullDistance, isPulling, isRefreshing, handlers } = usePullRefresh({
    onRefresh: handleRefresh,
    threshold: 60,
  });

  const filtered = useMemo(() => {
    return ALL_CHALLENGES.filter((c) => {
      if (companyFilter !== "全部" && c.company !== companyFilter) return false;
      if (roleFilter !== "全部" && c.role !== roleFilter) return false;
      if (difficultyFilter > 0 && c.difficulty !== difficultyFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.company.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, companyFilter, roleFilter, difficultyFilter]);

  const getDifficultyStars = (d: number) => "⚡".repeat(d);

  const getStatusBadge = (status: string) => {
    if (status === "closing") {
      return (
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            fontWeight: 700,
            color: "#FF9800",
            background: "rgba(255,152,0,0.1)",
            padding: "2px 6px",
            border: "1px solid rgba(255,152,0,0.3)",
          }}
        >
          即将截止
        </span>
      );
    }
    if (status === "closed") {
      return (
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            fontWeight: 700,
            color: "#8C8C8C",
            background: "rgba(140,140,140,0.1)",
            padding: "2px 6px",
            border: "1px solid rgba(140,140,140,0.3)",
          }}
        >
          已截止
        </span>
      );
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      {...handlers}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#FAF9F6",
        overflowY: "auto",
        scrollbarWidth: "none",
        touchAction: "pan-y",
      }}
    >
      <RefreshIndicator 
        pullDistance={pullDistance}
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        threshold={60}
      />
      {/* Header */}
      <div
        style={{
          background: "#1A1A1A",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
            <path d="M13 6H1M1 6L7 1M1 6L7 11" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              color: "#FAF9F6",
              letterSpacing: "0.1em",
            }}
          >
            返回
          </span>
        </button>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            fontWeight: 700,
            color: "#FAF9F6",
            opacity: 0.45,
            letterSpacing: "0.15em",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          挑战广场
        </span>
      </div>

      {/* Search bar */}
      <div style={{ padding: "12px 14px", flexShrink: 0 }}>
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            padding: "0 10px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="#8C8C8C" strokeWidth="1.5" />
            <path d="M9 9L13 13" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <input
            type="text"
            placeholder="搜索公司、岗位、挑战..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "12px",
              color: "#1A1A1A",
              background: "transparent",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M9 1L1 9" stroke="#8C8C8C" strokeWidth="1.2" strokeLinecap="square" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          padding: "0 14px 12px",
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 0,
        }}
      >
        {COMPANIES.map((c) => (
          <button
            key={c}
            onClick={() => setCompanyFilter(c)}
            style={{
              flexShrink: 0,
              background: companyFilter === c ? "#1A1A1A" : "#FFFFFF",
              border: "1.5px solid #1A1A1A",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "'PingFang SC', sans-serif",
              fontSize: "10px",
              fontWeight: companyFilter === c ? 700 : 400,
              color: companyFilter === c ? "#FAF9F6" : "#1A1A1A",
              transition: "background-color 0.1s",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Role filter */}
      <div
        style={{
          padding: "0 14px 12px",
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 0,
        }}
      >
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            style={{
              flexShrink: 0,
              background: roleFilter === r ? "#FF4D00" : "#FFFFFF",
              border: "1.5px solid #1A1A1A",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              fontWeight: roleFilter === r ? 700 : 400,
              color: roleFilter === r ? "#FAF9F6" : "#1A1A1A",
              transition: "background-color 0.1s",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div
        style={{
          padding: "0 14px 12px",
          display: "flex",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            onClick={() => setDifficultyFilter(d.value)}
            style={{
              flexShrink: 0,
              background: difficultyFilter === d.value ? "#1A1A1A" : "transparent",
              border: "1.5px solid #1A1A1A",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              fontWeight: difficultyFilter === d.value ? 700 : 400,
              color: difficultyFilter === d.value ? "#FAF9F6" : "#1A1A1A",
              transition: "background-color 0.1s",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div
        style={{
          padding: "0 14px 8px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          color: "#8C8C8C",
          flexShrink: 0,
        }}
      >
        共 {filtered.length} 个挑战
      </div>

      {/* ── 军师分析面板 ── */}
      {selectedChallenge && userCareerState && (() => {
        const analysis = getSkillAnalysis(selectedChallenge);
        if (!analysis) return null;
        const rate = getMatchRate(selectedChallenge);
        const ml = getMatchLabel(rate);
        return (
          <div style={{
            margin: "0 14px 16px",
            background: "#1A1A1A",
            border: "2px solid #FF4D00",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(255,77,0,0.15), 4px 4px 0px #FF4D00",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{
              padding: "14px 16px 10px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px", fontWeight: 700, color: "#FAF9F6",
                  letterSpacing: "0.12em",
                }}>
                  🔍 化身扫描分析
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "22px", fontWeight: 700, color: ml.color,
                }}>
                  {rate}%
                </span>
              </div>
              <div style={{
                fontFamily: "'PingFang SC', sans-serif",
                fontSize: "13px", fontWeight: 700, color: "#FAF9F6",
              }}>
                {selectedChallenge.company} · {selectedChallenge.role}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px", color: ml.color, marginTop: "4px",
                letterSpacing: "0.06em",
              }}>
                {ml.text}
              </div>
            </div>

            {/* 逐项对比 */}
            <div style={{ padding: "12px 16px" }}>
              {analysis.items.map((item) => {
                const barWidth = Math.min(100, (item.userScore / 100) * 100);
                const isWeak = item.userScore < item.threshold;
                const barColor = isWeak ? "#FF9800" : "#4CAF50";
                return (
                  <div key={item.name} style={{ marginBottom: "10px" }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px",
                    }}>
                      <span style={{
                        fontFamily: "'PingFang SC', sans-serif",
                        fontSize: "11px", color: "#FAF9F6",
                      }}>
                        {item.name}
                      </span>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "10px", fontWeight: 700, color: barColor,
                      }}>
                        {item.userScore}分 {isWeak ? "⚠ 可能卡关" : "✓ 达标"}
                      </span>
                    </div>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                      <div style={{
                        height: "100%",
                        width: `${barWidth}%`,
                        background: barColor,
                        borderRadius: "2px",
                        transition: "width 0.3s",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 建议 */}
            <div style={{
              padding: "10px 16px",
              background: "rgba(255,77,0,0.1)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{
                fontFamily: "'PingFang SC', sans-serif",
                fontSize: "11px", color: "#FAF9F6", lineHeight: 1.5,
              }}>
                💡 {analysis.advice}
              </div>
            </div>

            {/* 决策按钮 */}
            <div style={{ display: "flex", gap: "8px", padding: "12px 16px" }}>
              <button
                onClick={() => {
                  showToast(`已接受挑战！`, "success");
                  onAccept();
                }}
                style={{
                  flex: 1, height: "40px",
                  background: "#FF4D00", border: "2px solid #1A1A1A",
                  borderRadius: "6px", boxShadow: "2px 2px 0px #1A1A1A",
                  color: "#FAF9F6",
                  fontFamily: "'PingFang SC', sans-serif",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                }}
              >
                以当前状态进入
              </button>
              <button
                onClick={() => setSelectedChallenge(null)}
                style={{
                  width: "40px", height: "40px",
                  background: "transparent", border: "1px solid rgba(250,249,246,0.3)",
                  borderRadius: "6px", color: "rgba(250,249,246,0.5)",
                  fontFamily: "'PingFang SC', sans-serif",
                  fontSize: "18px", cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })()}

      {/* Challenge list */}
      <div style={{ padding: "0 14px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              fontFamily: "'PingFang SC', sans-serif",
              fontSize: "13px",
              color: "#8C8C8C",
            }}
          >
            暂无符合条件的挑战
          </div>
        ) : (
          filtered.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => {
                if (challenge.status === "closed") return;
                setSelectedChallenge(challenge);
              }}
              style={{
                background: "#FFFFFF",
                border: "2px solid #1A1A1A",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
                padding: "14px",
                cursor: challenge.status === "closed" ? "not-allowed" : "pointer",
                opacity: challenge.status === "closed" ? 0.5 : 1,
                transition: "background-color 0.1s, transform 0.1s",
              }}
              onMouseDown={(e) => {
                if (challenge.status !== "closed") {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(1px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0px 1px rgba(0,0,0,0.06), 1px 1px 0px #1A1A1A";
                }
              }}
              onMouseUp={(e) => {
                if (challenge.status !== "closed") {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A";
                }
              }}
              onMouseLeave={(e) => {
                if (challenge.status !== "closed") {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A";
                }
              }}
            >
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginBottom: "2px",
                    }}
                  >
                    {challenge.company} {challenge.role}
                  </div>
                  <div
                    style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "11px",
                      color: "#8C8C8C",
                    }}
                  >
                    {challenge.title}
                  </div>
                </div>
                {getStatusBadge(challenge.status)}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
                {challenge.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      border: "1px solid #1A1A1A",
                      borderRadius: "2px",
                      padding: "2px 6px",
                      background: "#FAF9F6",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "8px",
                  borderTop: "1px solid #E5E5E5",
                }}
              >
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      color: "#8C8C8C",
                    }}
                  >
                    {challenge.duration}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#FF4D00" }}>
                    {getDifficultyStars(challenge.difficulty)}
                  </span>
                  {userCareerState && (() => {
                    const rate = getMatchRate(challenge);
                    const ml = getMatchLabel(rate);
                    return (
                      <span style={{
                        fontFamily: "'PingFang SC', sans-serif",
                        fontSize: "8px",
                        color: ml.color,
                        padding: "1px 5px",
                        border: `1px solid ${ml.color}`,
                        borderRadius: "2px",
                      }}>
                        {ml.text} {rate}%
                      </span>
                    );
                  })()}
                </div>
                {challenge.status !== "closed" && (
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "#FF4D00",
                      letterSpacing: "0.06em",
                    }}
                  >
                    接受挑战 →
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
