import { useState, useEffect } from "react";
import { evaluateChallenge } from "../services/deepseekApi";
import { isDeepSeekConfigured } from "../config/deepseekConfig";

// 评分结果类型（供 App 使用）
export interface CapabilityScore {
  id: string;
  name: string;
  score: number;
  feedback: string;
  unlockEquip?: string | null;
}

export interface SkillGrowthEntry {
  before: number;
  after: number;
  change: string;
}

export interface EvaluateResult {
  overallScore: number;
  skillGrowth: Record<string, SkillGrowthEntry>;
  capabilities: CapabilityScore[];
  strengths: string[];
  improvements: string[];
  nextChallenge: string;
  rankChange: { before: string; after: string };
}

interface LoadingScreenProps {
  question?: string;
  answer?: string;
  onComplete: (result?: EvaluateResult) => void;
}

const STEPS = [
  "分析回答逻辑结构...",
  "对比标准答案维度...",
  "评估表达完整性...",
  "计算能力指数更新...",
  "生成评估报告...",
];

const STEP_DELAYS = [800, 1200, 1600, 2200, 2800]; // 每步的累积毫秒

export function LoadingScreen({ question, answer, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [logs, setLogs] = useState<string[]>(["初始化评估引擎..."]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const useAi = isDeepSeekConfigured() && question && answer && answer.trim().length > 0;

    if (!useAi) {
      // 回退：模拟进度
      const duration = 2500;
      const interval = 50;
      const steps = duration / interval;
      let tick = 0;

      const id = setInterval(() => {
        tick++;
        const p = Math.min(100, Math.round((tick / steps) * 100));
        const newStep = Math.min(STEPS.length - 1, Math.floor((p / 100) * STEPS.length));
        setProgress(p);
        setStepIdx(newStep);

        if (tick >= steps) {
          clearInterval(id);
          setLogs((prev) => [...prev, "评估完成，准备生成报告..."]);
          setTimeout(() => onComplete(), 400);
        }
      }, interval);
      return () => clearInterval(id);
    }

    // ── DeepSeek 真实评估 ──
    let cancelled = false;
    const startTime = Date.now();

    // 进度动画（后台 API 正在跑）
    const animId = setInterval(() => {
      if (cancelled) return;
      const elapsed = Date.now() - startTime;
      const fakeProgress = Math.min(95, Math.round((elapsed / 4000) * 100));
      setProgress(fakeProgress);
      const newStep = Math.min(STEPS.length - 1, Math.floor((fakeProgress / 100) * STEPS.length));
      setStepIdx(newStep);

      // 模拟逐步日志
      const stepLogs = [
        "正在解析回答结构...",
        "检测到多个关键论点",
        "匹配评分维度中...",
        "与行业标准对比...",
        "综合指数计算中...",
      ];
      const visibleCount = Math.min(newStep + 2, stepLogs.length);
      setLogs(["初始化评估引擎...", ...stepLogs.slice(0, visibleCount)]);
    }, 200);

    // 真正调用 DeepSeek
    evaluateChallenge(
      question || "无题目",
      answer || "无回答",
      ["产品思维", "用户洞察", "数据分析", "沟通表达", "创新思维"]
    )
      .then((result: EvaluateResult) => {
        if (cancelled) return;
        clearInterval(animId);
        setProgress(100);
        setStepIdx(4);
        setLogs((prev) => [...prev, "评估完成，报告已生成"]);
        setTimeout(() => onComplete(result), 400);
      })
      .catch((err) => {
        if (cancelled) return;
        clearInterval(animId);
        setError(true);
        setLogs((prev) => [...prev, `评估异常: ${err.message}`, "使用基准评分..."]);
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => onComplete(), 400);
        }, 1000);
      });

    return () => {
      cancelled = true;
      clearInterval(animId);
    };
  }, [question, answer, onComplete]);

  // ... 渲染部分保持不变 ...

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26,26,26,0.88)",
      }}
    >
      {/* Loading card */}
      <div
        style={{
          width: "280px",
          background: "#FAF9F6",
          border: "2px solid #1A1A1A",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08), 4px 4px 0px #1A1A1A, 4px 4px 0px #FF4D00",
          overflow: "hidden",
        }}
      >
        {/* Header strip */}
        <div
          style={{
            background: "#1A1A1A",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              fontWeight: 700,
              color: "#FAF9F6",
              opacity: 0.65,
              letterSpacing: "0.15em",
            }}
          >
            AI EVALUATION
          </span>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  background: error ? "#FF9800" : "#FF4D00",
                  animation: `blink 1.2s ${i * 0.4}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 20px" }}>
          <div
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#1A1A1A",
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            {error ? "AI 评估异常" : "AI 正在评估你的表现"}
          </div>
          <div
            style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
              fontSize: "11px",
              color: "#8C8C8C",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            {error ? "已使用基准评分，结果可能不准确" : "请稍等，结果马上出来"}
          </div>

          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              color: "#FF4D00",
              letterSpacing: "0.06em",
              marginBottom: "8px",
              textAlign: "center",
              height: "14px",
            }}
          >
            {STEPS[stepIdx]}
          </div>

          <div
            style={{
              height: "8px",
              background: "#E5E5E5",
              border: "1.5px solid #1A1A1A",
              marginBottom: "12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${progress}%`,
                background: error ? "#FF9800" : "#FF4D00",
                transition: "width 0.1s linear",
              }}
            />
          </div>

          <div
            style={{
              background: "#1A1A1A",
              borderRadius: "4px",
              padding: "10px 12px",
              marginBottom: "12px",
              maxHeight: "100px",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            {logs.map((log, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "8px",
                  color: i === logs.length - 1 ? "#FF4D00" : "#FAF9F6",
                  opacity: i === logs.length - 1 ? 1 : 0.5,
                  letterSpacing: "0.04em",
                  lineHeight: 1.8,
                }}
              >
                <span style={{ opacity: 0.4, marginRight: "6px" }}>{String(i + 1).padStart(2, "0")}</span>
                {log}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "8px",
                color: "#8C8C8C",
                letterSpacing: "0.06em",
              }}
            >
              综合评估进度
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              {progress}%
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#FAF9F6",
            borderTop: "1.5px solid #E5E5E5",
            padding: "10px 20px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              color: "#1A1A1A",
              opacity: 0.35,
              letterSpacing: "0.08em",
            }}
          >
            CHALLENGE-2026-BD-PM-047
          </span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
