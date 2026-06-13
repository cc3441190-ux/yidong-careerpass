// 豆包文生图 API 服务 — Prompt 模板 + 自动降级
import { DOUBAO_CONFIG } from "../config/doubaoConfig";

// ==================== Prompt 模板 ====================

const GENDER_MAP: Record<string, string> = {
  male: "boy",
  female: "girl",
};

const CAREER_CONFIG: Record<string, { tool: string; role: string }> = {
  product: { tool: "wireframe tablet and marker", role: "product manager" },
  design:  { tool: "paintbrush and palette",      role: "designer" },
  data:    { tool: "data report board",           role: "data analyst" },
  tech:    { tool: "laptop computer",              role: "developer" },
};

const TIER_CONFIG: Record<string, string> = {
  "A+": "golden armor, cape, halo, shiny gold gear",
  "A":  "silver armor, cape",
  "B+": "bronze armor, shoulder guards",
  "B":  "gray iron armor",
  "C+": "wooden simple gear",
  "C":  "wooden simple gear",
  "D":  "torn cloth armor",
};

const COLOR_THEME: Record<string, string> = {
  product: "orange and gold",
  design:  "purple and magenta",
  data:    "blue and cyan",
  tech:    "green and lime",
};

interface VisualTraits {
  hairstyle?: string;
  glasses?: boolean;
  vibe?: string;
  outfitStyle?: string;
  expression?: string;
  accessory?: string;
}

function getTextToImagePrompt(
  career: string,
  grade: string,
  gender: string = "female",
  visualTraits?: VisualTraits,
): string {
  const c = CAREER_CONFIG[career] || CAREER_CONFIG.product;
  const t = TIER_CONFIG[grade] || TIER_CONFIG["C+"];
  const color = COLOR_THEME[career] || "orange and gold";
  const g = GENDER_MAP[gender] || "girl";

  // 根据简历推断的个性特征 → 注入 prompt
  const vt = visualTraits;
  const hairDesc = vt?.hairstyle ? `${vt.hairstyle} hair, ` : "";
  const glassesDesc = vt?.glasses ? "wearing glasses, " : "";
  const vibeDesc = vt?.vibe ? `${vt.vibe} vibe, ` : "";
  const outfitDesc = vt?.outfitStyle ? `dressed in ${vt.outfitStyle}, ` : "";
  const exprDesc = vt?.expression ? `${vt.expression}, ` : "";
  const accDesc = vt?.accessory && vt.accessory !== "none"
    ? `with ${vt.accessory}, `
    : "";

  return `pixel art, 16-bit RPG character, ${g} chibi ${c.role} holding ${c.tool},
${hairDesc}${glassesDesc}${outfitDesc}${accDesc}${exprDesc}${vibeDesc}
${t}, isometric view, full body, front facing,
${color} color scheme, pure white background, no shadow,
flat colors, limited palette 16 colors, sharp pixel edges, blocky,
retro game sprite, 128x128 resolution style, low detail,
big head small body, simple clean design`;
}

function getImageToImagePrompt(career: string, gender: string = "female"): string {
  const g = GENDER_MAP[gender] || "girl";
  const tools: Record<string, string> = {
    product: "wireframe tablet",
    design:  "paintbrush",
    data:    "data report",
    tech:    "laptop",
  };
  return `pixel art version of photo, ${g} chibi ${CAREER_CONFIG[career]?.role || "character"} holding ${tools[career] || "tool"},
keep original hairstyle and glasses, same face structure,
16-bit RPG sprite, flat colors, limited palette 16 colors,
blocky edges, pure white background, simple clean design,
128x128 resolution style, low detail, retro game character`;
}

// ==================== API 调用 ====================

export interface GenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
  modelUsed: "primary" | "fallback";
}

const IMAGE_API_TIMEOUT_MS = 20_000; // 图片生成 20 秒超时

function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

// 获取 API 基础路径：开发环境用 Vite 代理避免 CORS，生产环境直连
function getBaseUrl(): string {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "/api/ark"; // Vite 代理 → https://ark.cn-beijing.volces.com/api/v3
  }
  return DOUBAO_CONFIG.baseUrl;
}

async function callImageAPI(
  config: { apiKey: string; model: string; size: string },
  prompt: string,
): Promise<GenerationResult> {
  console.log("[豆包API] 开始请求，模型:", config.model);
  const response = await fetchWithTimeout(`${getBaseUrl()}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      prompt,
      size: config.size,
      n: 1,
      response_format: "b64_json",
    }),
  }, IMAGE_API_TIMEOUT_MS);

  if (!response.ok) {
    const errText = await response.text();
    console.error("[豆包API] 请求失败，状态码:", response.status, "错误:", errText);
    if (response.status === 403 || response.status === 429) {
      throw new Error(`QUOTA_EXCEEDED: ${errText}`);
    }
    throw new Error(`豆包 API 错误 (${response.status}): ${errText.substring(0, 200)}`);
  }

  const data = await response.json();
  console.log("[豆包API] 响应成功，data keys:", Object.keys(data));
  const b64 = data.data?.[0]?.b64_json || data.data?.[0]?.url;
  if (!b64) {
    console.error("[豆包API] 响应结构异常，完整 data:", JSON.stringify(data).substring(0, 300));
    throw new Error("豆包 API 返回异常：未包含 b64_json 或 url。请检查模型是否支持图片生成");
  }
  return {
    imageUrl: b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`,
    revisedPrompt: data.data[0]?.revised_prompt,
    modelUsed: "primary",
  };
}

// ==================== 文生图 ====================

export async function generateAvatarImage(
  career: string,
  grade: string,
  level: number,
  gender: string = "female",
  visualTraits?: VisualTraits,
): Promise<GenerationResult> {
  const primaryPrompt = getTextToImagePrompt(career, grade, gender, visualTraits);
  console.log("[豆包API] 文生图，职业:", career, "等级:", grade, "性别:", gender);
  console.log("[豆包API] Prompt 预览:", primaryPrompt.substring(0, 150) + "...");

  try {
    const result = await callImageAPI(DOUBAO_CONFIG.primary, primaryPrompt);
    console.log("[豆包API] ✅ 主模型生成成功");
    return result;
  } catch (err: any) {
    const errMsg = err.message || String(err);
    console.warn("[豆包API] ⚠️ 主模型失败:", errMsg);
    console.log("[豆包API] 尝试备用模型 Seedream...");
    const c = CAREER_CONFIG[career] || CAREER_CONFIG.product;
    const t = TIER_CONFIG[grade] || TIER_CONFIG["C+"];
    const g = GENDER_MAP[gender] || "girl";
    const fallbackPrompt = `pixel art character, ${g} chibi ${c.role} with ${c.tool}, ${t},
16-bit sprite style, pure white background, full body,
flat colors, limited palette, blocky edges, retro RPG,
simple design, low resolution, 128x128 style`;
    const fallbackResult = await callImageAPI(DOUBAO_CONFIG.fallback, fallbackPrompt);
    console.log("[豆包API] ✅ 备用模型生成成功");
    return { ...fallbackResult, modelUsed: "fallback" };
  }
}

// ==================== 图生图 ====================

export async function generateAvatarFromPhoto(
  career: string,
  photoBase64: string,
  gender: string = "female",
): Promise<GenerationResult> {
  const prompt = getImageToImagePrompt(career, gender);

  const response = await fetch(`${DOUBAO_CONFIG.baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DOUBAO_CONFIG.primary.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DOUBAO_CONFIG.primary.model,
      prompt,
      image: photoBase64,
      size: DOUBAO_CONFIG.primary.size,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`图生图 API 错误 (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("豆包图生图返回异常：未包含 b64_json");
  }
  return {
    imageUrl: `data:image/png;base64,${b64}`,
    revisedPrompt: data.data[0]?.revised_prompt,
    modelUsed: "primary",
  };
}

// ==================== 前端像素化 ====================

export async function urlToPixelAvatar(imageUrl: string): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  ctx.imageSmoothingEnabled = false;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("图片加载失败"));
  });

  ctx.drawImage(img, 0, 0, 128, 128);

  // 颜色量化 + 去除白色背景
  const imageData = ctx.getImageData(0, 0, 128, 128);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // 检测接近白色的背景（阈值可调）
    const isWhite = r > 240 && g > 240 && b > 240;
    if (isWhite) {
      // 设为完全透明
      data[i + 3] = 0;
    } else {
      // 颜色量化
      data[i]     = Math.round(r / 32) * 32;
      data[i + 1] = Math.round(g / 32) * 32;
      data[i + 2] = Math.round(b / 32) * 32;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}
