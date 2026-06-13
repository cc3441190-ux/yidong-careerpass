// 职业化身像素头像配置

export const PIXEL = {
  size: 256,        // 内部画布 256×256
  gridSize: 64,     // 64×64 网格（精细化）
  pixelScale: 4,    // 256/64 = 4
};

// 职业方向枚举
export type CareerType = "product" | "design" | "data" | "tech";
export type SkillGrade = "S" | "A" | "B" | "C" | "D";

// 职业信息
export const CAREER_INFO: Record<CareerType, { label: string; color: string; equipment: string; emoji: string }> = {
  product: { label: "产品经理", color: "#FF6B35", equipment: "原型板", emoji: "📋" },
  design:  { label: "设计师",   color: "#9B59B6", equipment: "画笔",   emoji: "🎨" },
  data:    { label: "数据分析", color: "#3498DB", equipment: "报表",   emoji: "📊" },
  tech:    { label: "技术开发", color: "#2ECC71", equipment: "代码",   emoji: "💻" },
};

// 装备等级颜色
export const GRADE_COLORS: Record<SkillGrade, string> = {
  S: "#FFD700",  // 金色
  A: "#C0C0C0",  // 银色
  B: "#CD7F32",  // 铜色
  C: "#808080",  // 灰色
  D: "#404040",  // 破损黑
};

// 皮肤色
export const SKIN_COLOR = "#F5D0B0";

// 发色选项
export const HAIR_COLORS = ["#2C1810", "#4A3020", "#6B4226", "#8B5A2B", "#A0522D", "#1A1A1A", "#555555", "#D4A574"];

// 服装颜色（职业色+变体）
export const OUTFIT_COLORS: Record<CareerType, string> = {
  product: "#2C2C2C",
  design:  "#2C2C2C",
  data:    "#2C2C2C",
  tech:    "#2C2C2C",
};

// 成长阶段
export interface GrowthStage {
  minLv: number;
  maxLv: number;
  label: string;
  equipmentCount: number; // 装备数量
  glow: boolean;          // 发光特效
}

export const GROWTH_STAGES: GrowthStage[] = [
  { minLv: 1,  maxLv: 20,  label: "新手",   equipmentCount: 1, glow: false },
  { minLv: 21, maxLv: 40,  label: "学徒",   equipmentCount: 2, glow: false },
  { minLv: 41, maxLv: 70,  label: "专家",   equipmentCount: 3, glow: true  },
  { minLv: 71, maxLv: 999, label: "大师",   equipmentCount: 4, glow: true  },
];

export function getGrowthStage(lv: number): GrowthStage {
  const stage = GROWTH_STAGES.find(s => lv >= s.minLv && lv <= s.maxLv);
  return stage || GROWTH_STAGES[0];
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith("A+") || grade === "S") return GRADE_COLORS.S;
  if (grade.startsWith("A")) return GRADE_COLORS.A;
  if (grade.startsWith("B+") || grade === "B+") return GRADE_COLORS.B;
  if (grade.startsWith("B") || grade.startsWith("C+")) return GRADE_COLORS.C;
  return GRADE_COLORS.D;
}

// Seeded random (deterministic based on userId)
export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
