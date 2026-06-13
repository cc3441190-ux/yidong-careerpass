import { useRef, useEffect, useState } from "react";
import { CAREER_INFO, getGradeColor, GRADE_COLORS, seededRandom } from "../config/avatarConfig";
import { generateAvatarImage, GenerationResult } from "../services/doubaoApi";
import { isDoubaoConfigured } from "../config/doubaoConfig";

interface SkillData {
  name: string;
  grade?: string;
  score: number;
}

interface VisualTraits {
  hairstyle?: string;
  glasses?: boolean;
  vibe?: string;
  outfitStyle?: string;
  expression?: string;
  accessory?: string;
}

interface PixelAvatarProps {
  userId?: string;
  career: string;
  level: number;
  skills?: SkillData[];
  size?: number;
  glow?: boolean;
  style?: React.CSSProperties;
  gender?: string; // "female" | "male"
  visualTraits?: VisualTraits;
  cachedImageUrl?: string; // 已缓存的头像 URL，跳过生图 API
  onAvatarGenerated?: (imageUrl: string) => void; // 首次生成后回调，用于存入 store
}

// 全局缓存：避免切换页面重新生成
const avatarCache = new Map<string, string>();

function cacheKey(userId: string, career: string, level: number, gender: string, visualTraits?: VisualTraits): string {
  const traitsHash = visualTraits
    ? Object.values(visualTraits).join("-")
    : "default";
  return `${userId}-${career}-${gender}-Lv${level}-${traitsHash}`;
}

// =====================================================
// PART 1: 预制装备 / 徽章叠加层（Canvas 绘制）
// =====================================================

const PIXEL_SCALE = 4; // 128/32

function drawOverlayEquipment(ctx: CanvasRenderingContext2D, career: string, gradeColor: string) {
  const s = PIXEL_SCALE;
  const accent = CAREER_INFO[career as keyof typeof CAREER_INFO]?.color || "#FF6B35";

  switch (career) {
    case "product": {
      // 原型板（右下角）
      ctx.fillStyle = gradeColor;
      fillGrid(ctx, [[22,8],[23,8],[24,8],[25,8],[26,8],[27,8]], s);
      fillGrid(ctx, [[22,9],[23,9],[24,9],[25,9],[26,9],[27,9]], s);
      fillGrid(ctx, [[22,10],[23,10],[24,10],[25,10],[26,10],[27,10]], s);
      fillGrid(ctx, [[22,11],[23,11],[24,11],[25,11],[26,11],[27,11]], s);
      fillGrid(ctx, [[22,12],[23,12],[24,12],[25,12],[26,12],[27,12]], s);
      ctx.fillStyle = "#FFFFFF";
      fillGrid(ctx, [[24,9],[25,9],[24,10],[25,10]], s);
      break;
    }
    case "design": {
      ctx.fillStyle = "#8B4513";
      fillGrid(ctx, [[22,8],[22,9],[22,10],[22,11],[22,12],[22,13],[22,14],[22,15]], s);
      ctx.fillStyle = gradeColor;
      fillGrid(ctx, [[22,15]], s);
      fillGrid(ctx, [[21,16]], s);
      ctx.fillStyle = accent;
      fillGrid(ctx, [[23,14],[24,13]], s);
      break;
    }
    case "data": {
      ctx.fillStyle = "#FAF9F6";
      fillGrid(ctx, [[5,8],[6,8],[7,8],[8,8],[9,8]], s);
      fillGrid(ctx, [[5,9],[6,9],[7,9],[8,9],[9,9]], s);
      fillGrid(ctx, [[5,10],[6,10],[7,10],[8,10],[9,10]], s);
      fillGrid(ctx, [[5,11],[6,11],[7,11],[8,11],[9,11]], s);
      fillGrid(ctx, [[5,12],[6,12],[7,12],[8,12],[9,12]], s);
      ctx.fillStyle = gradeColor;
      fillGrid(ctx, [[7,9],[7,11]], s);
      ctx.fillStyle = accent;
      fillGrid(ctx, [[6,9],[8,11]], s);
      break;
    }
    case "tech": {
      ctx.fillStyle = gradeColor;
      fillGrid(ctx, [[22,8],[23,8],[24,8],[25,8],[26,8],[27,8]], s);
      fillGrid(ctx, [[22,9],[23,9],[24,9],[25,9],[26,9],[27,9]], s);
      fillGrid(ctx, [[22,10],[23,10],[24,10],[25,10],[26,10],[27,10]], s);
      fillGrid(ctx, [[22,11],[23,11],[24,11],[25,11],[26,11],[27,11]], s);
      ctx.fillStyle = "#1A1A1A";
      fillGrid(ctx, [[24,9],[25,9],[24,10],[25,10]], s);
      ctx.fillStyle = "#2ECC71";
      fillGrid(ctx, [[24,9]], s);
      ctx.fillStyle = "#FF6B35";
      fillGrid(ctx, [[25,10]], s);
      break;
    }
  }
}

function drawOverlayBadges(ctx: CanvasRenderingContext2D, count: number) {
  const s = PIXEL_SCALE;
  const badgeColors = ["#FFD700", "#C0C0C0", "#FF6B35"];
  for (let i = 0; i < Math.min(count, 3); i++) {
    ctx.fillStyle = badgeColors[i];
    const bx = 14 + i * 2;
    fillGrid(ctx, [[bx, 11]], s);
  }
}

function fillGrid(ctx: CanvasRenderingContext2D, coords: number[][], scale: number) {
  for (const [gx, gy] of coords) {
    ctx.fillRect(gx * scale, gy * scale, scale, scale);
  }
}

// 去除白色/近白色背景，设为透明
function removeBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    // RGB 都 > 220 视为背景色，设为透明
    if (d[i] > 220 && d[i + 1] > 220 && d[i + 2] > 220) {
      d[i + 3] = 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// 分数 → 等级（新 schema 用 score 替代 grade）
function scoreToLetterGrade(score: number): string {
  if (score >= 95) return "S";
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

// =====================================================
// PART 2: 像素化工具（512→128）
// =====================================================

function downsampleToPixel(img: HTMLImageElement): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    // Step 1: 先画到 512×512 临时画布（原样）
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 512;
    tempCanvas.height = 512;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.drawImage(img, 0, 0, 512, 512);

    // Step 2: 硬缩到 128×128（关闭抗锯齿 = 像素化）
    const pixelCanvas = document.createElement("canvas");
    pixelCanvas.width = 128;
    pixelCanvas.height = 128;
    const pixelCtx = pixelCanvas.getContext("2d")!;
    pixelCtx.imageSmoothingEnabled = false;
    pixelCtx.drawImage(tempCanvas, 0, 0, 512, 512, 0, 0, 128, 128);

    resolve(pixelCanvas);
  });
}

// =====================================================
// PART 3: 组件
// =====================================================

export function PixelAvatar({
  userId = "default",
  career,
  level,
  skills = [],
  size = 128,
  glow = false,
  style,
  gender = "female",
  visualTraits,
  cachedImageUrl,
  onAvatarGenerated,
}: PixelAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const isAi = isDoubaoConfigured();
  const key = cacheKey(userId, career, level, gender, visualTraits);
  // 优先使用全局传入的缓存 URL，再用内存缓存
  const cached = cachedImageUrl || avatarCache.get(key);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 128;
    canvas.height = 128;

    const topSkill = skills.length > 0
      ? skills.reduce((a, b) => a.score > b.score ? a : b)
      : null;
    const grade = topSkill
      ? topSkill.grade
        ? topSkill.grade[0]
        : scoreToLetterGrade(topSkill.score)
      : "C";
    const gradeColor = topSkill
      ? topSkill.grade
        ? getGradeColor(topSkill.grade)
        : GRADE_COLORS[scoreToLetterGrade(topSkill.score) as keyof typeof GRADE_COLORS] || GRADE_COLORS.C
      : GRADE_COLORS.C;

    // ── 命中缓存：直接绘制并去背景 ──
    if (cached) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, 128, 128);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, 128, 128);
        // 去除白色/近白色背景
        removeBackground(ctx, 128, 128);
        drawOverlayEquipment(ctx, career, gradeColor);
        const badgeCount = Math.floor(level / 10) + 1;
        drawOverlayBadges(ctx, badgeCount);
        if (glow) {
          ctx.save();
          ctx.shadowColor = CAREER_INFO[career as keyof typeof CAREER_INFO]?.color || "#FF6B35";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "transparent";
          ctx.fillRect(0, 0, 128, 128);
          ctx.restore();
        }
        setStatus("ready");
      };
      img.src = cached;
      return;
    }

    if (isAi) {
      setStatus("loading");
      generateAvatarImage(career, grade, level, gender, visualTraits)
        .then((result: GenerationResult) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.clearRect(0, 0, 128, 128);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, 512, 512, 0, 0, 128, 128);
            removeBackground(ctx, 128, 128);
            drawOverlayEquipment(ctx, career, gradeColor);
            const badgeCount = Math.floor(level / 10) + 1;
            drawOverlayBadges(ctx, badgeCount);
            if (glow) {
              ctx.save();
              ctx.shadowColor = CAREER_INFO[career as keyof typeof CAREER_INFO]?.color || "#FF6B35";
              ctx.shadowBlur = 10;
              ctx.fillStyle = "transparent";
              ctx.fillRect(0, 0, 128, 128);
              ctx.restore();
            }
            setStatus("ready");
          };
          img.onerror = () => {
            setStatus("error");
            drawFallback(ctx, career, gradeColor, userId, level);
          };
          img.src = result.imageUrl;
          // 存入缓存
          avatarCache.set(key, result.imageUrl);
          // 通知外部保存头像 URL，避免重复生成
          onAvatarGenerated?.(result.imageUrl);
        })
        .catch(() => {
          setStatus("error");
          drawFallback(ctx, career, gradeColor, userId, level);
        });
    } else {
      drawFallback(ctx, career, gradeColor, userId, level);
      if (glow) {
        ctx.save();
        ctx.shadowColor = CAREER_INFO[career as keyof typeof CAREER_INFO]?.color || "#FF6B35";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, 128, 128);
        ctx.restore();
      }
    }
  }, [userId, career, level, skills, glow, isAi, gender, visualTraits, key, cached]);

  return (
    <div style={{ position: "relative", width: size, height: size, ...style }}>
      {status === "loading" && isAi && !cached && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "#1A1A1A", borderRadius: "4px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px", color: "#FF4D00",
          letterSpacing: "0.08em",
          zIndex: 1,
        }}>
          生成中...
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={128}
        height={128}
        style={{
          width: size,
          height: size,
          imageRendering: "pixelated",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}

// =====================================================
// Fallback: 代码绘像素人（备份方案）
// =====================================================

import { SKIN_COLOR, HAIR_COLORS, OUTFIT_COLORS } from "../config/avatarConfig";

function drawFallback(
  ctx: CanvasRenderingContext2D,
  career: string,
  gradeColor: string,
  userId: string,
  level: number,
) {
  const s = 4;
  const seed = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = seededRandom(seed || 42);
  const skin = SKIN_COLOR;
  const outfit = OUTFIT_COLORS[career as keyof typeof OUTFIT_COLORS] || "#2C2C2C";
  const accent = CAREER_INFO[career as keyof typeof CAREER_INFO]?.color || "#FF6B35";
  const hairColor = HAIR_COLORS[Math.floor(rng() * HAIR_COLORS.length)];
  const hairStyle = Math.floor(rng() * 5);
  const careerInfo = CAREER_INFO[career as keyof typeof CAREER_INFO];

  ctx.clearRect(0, 0, 128, 128);
  ctx.imageSmoothingEnabled = false;

  // Hair
  ctx.fillStyle = hairColor;
  const hairCoords = getHairCoords(hairStyle);
  fillGrid(ctx, hairCoords, s);

  // Head
  ctx.fillStyle = skin;
  fillGrid(ctx, [
    [13,3],[14,3],[15,3],[16,3],[17,3],
    [12,4],[13,4],[14,4],[15,4],[16,4],[17,4],[18,4],
    [12,5],[13,5],[14,5],[15,5],[16,5],[17,5],[18,5],
    [13,6],[14,6],[15,6],[16,6],[17,6],
  ], s);
  ctx.fillStyle = "#1A1A1A";
  fillGrid(ctx, [[14,5],[17,5]], s);

  // Neck
  ctx.fillStyle = skin;
  fillGrid(ctx, [[14,7],[15,7],[16,7],[14,8],[15,8],[16,8]], s);

  // Body
  ctx.fillStyle = outfit;
  fillGrid(ctx, getBodyCoords(), s);
  ctx.fillStyle = accent;
  fillGrid(ctx, [[14,9],[15,9],[16,9]], s);

  // Arms
  ctx.fillStyle = outfit;
  fillGrid(ctx, [[9,10],[10,10],[11,10],[9,11],[10,11],[11,11],[9,12],[10,12],[11,12],[9,13],[10,13],[11,13],[9,14],[10,14],[11,14]], s);
  fillGrid(ctx, [[19,10],[20,10],[21,10],[19,11],[20,11],[21,11],[19,12],[20,12],[21,12],[19,13],[20,13],[21,13],[19,14],[20,14],[21,14]], s);
  ctx.fillStyle = skin;
  fillGrid(ctx, [[9,15],[10,15],[11,15],[9,16],[10,16],[11,16],[19,15],[20,15],[21,15],[19,16],[20,16],[21,16]], s);

  // Legs
  ctx.fillStyle = "#1A1A1A";
  fillGrid(ctx, [
    [13,17],[14,17],[15,17],[17,17],[18,17],[19,17],
    [13,18],[14,18],[15,18],[17,18],[18,18],[19,18],
    [13,19],[14,19],[15,19],[17,19],[18,19],[19,19],
    [13,20],[14,20],[15,20],[17,20],[18,20],[19,20],
    [13,21],[14,21],[15,21],[17,21],[18,21],[19,21],
    [12,22],[13,22],[14,22],[18,22],[19,22],[20,22],
  ], s);

  // Equipment
  drawOverlayEquipment(ctx, career, gradeColor);

  // Badges
  const badgeCount = Math.floor(level / 10) + 1;
  drawOverlayBadges(ctx, badgeCount);

  // Stars
  const starCount = Math.floor(level / 5) + 1;
  const starPositions: [number, number][] = [[10,1],[20,1],[8,4],[22,4],[9,8],[21,8],[15,0]];
  for (let i = 0; i < Math.min(starCount, starPositions.length); i++) {
    const [sx, sy] = starPositions[i];
    ctx.fillStyle = accent;
    fillGrid(ctx, [[sx,sy],[sx-1,sy],[sx+1,sy],[sx,sy-1],[sx,sy+1]], s);
  }
}

function getHairCoords(style: number): number[][] {
  const styles: Record<number, number[][]> = {
    0: [[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[13,2],[14,2],[15,2],[16,2],[17,2]],
    1: [[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[12,2],[13,2],[17,2],[18,2]],
    2: [[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[12,2],[13,2],[14,2],[15,2],[16,2],[17,2],[18,2],[12,3],[13,3],[17,3],[18,3]],
    3: [[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[11,2],[12,2],[13,2],[14,2],[15,2],[16,2],[17,2],[18,2],[19,2],[11,3],[12,3],[13,3],[17,3],[18,3],[19,3]],
    4: [[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[12,2],[13,2],[14,2],[15,2],[16,2],[17,2],[18,2],[11,3],[19,3],[11,4],[11,5],[11,6],[11,7],[11,8],[11,9],[19,4],[19,5],[19,6],[19,7],[19,8],[19,9]],
  };
  return styles[style] || styles[0];
}

function getBodyCoords(): number[][] {
  const coords: number[][] = [];
  for (let row = 9; row <= 16; row++) {
    for (let col = 12; col <= 18; col++) {
      coords.push([col, row]);
    }
  }
  return coords;
}

// =====================================================
// Mini 组件（48×48，挑战中状态窗用）
// =====================================================

export function PixelAvatarMini({ userId, career, level, skills, size = 48, style, gender = "female", cachedImageUrl }: PixelAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 128;
    canvas.height = 128;

    const topSkill = skills && skills.length > 0
      ? skills.reduce((a, b) => a.score > b.score ? a : b)
      : null;
    const miniGrade = topSkill
      ? topSkill.grade
        ? topSkill.grade[0]
        : scoreToLetterGrade(topSkill.score)
      : "C";
    const gradeColor = topSkill
      ? topSkill.grade
        ? getGradeColor(topSkill.grade)
        : GRADE_COLORS[miniGrade as keyof typeof GRADE_COLORS] || GRADE_COLORS.C
      : GRADE_COLORS.C;

    // 有缓存头像 → 直接用，否则 fallback
    if (cachedImageUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, 128, 128);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, 128, 128);
        removeBackground(ctx, 128, 128);
      };
      img.src = cachedImageUrl;
      return;
    }
    drawFallback(ctx, career || "product", gradeColor, userId || "default", level || 1);
  }, [userId, career, level, skills, gender, cachedImageUrl]);

  return (
    <canvas
      ref={canvasRef}
      width={128}
      height={128}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        borderRadius: "4px",
        ...style,
      }}
    />
  );
}
