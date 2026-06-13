// DeepSeek API 服务 — 简历解析 / AI评分 / 能力分析
import { DEEPSEEK_CONFIG } from "../config/deepseekConfig";

// ==================== 通用调用 ====================

const DEFAULT_TIMEOUT_MS = 15_000; // 15 秒超时

function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function chatCompletion(messages: { role: string; content: string }[], options?: { temperature?: number; maxTokens?: number }) {
  const res = await fetchWithTimeout(`${DEEPSEEK_CONFIG.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_CONFIG.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API 错误 (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

/** 安全的 JSON 解析：AI 返回可能包含 markdown 代码块 */
function safeJsonParse(rawText: string): any {
  const cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // 尝试从文本中提取 JSON 对象
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI 返回了非 JSON 格式的内容，请重试");
  }
}

// ==================== 功能 API ====================

/** 解析简历文本 → 提取6个核心能力维度 */
export async function parseResume(resumeText: string) {
  const prompt = `你是一个专业的职业分析助手。请解析以下简历内容，返回结构化 JSON（不要包含 markdown 代码块标记）：

{
  "name": "姓名",
  "gender": "male | female",
  "primaryCareer": "product | design | data | tech",
  "secondaryCareer": "design | null",
  "skills": [
    { "name": "技能名", "score": 0-100, "evidence": "XX项目负责原型设计" }
  ],
  "experience": [
    {
      "company": "公司名",
      "role": "职位",
      "duration": "2024.03-2025.06",
      "highlights": ["负责XX功能，DAU提升30%"]
    }
  ],
  "achievements": ["获得XX设计大赛金奖"],
  "summary": "一句话职业概述",
  "personalityTags": ["逻辑强", "用户敏感"],
  "visualTraits": {
    "hairstyle": "short / medium / long / ponytail / bun / buzzcut",
    "glasses": true,
    "vibe": "business formal / casual techie / artistic / sporty / academic / streetwear",
    "outfitStyle": "suit blazer / hoodie / creative layers / varsity jacket / lab coat / minimalist",
    "expression": "confident smile / calm / focused / playful",
    "accessory": "watch / earrings / headphones / necklace / none"
  }
}

⚡ 重要规则：
1. skills 最多返回 6 个，必须是归纳融合后的核心能力大项（如 Figma+Sketch+PS 合并为"视觉设计"），不要列零散工具
2. 优先覆盖：产品设计、用户研究、原型设计、视觉设计、数据分析、项目管理/沟通协作
3. 每个 skill 的 score 要客观，基于简历中的项目经验深度
4. evidence 从简历原文中引用关键句

简历内容：
${resumeText.substring(0, 3000)}`;

  const text = await chatCompletion([
    { role: "system", content: "你是一个简历解析助手。只输出 JSON，不要附加任何说明。" },
    { role: "user", content: prompt },
  ], { temperature: 0.3 });

  return safeJsonParse(text);
}

/** 评估挑战答案 → 返回各维度评分 */
export async function evaluateChallenge(question: string, answer: string, skills: string[]) {
  const prompt = `你是一个招聘面试评估专家。请评估以下候选人的回答。

题目：${question}
候选人的回答：${answer}
相关技能维度：${skills.join("、")}

请返回 JSON 格式（不要 markdown 代码块）：
{
  "overallScore": 0-100,
  "skillGrowth": {
    "产品设计": {"before": 78, "after": 85, "change": "+7"},
    "用户研究": {"before": 72, "after": 75, "change": "+3"}
  },
  "capabilities": [
    {
      "id": "product_design",
      "name": "产品设计",
      "score": 0-100,
      "feedback": "需求拆解清晰，但交互细节考虑不足",
      "unlockEquip": "golden_prototype_board | null"
    }
  ],
  "strengths": ["逻辑框架完整", "数据支撑充分"],
  "improvements": ["用户场景覆盖不够全面"],
  "nextChallenge": "用户研究专项训练",
  "rankChange": {"before": "TOP 23%", "after": "TOP 19%"}
}`;

  const text = await chatCompletion([
    { role: "system", content: "你是严谨的面试评估专家，请基于回答质量客观评分。只输出 JSON。" },
    { role: "user", content: prompt },
  ], { temperature: 0.5 });

  return safeJsonParse(text);
}

/** 分析能力成长趋势 */
export async function analyzeCapabilityGrowth(historyData: string) {
  const prompt = `分析以下用户的能力成长数据，返回 JSON 格式：
${historyData}

返回 JSON：
{
  "currentStage": "新手/学徒/专家/大师",
  "nextMilestone": "下一个里程碑描述",
  "suggestedChallenges": ["建议挑战1", "建议挑战2"],
  "topStrengths": ["最强能力"],
  "weaknessToImprove": "最需提升的方向"
}`;

  const text = await chatCompletion([
    { role: "system", content: "你是职业发展顾问。只输出 JSON。" },
    { role: "user", content: prompt },
  ]);

  return safeJsonParse(text);
}
