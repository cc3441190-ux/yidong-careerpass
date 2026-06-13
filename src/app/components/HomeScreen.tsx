import { useState, useMemo } from "react";
import { AnimatedNumber } from "./AnimatedNumber";
import { RefreshIndicator } from "./RefreshIndicator";
import { usePullRefresh } from "../hooks/usePullRefresh";
import { PixelAvatar } from "./PixelAvatar";
import { getGrowthStage, CAREER_INFO, type CareerType } from "../config/avatarConfig";
import type { UserCareerState } from "../store/userCareerStore";

interface HomeScreenProps {
  onNavigate?: (screen: string) => void;
  userCareerState?: UserCareerState | null;
}

function SkillRow({ name, grade, score, top }: { name: string; grade: string; score: number; top: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 0",
        borderBottom: "1px solid #E5E5E5",
      }}
    >
      <span
        style={{
          fontFamily: "'PingFang SC', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
          fontSize: "12px",
          color: "#1A1A1A",
          width: "60px",
          flexShrink: 0,
        }}
      >
        {name}
      </span>
      <div
        style={{
          flex: 1,
          height: "4px",
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
            width: `${score}%`,
            background: top ? "#FF4D00" : "#1A1A1A",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          fontWeight: 700,
          color: top ? "#FF4D00" : "#1A1A1A",
          width: "24px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {grade}
      </span>
    </div>
  );
}

function RadarChart({ skills }: { skills: { name: string; score: number }[] }) {
  const size = 120;
  const center = size / 2;
  const maxRadius = 45;
  const numSkills = skills.length;
  
  // 计算雷达图上的点
  const getPoint = (index: number, score: number) => {
    const angle = (index * 2 * Math.PI) / numSkills - Math.PI / 2;
    const radius = (score / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  };
  
  // 生成网格线
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {/* 背景网格 */}
      {gridLevels.map((level, i) => {
        const points = skills.map((_, index) => {
          const angle = (index * 2 * Math.PI) / numSkills - Math.PI / 2;
          const radius = level * maxRadius;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return `${x},${y}`;
        }).join(" ");
        
        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
        );
      })}
      
      {/* 轴线 */}
      {skills.map((_, index) => {
        const angle = (index * 2 * Math.PI) / numSkills - Math.PI / 2;
        const x = center + maxRadius * Math.cos(angle);
        const y = center + maxRadius * Math.sin(angle);
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#E5E5E5"
            strokeWidth="1"
          />
        );
      })}
      
      {/* 数据区域 */}
      <polygon
        points={skills.map((s, i) => getPoint(i, s.score)).join(" ")}
        fill="rgba(255,77,0,0.2)"
        stroke="#FF4D00"
        strokeWidth="2"
      />
      
      {/* 数据点 */}
      {skills.map((s, i) => {
        const point = getPoint(i, s.score).split(",");
        return (
          <circle
            key={i}
            cx={point[0]}
            cy={point[1]}
            r="3"
            fill="#FF4D00"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        );
      })}
      
      {/* 标签 */}
      {skills.map((s, index) => {
        const angle = (index * 2 * Math.PI) / numSkills - Math.PI / 2;
        const labelRadius = maxRadius + 12;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="'IBM Plex Mono', monospace"
            fontSize="7"
            fontWeight="700"
            fill="#1A1A1A"
          >
            {s.name.substring(0, 2)}
          </text>
        );
      })}
    </svg>
  );
}

export function HomeScreen({ onNavigate, userCareerState }: HomeScreenProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // 从全局用户状态计算展示数据
  const career = userCareerState?.primaryCareer || "product";
  const careerLabel = (CAREER_INFO[career as CareerType]?.label) || career;
  const level = Math.max(1, (userCareerState?.totalChallenges || 0) * 2 + 1);
  const userName = userCareerState?.name || "未知用户";
  const userId = userCareerState?.userId || "default";
  const gender = userCareerState?.gender || "female";
  const visualTraits = userCareerState?.visualTraits;
  const rank = userCareerState?.rank || "TOP 50%";

  // 技能数据：从 currentSkills 转换为 PixelAvatar 需要的格式
  const skills = useMemo(() => {
    const skillEntries = Object.entries(userCareerState?.currentSkills || {});
    if (skillEntries.length === 0) {
      return [
        { name: "产品设计", grade: "A+", score: 88, top: true },
        { name: "用户研究", grade: "B+", score: 72, top: false },
        { name: "原型设计", grade: "A", score: 80, top: false },
        { name: "视觉设计", grade: "B", score: 65, top: false },
        { name: "数据分析", grade: "C+", score: 58, top: false },
      ];
    }
    const maxScore = Math.max(...skillEntries.map(([, s]) => s));
    return skillEntries.map(([name, score], idx) => ({
      name,
      score,
      grade: score >= 95 ? "S" : score >= 85 ? "A+" : score >= 78 ? "A" : score >= 70 ? "B+" : score >= 60 ? "B" : "C+",
      top: score === maxScore && idx === 0,
    }));
  }, [userCareerState?.currentSkills]);

  // 能力指数：技能平均分
  const capabilityIndex = useMemo(() => {
    const scores = Object.values(userCareerState?.currentSkills || {});
    if (scores.length === 0) return 78;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [userCareerState?.currentSkills]);

  // CP 编码：基于 userId 生成确定性编码
  const cpCode = useMemo(() => {
    const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const num = 1000 + (hash % 9000);
    return `#CP-2026-${num}`;
  }, [userId]);

  // 标签：从 personalityTags 或默认
  const tags = userCareerState?.personalityTags?.length
    ? userCareerState.personalityTags.slice(0, 3)
    : ["互联网", careerLabel, "北京"];
  
  const handleRefresh = async () => {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshKey(prev => prev + 1);
  };
  
  const { containerRef, pullDistance, isPulling, isRefreshing, handlers } = usePullRefresh({
    onRefresh: handleRefresh,
    threshold: 60,
  });

  return (
    <div
      ref={containerRef}
      {...handlers}
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#FAF9F6",
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
      <div key={refreshKey} style={{ padding: "20px 20px 0" }}>
        {/* Dynamic CTA */}
        <div
          style={{
            background: "#1A1A1A",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #FF4D00",
            padding: "14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => onNavigate?.("challenge-square")}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#FAF9F6",
                marginBottom: "3px",
              }}
            >
              开始你的第一个挑战
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
              完成挑战获取通行证 · 已有 127 个岗位等你投递
            </div>
          </div>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5H13M9 1L13 5L9 9" stroke="#FF4D00" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>

        {/* Daily challenge mini-card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            padding: "12px 14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => onNavigate?.("challenge-square")}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "#FF4D00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", fontWeight: 700, color: "#FAF9F6" }}>
              DAY
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
              每日一练 · 产品分析 5 分钟
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                color: "#8C8C8C",
                letterSpacing: "0.06em",
              }}
            >
              连续 3 天打卡 · +15 经验值
            </div>
          </div>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M1 1L7 6L1 11" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </div>

        {/* Archive label */}
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
            TALENT ARCHIVE / 人才档案
          </span>
          <div style={{ flex: 1, height: "1px", background: "#E5E5E5" }} />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "8px",
              color: "#FF4D00",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            {cpCode}
          </span>
        </div>

        {/* Career Twin identity card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 14px 14px",
          }}
        >
          {/* Pixel Avatar */}
          <PixelAvatar
            userId={userId}
            career={career}
            level={level}
            skills={skills}
            gender={gender}
            visualTraits={visualTraits}
            cachedImageUrl={userCareerState?.avatarUrl}
            size={128}
          />
          {/* Level badge */}
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                fontWeight: 700,
                color: "#FF4D00",
                border: "1.5px solid #FF4D00",
                borderRadius: "2px",
                padding: "2px 6px",
                letterSpacing: "0.04em",
              }}
            >
              Lv.{level}
            </span>
            <span
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "11px",
                color: "#8C8C8C",
              }}
            >
              {getGrowthStage(level).label}
            </span>
          </div>
          {/* Name & title */}
          <div
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              color: "#1A1A1A",
              marginTop: "4px",
              textAlign: "center",
            }}
          >
            {userName}
            <span style={{ fontSize: "12px", color: "#8C8C8C", fontWeight: 400 }}>
              {" "}· {careerLabel}
            </span>
          </div>
          {/* CP Code */}
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              color: "#8C8C8C",
              marginTop: "2px",
              letterSpacing: "0.06em",
            }}
          >
            {cpCode}
          </div>
          {/* Level progress bar */}
          <div style={{ width: "100%", marginTop: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "9px",
                  color: "#8C8C8C",
                }}
              >
                产品学徒
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  color: "#FF4D00",
                  fontWeight: 700,
                }}
              >
                {capabilityIndex}%
              </span>
              <span
                style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "9px",
                  color: "#8C8C8C",
                }}
              >
                产品专家
              </span>
            </div>
            <div
              style={{
                height: "4px",
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
                  width: `${capabilityIndex}%`,
                  background: "#FF4D00",
                }}
              />
            </div>
          </div>
          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginTop: "12px",
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  border: "1.5px solid #1A1A1A",
                  borderRadius: "2px",
                  padding: "3px 6px",
                  letterSpacing: "0.02em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Link to twin detail */}
          <div
            style={{
              marginTop: "12px",
              paddingTop: "10px",
              borderTop: "1px solid #E5E5E5",
              width: "100%",
              textAlign: "center",
            }}
          >
            <span
              onClick={() => onNavigate?.("twin-detail")}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                fontWeight: 700,
                color: "#FF4D00",
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              查看职业档案 →
            </span>
          </div>
        </div>

        {/* Capability Index */}
        <div
          style={{
            background: "#1A1A1A",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A, 3px 3px 0px #FF4D00",
            marginBottom: "16px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                fontWeight: 700,
                color: "#FAF9F6",
                opacity: 0.5,
                letterSpacing: "0.15em",
                marginBottom: "4px",
              }}
            >
              CAPABILITY INDEX / 能力指数
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "48px",
                fontWeight: 700,
                color: "#FF4D00",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              <AnimatedNumber value={capabilityIndex} fontSize="48px" color="#FF4D00" />
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                color: "#FAF9F6",
                opacity: 0.4,
                marginTop: "3px",
              }}
            >
              {rank} · 同类人才
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                color: "#FAF9F6",
                opacity: 0.5,
                letterSpacing: "0.06em",
                marginBottom: "6px",
              }}
            >
              完成挑战
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "32px",
                fontWeight: 700,
                color: "#FAF9F6",
                lineHeight: 1,
              }}
            >
              <AnimatedNumber value={7} fontSize="32px" color="#FAF9F6" />
            </div>
            <div
              style={{
                height: "3px",
                background: "#FF4D00",
                marginTop: "8px",
                width: "48px",
                marginLeft: "auto",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>

        {/* Capability Profile */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "2px solid #1A1A1A",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
              能力画像
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                fontWeight: 700,
                color: "#FF4D00",
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
              onClick={() => onNavigate?.("capability-detail")}
            >
              查看详情 →
            </span>
          </div>
          {/* 雷达图 + 技能列表 */}
          <div style={{ padding: "12px 14px", display: "flex", gap: "16px", alignItems: "center" }}>
            <RadarChart skills={skills} />
            <div style={{ flex: 1 }}>
              {skills.map((s) => (
                <SkillRow key={s.name} name={s.name} grade={s.grade} score={s.score} top={s.top} />
              ))}
            </div>
          </div>
        </div>

        {/* Active challenge card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            marginBottom: "24px",
            overflow: "hidden",
          }}
        >
          {/* Black header */}
          <div
            style={{
              background: "#1A1A1A",
              padding: "10px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                fontWeight: 700,
                color: "#FAF9F6",
                opacity: 0.55,
                letterSpacing: "0.15em",
              }}
            >
              进行中的挑战
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    background: "#FF4D00",
                    animation: "livePulse 2s ease-in-out infinite",
                    boxShadow: "0 0 4px rgba(255,77,0,0.6)",
                  }}
                />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: "#FF4D00",
                  letterSpacing: "0.06em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          <div style={{ padding: "14px" }}>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#1A1A1A",
                marginBottom: "6px",
              }}
            >
              字节跳动产品经理模拟面试
            </div>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "11px",
                color: "#8C8C8C",
                marginBottom: "12px",
              }}
            >
              发布方：字节跳动 · 难度：⚡⚡⚡
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: "0",
                border: "1.5px solid #1A1A1A",
                marginBottom: "12px",
              }}
            >
              {[
                { label: "当前环节", value: "2/5" },
                { label: "剩余时间", value: "14:32" },
                { label: "实时排名", value: "#247" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRight: i < 2 ? "1.5px solid #1A1A1A" : "none",
                    textAlign: "center",
                  }}
                >
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "9px",
                        color: "#8C8C8C",
                        letterSpacing: "0.06em",
                        marginBottom: "3px",
                      }}
                    >
                      {stat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: stat.label === "实时排名" ? "#FF4D00" : "#1A1A1A",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={() => onNavigate?.("challenge-active")}
              style={{
                width: "100%",
                height: "52px",
                background: "#1A1A1A",
                border: "2px solid #1A1A1A",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A",
                color: "#FAF9F6",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
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
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A";
              }}
            >
              继续挑战
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5H13M9 1L13 5L9 9" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
