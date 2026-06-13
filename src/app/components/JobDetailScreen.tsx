import { useState } from "react";

interface JobDetailScreenProps {
  jobId: string;
  onBack: () => void;
  onApply: () => void;
}

const JOB_DATA: Record<string, any> = {
  "job-001": {
    id: "job-001",
    company: "字节跳动",
    logo: "字",
    title: "产品经理实习生",
    salary: "15-25K·15薪",
    city: "北京·朝阳区",
    type: "实习",
    duration: "3-6个月",
    education: "本科及以上",
    description: `岗位职责：
1. 参与抖音/今日头条等核心产品的功能设计与优化
2. 协助进行用户调研与数据分析，挖掘用户需求
3. 撰写产品需求文档（PRD），跟进开发落地
4. 跟踪产品数据，持续优化产品体验

任职要求：
1. 2026届本科及以上在读学生，计算机/设计/商科相关专业
2. 对互联网产品有热情，有产品实习经验优先
3. 具备良好的逻辑思维与沟通能力
4. 熟练使用Figma、Axure等原型工具`,
    requirements: [
      { skill: "产品设计", minGrade: "A", userGrade: "A+", match: true },
      { skill: "用户研究", minGrade: "B+", userGrade: "B+", match: true },
      { skill: "数据分析", minGrade: "B", userGrade: "C+", match: false },
    ],
    interviewer: "张伟 · 高级产品经理",
    verified: true,
  },
  "job-002": {
    id: "job-002",
    company: "阿里巴巴",
    logo: "阿",
    title: "产品设计师 - 淘宝",
    salary: "20-35K·16薪",
    city: "杭州·余杭区",
    type: "校招",
    duration: "长期",
    education: "本科及以上",
    description: `岗位职责：
1. 负责淘宝核心交易链路的产品设计工作
2. 深入理解用户购物行为，优化购物体验
3. 与交互/视觉设计师协作，完成设计方案
4. 通过A/B测试验证设计假设，迭代优化

任职要求：
1. 2026届本科及以上毕业生
2. 有产品设计相关实习经验
3. 对用户行为有敏锐的洞察力
4. 具备良好的数据分析和逻辑思维能力`,
    requirements: [
      { skill: "产品设计", minGrade: "A", userGrade: "A+", match: true },
      { skill: "视觉设计", minGrade: "A-", userGrade: "B", match: false },
      { skill: "原型设计", minGrade: "B+", userGrade: "A-", match: true },
    ],
    interviewer: "李娜 · UX设计专家",
    verified: true,
  },
  "job-003": {
    id: "job-003",
    company: "腾讯",
    logo: "腾",
    title: "UX研究员",
    salary: "18-30K·16薪",
    city: "深圳·南山区",
    type: "校招",
    duration: "长期",
    education: "硕士及以上",
    description: `岗位职责：
1. 负责微信/QQ等核心产品的用户体验研究
2. 设计并执行定性/定量用户研究项目
3. 将研究结果转化为可执行的产品建议
4. 建立用户研究方法和工具库

任职要求：
1. 2026届硕士及以上毕业生，心理学/人机交互/设计相关专业
2. 熟悉用户研究方法（访谈、问卷、可用性测试等）
3. 具备优秀的数据分析和报告撰写能力
4. 有用户研究实习经验者优先`,
    requirements: [
      { skill: "用户研究", minGrade: "A-", userGrade: "B+", match: false },
      { skill: "数据分析", minGrade: "B+", userGrade: "C+", match: false },
      { skill: "产品设计", minGrade: "B+", userGrade: "A+", match: true },
    ],
    interviewer: "王强 · 用户研究总监",
    verified: true,
  },
  "job-004": {
    id: "job-004",
    company: "Figma Inc.",
    logo: "F",
    title: "Product Designer",
    salary: "$4,500-7,500·14薪",
    city: "远程",
    type: "社招",
    duration: "长期",
    education: "本科及以上",
    description: `Job Responsibilities:
1. Design and ship features for Figma's core product
2. Collaborate with PMs and Engineers to define product direction
3. Conduct user research and usability testing
4. Create high-fidelity prototypes and design specs

Requirements:
1. 3+ years of product design experience
2. Strong portfolio demonstrating end-to-end design process
3. Proficiency in Figma (of course!)
4. Excellent communication skills in English`,
    requirements: [
      { skill: "产品设计", minGrade: "A", userGrade: "A+", match: true },
      { skill: "原型设计", minGrade: "A-", userGrade: "A-", match: true },
    ],
    interviewer: "Sarah Chen · Design Lead",
    verified: true,
  },
  "job-005": {
    id: "job-005",
    company: "美团",
    logo: "美",
    title: "产品经理（到店）",
    salary: "20-35K·15薪",
    city: "北京·朝阳区",
    type: "校招",
    duration: "长期",
    education: "本科及以上",
    description: `岗位职责：
1. 负责美团到店业务（餐饮/酒旅）的产品策划与设计
2. 分析商家与用户需求，制定产品方案
3. 协调研发、运营、设计等资源，推动项目落地
4. 通过数据分析持续优化产品指标

任职要求：
1. 2026届本科及以上毕业生
2. 对本地生活服务有深刻理解
3. 具备优秀的逻辑思维与沟通能力
4. 有产品相关实习经验者优先`,
    requirements: [
      { skill: "产品设计", minGrade: "A-", userGrade: "A+", match: true },
      { skill: "数据分析", minGrade: "B+", userGrade: "C+", match: false },
      { skill: "项目管理", minGrade: "B", userGrade: "B+", match: true },
    ],
    interviewer: "赵明 · 高级产品经理",
    verified: true,
  },
};

export function JobDetailScreen({ jobId, onBack, onApply }: JobDetailScreenProps) {
  const job = JOB_DATA[jobId];
  const [applied, setApplied] = useState(false);

  if (!job) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF9F6" }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#8C8C8C" }}>
          岗位不存在
        </span>
      </div>
    );
  }

  const matchCount = job.requirements.filter((r: any) => r.match).length;
  const totalCount = job.requirements.length;

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
          JOB DETAIL
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "20px 20px 0" }}>
        {/* Company card */}
        <div
          style={{
            background: "#1A1A1A",
            border: "2px solid #1A1A1A",
            boxShadow: "4px 4px 0px #FF4D00",
            padding: "16px",
            marginBottom: "16px",
            position: "relative",
          }}
        >
          {job.verified && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#FF4D00",
                padding: "2px 8px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                fontWeight: 700,
                color: "#FAF9F6",
                letterSpacing: "0.08em",
              }}
            >
              认证企业
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#2A2A2A",
                border: "2px solid #FF4D00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#FF4D00",
                }}
              >
                {job.logo}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FAF9F6",
                  marginBottom: "4px",
                }}
              >
                {job.company}
              </div>
              <div
                style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  color: "#FAF9F6",
                  opacity: 0.55,
                }}
              >
                {job.title}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              color: "#FAF9F6",
            }}
          >
            <div>
              <div style={{ opacity: 0.45, marginBottom: "2px", fontSize: "9px" }}>薪资</div>
              <div style={{ color: "#FF4D00", fontWeight: 700 }}>{job.salary}</div>
            </div>
            <div>
              <div style={{ opacity: 0.45, marginBottom: "2px", fontSize: "9px" }}>地点</div>
              <div>{job.city}</div>
            </div>
            <div>
              <div style={{ opacity: 0.45, marginBottom: "2px", fontSize: "9px" }}>类型</div>
              <div>{job.type}</div>
            </div>
          </div>
        </div>

        {/* Requirements match */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            padding: "14px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#1A1A1A",
              marginBottom: "10px",
            }}
          >
            能力要求匹配
          </div>
          {job.requirements.map((req: any) => (
            <div
              key={req.skill}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
                padding: "6px 8px",
                background: req.match ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${req.match ? "#22C55E" : "#EF4444"}`,
                borderRadius: "2px",
              }}
            >
              <span style={{ fontSize: "14px" }}>{req.match ? "✓" : "✗"}</span>
              <span
                style={{
                  flex: 1,
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  color: "#1A1A1A",
                }}
              >
                {req.skill}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  color: "#8C8C8C",
                }}
              >
                要求{req.minGrade}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "9px",
                  color: req.match ? "#22C55E" : "#EF4444",
                  fontWeight: 700,
                }}
              >
                你的{req.userGrade}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: "8px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              color: matchCount === totalCount ? "#22C55E" : matchCount > 0 ? "#FF4D00" : "#8C8C8C",
              letterSpacing: "0.08em",
            }}
          >
            {matchCount === totalCount ? "✓ 完全匹配" : `≈ 匹配 ${matchCount}/${totalCount} 项`}
          </div>
        </div>

        {/* Job description */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            padding: "14px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#1A1A1A",
              marginBottom: "10px",
            }}
          >
            岗位描述
          </div>
          <pre
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "11px",
              color: "#1A1A1A",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              margin: 0,
              padding: 0,
            }}
          >
            {job.description}
          </pre>
        </div>

        {/* Interviewer */}
        <div
          style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
            padding: "14px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#1A1A1A",
              marginBottom: "8px",
            }}
          >
            面试官
          </div>
          <div
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "12px",
              color: "#1A1A1A",
            }}
          >
            {job.interviewer}
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              color: "#8C8C8C",
              marginTop: "4px",
            }}
          >
            通过CareerPass能力通行证直接评估，跳过传统简历筛选
          </div>
        </div>

        {/* Skill gap analysis */}
        {!applied && (
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #1A1A1A",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
              padding: "14px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1A1A1A",
                marginBottom: "10px",
              }}
            >
              能力缺口分析
            </div>
            {job.requirements.filter((r: any) => !r.match).map((req: any) => (
              <div
                key={req.skill}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                  padding: "6px 8px",
                  background: "rgba(255,77,0,0.06)",
                  border: "1px solid rgba(255,77,0,0.3)",
                  borderRadius: "2px",
                }}
              >
                <span style={{ fontSize: "14px" }}>△</span>
                <span
                  style={{
                    flex: 1,
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                    fontSize: "11px",
                    color: "#1A1A1A",
                  }}
                >
                  {req.skill} 差距 {req.userGrade} → {req.minGrade}
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "8px",
                    color: "#FF4D00",
                    fontWeight: 700,
                  }}
                >
                  去提升 →
                </span>
              </div>
            ))}
            {job.requirements.filter((r: any) => !r.match).length === 0 && (
              <div
                style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "11px",
                  color: "#22C55E",
                }}
              >
                ✓ 你的能力已完全匹配该岗位要求
              </div>
            )}
          </div>
        )}

        {/* Apply button */}
        <button
          onClick={() => {
            if (!applied) {
              setApplied(true);
              onApply();
            } else {
              onBack();
            }
          }}
          style={{
            width: "100%",
            height: "52px",
            background: applied ? "#1A1A1A" : "#FF4D00",
            border: "2px solid #1A1A1A",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A",
            color: "#FAF9F6",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
            marginBottom: "32px",
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
          {applied ? "返回岗位广场" : "用通行证一键投递"}
        </button>
      </div>
    </div>
  );
}
