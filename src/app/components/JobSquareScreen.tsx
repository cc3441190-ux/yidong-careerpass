import { useState } from "react";
import { showToast } from "./Toast";

interface Job {
  id: string;
  company: string;
  logo: string;
  title: string;
  salary: string;
  city: string;
  type: string;
  tags: string[];
  requirements: { skill: string; minGrade: string; userGrade: string; match: boolean }[];
  verified: boolean;
  hot: boolean;
}

const ALL_JOBS: Job[] = [
  {
    id: "job-001",
    company: "字节跳动",
    logo: "字",
    title: "产品经理实习生",
    salary: "15-25K",
    city: "北京",
    type: "实习",
    tags: ["产品设计", "用户研究", "数据分析"],
    requirements: [
      { skill: "产品设计", minGrade: "A", userGrade: "A+", match: true },
      { skill: "用户研究", minGrade: "B+", userGrade: "B+", match: true },
      { skill: "数据分析", minGrade: "B", userGrade: "C+", match: false },
    ],
    verified: true,
    hot: true,
  },
  {
    id: "job-002",
    company: "阿里巴巴",
    logo: "阿",
    title: "产品设计师 - 淘宝",
    salary: "20-35K",
    city: "杭州",
    type: "校招",
    tags: ["产品设计", "视觉设计", "原型设计"],
    requirements: [
      { skill: "产品设计", minGrade: "A", userGrade: "A+", match: true },
      { skill: "视觉设计", minGrade: "A-", userGrade: "B", match: false },
      { skill: "原型设计", minGrade: "B+", userGrade: "A-", match: true },
    ],
    verified: true,
    hot: false,
  },
  {
    id: "job-003",
    company: "腾讯",
    logo: "腾",
    title: "UX研究员",
    salary: "18-30K",
    city: "深圳",
    type: "校招",
    tags: ["用户研究", "数据分析", "产品设计"],
    requirements: [
      { skill: "用户研究", minGrade: "A-", userGrade: "B+", match: false },
      { skill: "数据分析", minGrade: "B+", userGrade: "C+", match: false },
      { skill: "产品设计", minGrade: "B+", userGrade: "A+", match: true },
    ],
    verified: true,
    hot: true,
  },
  {
    id: "job-004",
    company: "Figma Inc.",
    logo: "F",
    title: "Product Designer",
    salary: "30-50K",
    city: "远程",
    type: "社招",
    tags: ["产品设计", "原型设计", "英语沟通"],
    requirements: [
      { skill: "产品设计", minGrade: "A", userGrade: "A+", match: true },
      { skill: "原型设计", minGrade: "A-", userGrade: "A-", match: true },
    ],
    verified: true,
    hot: false,
  },
  {
    id: "job-005",
    company: "美团",
    logo: "美",
    title: "产品经理（到店）",
    salary: "20-35K",
    city: "北京",
    type: "校招",
    tags: ["产品设计", "数据分析", "项目管理"],
    requirements: [
      { skill: "产品设计", minGrade: "A-", userGrade: "A+", match: true },
      { skill: "数据分析", minGrade: "B+", userGrade: "C+", match: false },
      { skill: "项目管理", minGrade: "B", userGrade: "B+", match: true },
    ],
    verified: true,
    hot: false,
  },
];

const CITIES = ["全部", "北京", "上海", "杭州", "深圳", "远程"];
const GRADE_FILTERS = ["全部", "A+及以上", "A及以上", "B+及以上", "B及以上"];

function getGradeScore(grade: string): number {
  const map: Record<string, number> = { "A+": 4, "A": 3, "A-": 2.5, "B+": 2, "B": 1, "B-": 0.5, "C+": 0, "C": 0, "C-": 0 };
  return map[grade] || 0;
}

function getMatchCount(job: Job): number {
  return job.requirements.filter((r) => r.match).length;
}

function getTotalMatch(job: Job): "full" | "partial" | "none" {
  const matchCount = getMatchCount(job);
  const total = job.requirements.length;
  if (matchCount === total) return "full";
  if (matchCount > 0) return "partial";
  return "none";
}

export function JobSquareScreen({ onViewJob, onBack }: { onViewJob: (id: string) => void; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("全部");
  const [gradeFilter, setGradeFilter] = useState("全部");

  const filteredJobs = ALL_JOBS.filter((job) => {
    if (search) {
      const lower = search.toLowerCase();
      if (!job.company.toLowerCase().includes(lower) && !job.title.toLowerCase().includes(lower) && !job.tags.some((t) => t.toLowerCase().includes(lower))) {
        return false;
      }
    }
    if (cityFilter !== "全部" && job.city !== cityFilter) return false;
    if (gradeFilter !== "全部") {
      const minScore = { "A+及以上": 4, "A及以上": 3, "B+及以上": 2, "B及以上": 1 }[gradeFilter] || 0;
      const jobMinScore = Math.min(...job.requirements.map((r) => getGradeScore(r.minGrade)));
      if (jobMinScore > minScore) return false;
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF9F6" }}>
      {/* Header with back button */}
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
          JOB SQUARE
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "20px 20px 0" }}>
        {/* Search */}

        {/* Search */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            padding: "10px 12px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#8C8C8C" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <input
            type="text"
            placeholder="搜索公司或岗位..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "13px",
              color: "#1A1A1A",
              background: "transparent",
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                style={{
                  padding: "5px 10px",
                  background: cityFilter === city ? "#1A1A1A" : "#FFFFFF",
                  color: cityFilter === city ? "#FAF9F6" : "#1A1A1A",
                  border: "1.5px solid #1A1A1A",
                  borderRadius: "2px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", overflowX: "auto", scrollbarWidth: "none" }}>
          {GRADE_FILTERS.map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              style={{
                padding: "5px 10px",
                background: gradeFilter === g ? "#FF4D00" : "#FFFFFF",
                color: gradeFilter === g ? "#FAF9F6" : "#1A1A1A",
                border: "1.5px solid #1A1A1A",
                borderRadius: "2px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {g === "全部" ? "全部等级" : g}
            </button>
          ))}
        </div>

        {/* Job count */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            color: "#8C8C8C",
            letterSpacing: "0.08em",
            marginBottom: "12px",
          }}
        >
          共 {filteredJobs.length} 个岗位 · 认证企业
        </div>

        {/* Job list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {filteredJobs.map((job) => {
            const matchType = getTotalMatch(job);
            const matchCount = getMatchCount(job);
            return (
              <div
                key={job.id}
                onClick={() => onViewJob(job.id)}
                style={{
                  background: "#FFFFFF",
                  border: "2px solid #1A1A1A",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "transform 0.1s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0px 2px rgba(0,0,0,0.06), 1px 1px 0px #1A1A1A";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A";
                }}
              >
                {/* Verified badge */}
                {job.verified && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#FF4D00",
                      padding: "2px 6px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "7px",
                      fontWeight: 700,
                      color: "#FAF9F6",
                      letterSpacing: "0.08em",
                    }}
                  >
                    认证企业
                  </div>
                )}

                {/* Hot badge */}
                {job.hot && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: job.verified ? "62px" : "10px",
                      background: "#1A1A1A",
                      padding: "2px 6px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "7px",
                      fontWeight: 700,
                      color: "#FAF9F6",
                      letterSpacing: "0.08em",
                    }}
                  >
                    HOT
                  </div>
                )}

                {/* Company & title */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "#1A1A1A",
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
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#FAF9F6",
                      }}
                    >
                      {job.logo}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#1A1A1A",
                        marginBottom: "2px",
                      }}
                    >
                      {job.company}
                    </div>
                    <div
                      style={{
                        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                        fontSize: "12px",
                        color: "#8C8C8C",
                      }}
                    >
                      {job.title}
                    </div>
                  </div>
                </div>

                {/* Salary & location */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    color: "#FF4D00",
                    fontWeight: 700,
                  }}
                >
                  <span>{job.salary}</span>
                  <span style={{ color: "#8C8C8C", fontWeight: 400 }}>{job.city}</span>
                  <span
                    style={{
                      color: "#1A1A1A",
                      background: "#F5F5F5",
                      padding: "0 4px",
                      fontWeight: 400,
                    }}
                  >
                    {job.type}
                  </span>
                </div>

                {/* Requirements */}
                <div style={{ marginBottom: "10px" }}>
                  {job.requirements.map((req) => (
                    <div
                      key={req.skill}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "9px",
                      }}
                    >
                      <span
                        style={{
                          color: req.match ? "#22C55E" : "#8C8C8C",
                          fontWeight: 700,
                        }}
                      >
                        {req.match ? "✓" : "✗"}
                      </span>
                      <span style={{ color: "#1A1A1A" }}>{req.skill}</span>
                      <span style={{ color: "#8C8C8C" }}>要求{req.minGrade}</span>
                      <span style={{ color: req.match ? "#22C55E" : "#EF4444" }}>
                        你的{req.userGrade}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Match indicator */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 10px",
                    background: matchType === "full" ? "rgba(34,197,94,0.08)" : matchType === "partial" ? "rgba(255,77,0,0.08)" : "rgba(140,140,140,0.08)",
                    border: `1px solid ${matchType === "full" ? "#22C55E" : matchType === "partial" ? "#FF4D00" : "#E5E5E5"}`,
                    borderRadius: "2px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: matchType === "full" ? "#22C55E" : matchType === "partial" ? "#FF4D00" : "#8C8C8C",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {matchType === "full" ? "✓ 完全匹配" : matchType === "partial" ? `≈ 部分匹配 (${matchCount}/${job.requirements.length})` : "✗ 暂不匹配"}
                  </span>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: "4px", marginTop: "10px", flexWrap: "wrap" }}>
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "2px 6px",
                        background: "#F5F5F5",
                        border: "1px solid #E5E5E5",
                        borderRadius: "2px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "8px",
                        color: "#8C8C8C",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
