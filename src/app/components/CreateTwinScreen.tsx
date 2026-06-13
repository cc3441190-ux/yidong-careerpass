import { useState, useEffect, useRef, useMemo } from "react";
import { showToast } from "./Toast";
import { PixelAvatar } from "./PixelAvatar";

// 简历解析
import { parseResume } from "../services/deepseekApi";
import { isDeepSeekConfigured } from "../config/deepseekConfig";
import { initFromParsedResume, type UserCareerState } from "../store/userCareerStore";
import { buildEquipmentExplanations, type EquipmentExplanation } from "../config/equipmentMapping";

// PDF 解析 — worker 文件手动复制到 public/pdf.worker.min.mjs
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
// CMaps 走 CDN — 中文 CID 字体映射表（去除背景也用独立函数）
const PDFJS_VERSION = "6.0.227";
const CMAP_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`;

// 注意: Tesseract.js 只在用户上传图片时才动态加载（懒加载）
// pdfjs-dist / mammoth 较小，静态导入不影响

interface CreateTwinScreenProps {
  onComplete: (userState: UserCareerState) => void;
}

// ============================================================
// 生成仪式组件
// ============================================================

function CeremonyView({
  phase,
  parsedData,
  equipmentExplanations,
  gender,
  onAvatarGenerated,
  onFinalize,
}: {
  phase: number;
  parsedData: any;
  equipmentExplanations: EquipmentExplanation[];
  gender: string;
  onAvatarGenerated: (url: string) => void;
  onFinalize: () => void;
}) {
  const skills = (parsedData?.skills || [
    { name: "产品设计", score: 88 },
    { name: "用户研究", score: 72 },
    { name: "数据分析", score: 65 },
  ]) as { name: string; score: number }[];

  const career = parsedData?.primaryCareer || "product";
  const careerLabel: Record<string, string> = {
    product: "产品经理", design: "设计师", data: "数据分析师", tech: "技术开发",
  };
  const primaryCareerLabel = careerLabel[career] || career;

  // Phase 1 的技能逐个检测：根据 phase 决定展示前几个技能
  const visibleSkillCount = phase === 1 ? Math.ceil((Date.now() % 3000) / 800) : phase >= 2 ? skills.length : 0;

  return (
    <div style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @keyframes ceremonyPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes ceremonyScan {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes ceremonyParticle {
          0% { transform: scale(0) translateY(0); opacity: 1; }
          50% { transform: scale(1.2) translateY(-20px); opacity: 0.8; }
          100% { transform: scale(0.5) translateY(-40px); opacity: 0; }
        }
        @keyframes ceremonyReveal {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ceremonyBarGrow {
          from { width: 0%; }
          to { width: var(--bar-width); }
        }
        @keyframes ceremonyFadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ceremony-skill-row { animation: ceremonyFadeSlideUp 0.5s ease-out both; }
        .ceremony-equip-card { animation: ceremonyFadeSlideUp 0.4s ease-out both; }
      `}</style>

      {/* Phase 0: 扫描数据 */}
      {phase === 0 && (
        <div style={{ width: "100%", textAlign: "center", marginTop: "40px" }}>
          <div style={{
            width: "100%", height: "4px", background: "rgba(250,249,246,0.1)", borderRadius: "2px",
            overflow: "hidden", marginBottom: "24px",
          }}>
            <div style={{
              height: "100%", width: "200%",
              background: "linear-gradient(90deg, transparent, #FF4D00, transparent)",
              animation: "ceremonyScan 1.5s linear infinite",
            }} />
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "18px", fontWeight: 700,
            color: "#FAF9F6", marginBottom: "12px", letterSpacing: "0.1em",
          }}>
            正在读取你的职业数据
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "13px",
            color: "rgba(250,249,246,0.5)", lineHeight: 1.8,
          }}>
            解析简历文本...识别关键词...构建能力画像...
          </div>
          <div style={{ marginTop: "32px", animation: "ceremonyPulse 1.2s ease-in-out infinite" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="1.5" opacity="0.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        </div>
      )}

      {/* Phase 1: 检测技能 */}
      {phase === 1 && (
        <div style={{ width: "100%", marginTop: "30px" }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "16px", fontWeight: 700,
            color: "#FAF9F6", textAlign: "center", marginBottom: "8px",
          }}>
            检测到核心能力
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "12px",
            color: "rgba(250,249,246,0.4)", textAlign: "center", marginBottom: "24px",
          }}>
            主方向：{primaryCareerLabel}
          </div>
          {skills.map((sk: { name: string; score: number }, i: number) => {
            const isHigh = sk.score >= 80;
            const barWidth = `${sk.score}%`;
            return (
              <div
                key={i}
                className="ceremony-skill-row"
                style={{
                  marginBottom: "14px",
                  animationDelay: `${i * 0.3}s`,
                  padding: "10px 14px",
                  background: isHigh ? "rgba(255,77,0,0.08)" : "rgba(250,249,246,0.04)",
                  borderRadius: "6px",
                  border: isHigh ? "1px solid rgba(255,77,0,0.2)" : "1px solid rgba(250,249,246,0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "13px",
                    color: isHigh ? "#FF4D00" : "rgba(250,249,246,0.7)", fontWeight: isHigh ? 700 : 500,
                  }}>
                    {sk.name}
                  </span>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", fontWeight: 700,
                    color: isHigh ? "#FF4D00" : "rgba(250,249,246,0.5)",
                  }}>
                    {sk.score}分{isHigh ? " ★" : ""}
                  </span>
                </div>
                <div style={{ height: "4px", background: "rgba(250,249,246,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: barWidth,
                      background: isHigh ? "#FF4D00" : "rgba(250,249,246,0.3)",
                      borderRadius: "2px",
                      animation: `ceremonyBarGrow 0.8s ease-out ${0.2 + i * 0.3}s both`,
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phase 2: 像素粒子汇聚 */}
      {phase === 2 && (
        <div style={{ width: "100%", textAlign: "center", marginTop: "40px" }}>
          <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 24px" }}>
            {/* 粒子动画 */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "6px", height: "6px",
                  background: ["#FF4D00", "#FFD700", "#FF6B35", "#FAF9F6"][i % 4],
                  left: `${30 + Math.sin((i / 12) * Math.PI * 2) * 40}%`,
                  top: `${30 + Math.cos((i / 12) * Math.PI * 2) * 40}%`,
                  animation: `ceremonyParticle 0.8s ease-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
            {/* 中心虚影 */}
            <div style={{
              position: "absolute", inset: "20%",
              border: "3px dashed rgba(255,77,0,0.3)", borderRadius: "8px",
              animation: "ceremonyPulse 1.5s ease-in-out infinite",
            }} />
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "18px", fontWeight: 700,
            color: "#FAF9F6", marginBottom: "8px",
          }}>
            你的职业化身正在生成
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "12px",
            color: "rgba(250,249,246,0.4)", marginBottom: "24px",
          }}>
            像素粒子汇聚中...
          </div>
          {/* 进度指示 */}
          <div style={{ width: "100%", maxWidth: "200px", height: "2px", background: "rgba(250,249,246,0.1)", margin: "0 auto 12px", borderRadius: "1px", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: "40%",
              background: "#FF4D00",
              animation: "ceremonyScan 2s linear infinite",
            }} />
          </div>
        </div>
      )}

      {/* Phase 3: 化身展示 */}
      {phase === 3 && (
        <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
          {/* 化身 */}
          <div style={{
            width: "120px", height: "120px", margin: "0 auto 12px",
            animation: "ceremonyReveal 0.6s ease-out both",
            borderRadius: "8px", overflow: "hidden",
            border: "2px solid rgba(255,77,0,0.3)",
            boxShadow: "0 0 20px rgba(255,77,0,0.2)",
          }}>
            <PixelAvatar
              userId={parsedData?.name ? parsedData.name.replace(/\s+/g, "-") : "new-user"}
              career={career}
              level={1}
              skills={skills.map((s: any) => ({
                name: s.name || s.label || "",
                score: typeof s.score === "number" ? s.score : 50,
              }))}
              gender={gender}
              onAvatarGenerated={onAvatarGenerated}
              size={120}
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "20px", fontWeight: 700,
            color: "#FAF9F6", marginBottom: "4px",
          }}>
            ✦ 生成完成 ✦
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "13px",
            color: "rgba(250,249,246,0.6)", marginBottom: "20px",
          }}>
            这是你在 CareerPass 的职业化身
          </div>
          <div style={{
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "11px",
            color: "rgba(250,249,246,0.35)", marginBottom: "20px", lineHeight: 1.6,
          }}>
            每一个像素块都代表你的真实数据
            <br />
            装备的颜色和数量由你的能力水平决定
          </div>
        </div>
      )}

      {/* Phase 4: 装备说明 */}
      {phase === 4 && (
        <div style={{ width: "100%", marginTop: "10px" }}>
          {/* 化身小图 */}
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ width: "80px", height: "80px", margin: "0 auto", borderRadius: "6px", overflow: "hidden", opacity: 0.8 }}>
              <PixelAvatar
                userId={parsedData?.name ? parsedData.name.replace(/\s+/g, "-") : "new-user"}
                career={career}
                level={1}
                skills={skills.map((s: any) => ({
                  name: s.name || s.label || "",
                  score: typeof s.score === "number" ? s.score : 50,
                }))}
                gender={gender}
                onAvatarGenerated={onAvatarGenerated}
                size={80}
                style={{ borderRadius: "6px" }}
              />
            </div>
          </div>

          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", fontWeight: 700,
            color: "rgba(250,249,246,0.5)", letterSpacing: "0.12em", marginBottom: "10px", paddingLeft: "4px",
          }}>
            EQUIPMENT MANIFEST / 装备清单
          </div>

          {equipmentExplanations.length > 0 ? (
            equipmentExplanations.map((eq, i) => (
              <div
                key={i}
                className="ceremony-equip-card"
                style={{
                  animationDelay: `${0.4 + i * 0.15}s`,
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  padding: "12px", marginBottom: "8px",
                  background: eq.isWeakness ? "rgba(128,128,128,0.08)" : "rgba(255,77,0,0.06)",
                  borderRadius: "8px",
                  border: eq.isWeakness ? "1px solid rgba(128,128,128,0.2)" : "1px solid rgba(255,77,0,0.15)",
                }}
              >
                <span style={{ fontSize: "24px", flexShrink: 0, opacity: eq.isWeakness ? 0.4 : 1 }}>
                  {eq.isWeakness ? "⚠️" : eq.equipmentEmoji}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "13px",
                      fontWeight: 700, color: eq.isWeakness ? "#888" : "#FAF9F6",
                    }}>
                      {eq.equipmentName}
                    </span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", fontWeight: 700,
                      padding: "1px 5px", borderRadius: "2px",
                      background: eq.gradeColor + "22", color: eq.gradeColor, border: `1px solid ${eq.gradeColor}44`,
                    }}>
                      {eq.grade}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "11px",
                    color: "rgba(250,249,246,0.45)", lineHeight: 1.5,
                  }}>
                    {eq.equipmentDesc}
                  </div>
                  {eq.isWeakness && (
                    <div style={{
                      marginTop: "6px", fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "10px", color: "rgba(255,77,0,0.6)", fontWeight: 700,
                    }}>
                      → 完成相关挑战可升级装备
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            skills.map((sk: any, i: number) => {
              const isHigh = sk.score >= 80;
              const isLow = sk.score < 70;
              return (
                <div
                  key={i}
                  className="ceremony-equip-card"
                  style={{
                    animationDelay: `${0.4 + i * 0.15}s`,
                    display: "flex", alignItems: "flex-start", gap: "10px",
                    padding: "12px", marginBottom: "8px",
                    background: isLow ? "rgba(128,128,128,0.08)" : isHigh ? "rgba(255,77,0,0.06)" : "rgba(250,249,246,0.04)",
                    borderRadius: "8px",
                    border: isLow ? "1px solid rgba(128,128,128,0.2)" : "1px solid rgba(255,77,0,0.15)",
                  }}
                >
                  <span style={{ fontSize: "20px", flexShrink: 0, opacity: isLow ? 0.4 : 1 }}>
                    {isLow ? "⚠️" : isHigh ? "🛡️" : "📋"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <span style={{
                        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "13px",
                        fontWeight: 700, color: isLow ? "#888" : "#FAF9F6",
                      }}>
                        {sk.name}{isLow ? "（待强化）" : ""}
                      </span>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", fontWeight: 700,
                        color: isHigh ? "#FFD700" : isLow ? "#808080" : "#FAF9F6",
                      }}>
                        {sk.score}分
                      </span>
                    </div>
                    <div style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "11px",
                      color: "rgba(250,249,246,0.4)",
                    }}>
                      {isLow ? "此能力待强化，可完成挑战来提升" : "此能力将影响你化身的装备等级"}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* "为什么长这样" */}
          <div style={{
            marginTop: "16px", padding: "14px",
            background: "rgba(255,215,0,0.05)", borderRadius: "8px",
            border: "1px solid rgba(255,215,0,0.15)",
          }}>
            <div style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "12px", fontWeight: 700,
              color: "#FFD700", marginBottom: "6px",
            }}>
              💡 为什么长这样？
            </div>
            <div style={{
              fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif", fontSize: "11px",
              color: "rgba(250,249,246,0.6)", lineHeight: 1.7,
            }}>
              你的职业化身基于简历中的项目经历、技能标签和职业方向自动生成。
              装备的颜色和等级代表你的能力水平，灰色装备意味着该能力尚有提升空间——
              完成相关挑战即可升级装备。
            </div>
          </div>

          {/* 进入下一步按钮 */}
          <button
            onClick={onFinalize}
            style={{
              marginTop: "24px", marginBottom: "16px",
              width: "100%", height: "52px",
              background: "#FF4D00",
              border: "2px solid #1A1A1A",
              borderRadius: "8px",
              boxShadow: "3px 3px 0px #1A1A1A",
              color: "#FAF9F6",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "14px", fontWeight: 700,
              letterSpacing: "0.15em",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "8px",
            }}
          >
            确认，进入下一步
            <span style={{ fontSize: "18px" }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function CreateTwinScreen({ onComplete }: CreateTwinScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const gender = parsedData?.gender || "female";
  const [parseError, setParseError] = useState(false);
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 生成仪式状态
  const [showCeremony, setShowCeremony] = useState(false);
  const [ceremonyPhase, setCeremonyPhase] = useState(0); // 0→1→2→3→4
  const ceremonyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 根据解析数据生成装备说明
  const equipmentExplanations = useMemo<EquipmentExplanation[]>(() => {
    if (!parsedData?.skills) return [];
    const skillMap: Record<string, number> = {};
    (parsedData.skills as any[]).forEach((s: any) => {
      skillMap[s.name || s.label] = s.score || 50;
    });
    return buildEquipmentExplanations(skillMap, []);
  }, [parsedData]);

  // 解析不同格式文件 → 提取文本（按需动态加载库）
  const extractText = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "txt") {
      return await file.text();
    }

    if (ext === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      console.log("[PDF解析] 开始解析，文件大小:", (file.size / 1024).toFixed(1), "KB");
      // 用超时保护，防止 PDF 解析无限挂起
      const pdfPromise = getDocument({
        data: arrayBuffer,
        cMapUrl: CMAP_URL,
        cMapPacked: true,
      }).promise;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("PDF 解析超时（>15s），文件可能损坏或加密")), 15000)
      );
      const pdf = await Promise.race([pdfPromise, timeoutPromise]) as any;
      console.log("[PDF解析] 文档已加载，总页数:", pdf.numPages);
      let text = "";
      const maxPages = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // 按行拼接文字，正确处理换行符
        let pageText = "";
        let lineText = "";
        for (const item of content.items as any[]) {
          lineText += item.str;
          if ((item as any).hasEOL) {
            pageText += lineText.trim() + "\n";
            lineText = "";
          } else {
            // 同一行内的文字片段用空格分隔
            if (item.str && !item.str.endsWith(" ") && lineText === item.str) {
              lineText += " ";
            }
          }
        }
        if (lineText.trim()) pageText += lineText.trim();
        text += pageText + "\n";
        console.log(`[PDF解析] 第${i}页提取 ${pageText.length} 字符`);
      }
      const totalChars = text.trim().length;
      console.log("[PDF解析] 共提取", totalChars, "字符");
      // 若提取的文本太短，可能是扫描件，提示用户
      if (totalChars < 50) {
        text += "\n（提示：此 PDF 可能为扫描件，文字内容较少）";
      }
      return text;
    }

    if (ext === "docx") {
      // 动态加载 mammoth
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    if (ext === "jpg" || ext === "jpeg" || ext === "png") {
      // 动态加载 Tesseract.js（约 10MB，只有传图片时才下载）
      const Tesseract = await import("tesseract.js");
      // 压制 Tesseract 内部参数警告
      const origWarn = console.warn;
      console.warn = () => {};
      const result = await Tesseract.default.recognize(file, "chi_sim+eng", {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            setUploadProgress(Math.round(m.progress * 100));
          }
        },
      });
      console.warn = origWarn;
      return result.data.text;
    }

    throw new Error("不支持的文件格式");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // 进度动画（真实解析时给用户视觉反馈）
    const progressAnim = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) { clearInterval(progressAnim); return 90; }
        return prev + 5;
      });
    }, 200);

    try {
      const text = await extractText(file);
      clearInterval(progressAnim);
      setResumeText(text);
      setUploadProgress(100);
      // 检查提取结果是否有效
      const trimmedText = text.replace(/（提示：此 PDF 可能为扫描件，文字内容较少）/, "").trim();
      if (!trimmedText || trimmedText.length < 5) {
        setIsUploading(false);
        showToast("该文件未能提取到有效文字，请上传文字版 PDF 或尝试图片 OCR 识别", "error");
        return;
      }
      console.log("[文件解析] 成功提取", trimmedText.length, "字符:", trimmedText.substring(0, 100) + "...");
      // 等 300ms 让用户看到 100%
      await new Promise((r) => setTimeout(r, 300));
      setIsUploading(false);
      showToast("简历读取成功！", "success");
      setStep(2);
    } catch (err: any) {
      clearInterval(progressAnim);
      setIsUploading(false);
      const errMsg = err.message || "未知错误";
      console.error("[文件解析] 解析失败:", errMsg, err);
      showToast(`读取失败: ${errMsg}`, "error");
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          showToast("简历上传成功！", "success");
          setStep(2);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // step 2 自动推进分析进度，总时长约 4 秒
  useEffect(() => {
    if (step !== 2) return;
    setAnalysisProgress(2);
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setAnalysisProgress(3), 1200));
    timers.push(setTimeout(() => setAnalysisProgress(4), 2800));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const handleGenerate = async () => {
    if (!isDeepSeekConfigured()) {
      showToast("DeepSeek 未配置，使用模拟数据", "warning");
      setParsedData({
        name: "陈孟秋",
        gender: "female",
        primaryCareer: "product",
        skills: [
          { name: "产品设计", score: 88 },
          { name: "用户研究", score: 72 },
          { name: "数据分析", score: 65 },
        ],
      });
      startCeremony();
      return;
    }

    setIsAnalyzing(true);
    showToast("正在根据你的简历生成职业化身...", "info");

    try {
      const result = await parseResume(resumeText || "候选人：陈孟秋，产品经理方向，有3年相关经验，熟练掌握产品设计、用户研究、原型设计等技能。");
      setParsedData(result);
      setParseError(false);
      setIsAnalyzing(false);
      // 启动生成仪式
      startCeremony();
    } catch (err) {
      console.error("简历解析失败:", err);
      setParseError(true);
      setIsAnalyzing(false);
      // 失败时仍用默认数据走仪式
      const fallbackData = {
        name: "陈孟秋",
        gender: "female",
        primaryCareer: "product",
        skills: [
          { name: "产品设计", score: 88 },
          { name: "用户研究", score: 72 },
          { name: "数据分析", score: 65 },
        ],
      };
      setParsedData(fallbackData);
      startCeremony();
      showToast("AI 分析异常，已使用默认画像", "warning");
    }
  };

  // 生成仪式流程
  const startCeremony = () => {
    setShowCeremony(true);
    setCeremonyPhase(0);
    // Phase 0: 扫描数据 (0.8s)
    ceremonyTimerRef.current = setTimeout(() => setCeremonyPhase(1), 800);
    // Phase 1: 检测技能逐个展示 (每个 0.5s, 最多 3s)
    setTimeout(() => setCeremonyPhase(2), 1600);
    // Phase 2: 像素粒子汇聚 (2.5s)
    setTimeout(() => setCeremonyPhase(3), 3000);
    // Phase 3: 化身展示 + 装备说明 (4s)
    setTimeout(() => setCeremonyPhase(4), 6000);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (ceremonyTimerRef.current) clearTimeout(ceremonyTimerRef.current);
    };
  }, []);

  const handleFinalize = () => {
    setShowCeremony(false);
    setStep(3);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        background: "#1A1A1A",
        overflow: "hidden",
      }}
    >
      {/* 背景纹理 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23FAF9F6' fill-opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />

      {/* 步骤指示器 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          paddingTop: "60px",
          paddingBottom: "40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              width: "32px",
              height: "4px",
              borderRadius: "2px",
              background: step >= s ? "#FF4D00" : "rgba(250,249,246,0.2)",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>

      {/* 步骤内容 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          overflowY: showCeremony ? "auto" : "hidden",
          scrollbarWidth: "none",
        }}
      >
        {/* ===== 生成仪式 ===== */}
        {showCeremony && (
          <CeremonyView
            phase={ceremonyPhase}
            parsedData={parsedData}
            equipmentExplanations={equipmentExplanations}
            gender={gender}
            onAvatarGenerated={setGeneratedAvatarUrl}
            onFinalize={handleFinalize}
          />
        )}

        {/* ===== 常规步骤 ===== */}
        {!showCeremony && step === 1 && (
          <>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: "#FAF9F6",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              创建职业化身
            </div>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "14px",
                color: "#FAF9F6",
                opacity: 0.6,
                marginBottom: "48px",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              上传简历，AI将为你构建
              <br />
              专属职业能力画像
            </div>

            {/* 隐藏文件输入 */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            {/* 上传区域 */}
            <div
              onClick={!isUploading ? () => fileInputRef.current?.click() : undefined}
              style={{
                width: "100%",
                maxWidth: "280px",
                height: "200px",
                border: "2px dashed rgba(250,249,246,0.3)",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                cursor: isUploading ? "default" : "pointer",
                transition: "border-color 0.2s, background-color 0.2s",
                background: isUploading ? "rgba(255,77,0,0.05)" : "transparent",
              }}
            >
              {isUploading ? (
                <>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      border: "3px solid rgba(255,77,0,0.2)",
                      borderTopColor: "#FF4D00",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "14px",
                      color: "#FF4D00",
                    }}
                  >
                    上传中 {uploadProgress}%
                  </div>
                </>
              ) : (
                <>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(250,249,246,0.5)"
                    strokeWidth="1.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <div
                    style={{
                      fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                      fontSize: "14px",
                      color: "rgba(250,249,246,0.6)",
                    }}
                  >
                    点击上传简历
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      color: "rgba(250,249,246,0.3)",
                    }}
                  >
                    支持 PDF / Word / 图片（OCR 识别）
                  </div>
                </>
              )}
            </div>

            {/* 跳过按钮 */}
            <button
              onClick={() => setStep(2)}
              style={{
                marginTop: "24px",
                background: "none",
                border: "none",
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "12px",
                color: "rgba(250,249,246,0.4)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              跳过，稍后完善
            </button>
          </>
        )}

        {!showCeremony && step === 2 && (
          <>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: "#FAF9F6",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              构建职业画像
            </div>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "14px",
                color: "#FAF9F6",
                opacity: 0.6,
                marginBottom: "48px",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              正在根据你的简历生成专属职业化身
              <br />
              分析技能 · 预测方向 · 构建能力雷达图
            </div>

            {/* 分析卡片 */}
            <div
              style={{
                width: "100%",
                maxWidth: "280px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAF9F6" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  ),
                  label: "解析简历内容",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAF9F6" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  ),
                  label: "识别核心技能",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAF9F6" strokeWidth="1.5">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  ),
                  label: "生成能力雷达图",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAF9F6" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
                    </svg>
                  ),
                  label: "预测职业方向",
                },
              ].map((item, index) => {
                const done = analysisProgress > index;
                const active = analysisProgress === index;
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px",
                      background: done ? "rgba(250,249,246,0.05)" : "rgba(250,249,246,0.03)",
                      borderRadius: "8px",
                      border: done ? "1px solid rgba(255,77,0,0.3)" : "1px solid rgba(250,249,246,0.1)",
                    }}
                  >
                    <span style={{ fontSize: "20px", opacity: done ? 1 : 0.4 }}>{item.icon}</span>
                    <span
                      style={{
                        flex: 1,
                        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                        fontSize: "14px",
                        color: done ? "#FAF9F6" : "rgba(250,249,246,0.4)",
                      }}
                    >
                      {item.label}
                    </span>
                    {done ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : active ? (
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(250,249,246,0.2)",
                          borderTopColor: "#FF4D00",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    ) : (
                      <div style={{ width: "16px", height: "16px" }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isAnalyzing}
              style={{
                marginTop: "32px",
                width: "100%",
                maxWidth: "280px",
                height: "48px",
                background: isAnalyzing ? "rgba(255,77,0,0.5)" : "#FF4D00",
                border: "2px solid #1A1A1A",
                borderRadius: "8px",
                boxShadow: "3px 3px 0px #1A1A1A",
                color: "#FAF9F6",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: isAnalyzing ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isAnalyzing ? (
                <>
                  <div style={{
                    width: "16px", height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#FFFFFF",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }} />
                  AI 分析中...
                </>
              ) : "生成职业化身"}
            </button>
          </>
        )}

        {!showCeremony && step === 3 && (
          <>
            {/* Pixel Avatar preview */}
            <PixelAvatar
              userId={parsedData?.name ? parsedData.name.replace(/\s+/g, "-") : "new-user"}
              career={parsedData?.primaryCareer || "product"}
              level={1}
              skills={(parsedData?.skills || []).map((s: any) => ({
                name: s.name || s.label || "",
                score: typeof s.score === "number" ? s.score : 50,
                grade: s.grade || undefined,
              }))}
              gender={gender}
              visualTraits={parsedData?.visualTraits}
              onAvatarGenerated={(url) => setGeneratedAvatarUrl(url)}
              size={120}
              glow={true}
              style={{
                marginBottom: "24px",
                borderRadius: "8px",
              }}
            />

            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: "#FAF9F6",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              职业化身已创建
            </div>
            <div
              style={{
                fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                fontSize: "14px",
                color: "#FAF9F6",
                opacity: 0.6,
                marginBottom: "48px",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              你的能力档案已生成
              <br />
              开始探索职业挑战吧
            </div>

            {/* 能力预览卡片 */}
            <div
              style={{
                width: "100%",
                maxWidth: "280px",
                padding: "20px",
                background: "rgba(250,249,246,0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(255,77,0,0.2)",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "12px",
                  color: "rgba(250,249,246,0.5)",
                  marginBottom: "12px",
                  letterSpacing: "0.1em",
                }}
              >
                能力概览
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                {(parsedData?.skills || [
                  { name: "产品设计", score: 88 },
                  { name: "用户研究", score: 72 },
                  { name: "数据分析", score: 65 },
                ]                ).slice(0, 3).map((item: any, index: number) => {
                  const s = item.score || 50;
                  const displayGrade = s >= 90 ? "A+" : s >= 80 ? "A" : s >= 70 ? "B+" : s >= 60 ? "B" : "C";
                  return (
                    <div
                      key={index}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "12px 8px",
                        background: "rgba(255,77,0,0.1)",
                        borderRadius: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#FF4D00",
                          marginBottom: "4px",
                        }}
                      >
                        {displayGrade}
                      </div>
                      <div
                        style={{
                          fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                          fontSize: "10px",
                          color: "rgba(250,249,246,0.6)",
                        }}
                      >
                        {item.name || item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 进入按钮 */}
            <button
              onClick={() => {
                const userState = initFromParsedResume(
                  "user-" + Date.now(),
                  parsedData || {
                    name: "陈孟秋",
                    gender: "female",
                    primaryCareer: "product",
                    skills: [{ name: "产品设计", score: 88 }, { name: "用户研究", score: 72 }],
                  },
                );
                userState.avatarUrl = generatedAvatarUrl || undefined;
                onComplete(userState);
              }}
              style={{
                width: "100%",
                maxWidth: "280px",
                height: "52px",
                background: "#FF4D00",
                border: "2px solid #1A1A1A",
                borderRadius: "8px",
                boxShadow: "3px 3px 0px #1A1A1A",
                color: "#FAF9F6",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              进入 CareerPass
              <span style={{ fontSize: "18px" }}>→</span>
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
