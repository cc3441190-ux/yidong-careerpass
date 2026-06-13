// 用户职业能力状态管理
// 打通简历解析 → 挑战评分 → 化身升级 的数据流

export interface SkillEntry {
  name: string;
  score: number;
  evidence?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  highlights: string[];
}

export interface ChallengeGrowth {
  challengeId: string;
  date: string;
  growth: Record<string, number>;
}

export interface VisualTraits {
  hairstyle?: string;
  glasses?: boolean;
  vibe?: string;
  outfitStyle?: string;
  expression?: string;
  accessory?: string;
}

export interface UserCareerState {
  userId: string;
  name: string;
  gender: string; // "female" | "male"
  visualTraits?: VisualTraits;
  avatarUrl?: string; // 生成的像素头像 URL（避免重复调用生图 API）
  primaryCareer: string;
  secondaryCareer: string | null;
  baselineSkills: Record<string, number>;    // 来自简历解析
  currentSkills: Record<string, number>;     // 基线 + 挑战累积
  challengeHistory: ChallengeGrowth[];
  achievements: string[];
  personalityTags: string[];
  experience: ExperienceEntry[];
  summary: string;
  totalChallenges: number;
  rank: string;
  unlockedEquips: string[];
  nextUnlock: { skill: string; targetScore: number; equip: string } | null;
}

// 默认初始状态
export function createDefaultState(userId: string): UserCareerState {
  return {
    userId,
    name: "未知用户",
    gender: "female",
    primaryCareer: "product",
    secondaryCareer: null,
    baselineSkills: {
      "产品设计": 60, "用户研究": 55, "原型设计": 58,
      "视觉设计": 50, "数据分析": 45,
    },
    currentSkills: {
      "产品设计": 60, "用户研究": 55, "原型设计": 58,
      "视觉设计": 50, "数据分析": 45,
    },
    challengeHistory: [],
    achievements: [],
    personalityTags: [],
    experience: [],
    summary: "",
    totalChallenges: 0,
    rank: "TOP 50%",
    unlockedEquips: [],
    nextUnlock: null,
  };
}

// 用简历解析结果初始化
export function initFromParsedResume(
  userId: string,
  parsed: {
    name?: string;
    gender?: string;
    visualTraits?: VisualTraits;
    primaryCareer?: string;
    secondaryCareer?: string | null;
    skills?: { name: string; score: number; evidence?: string }[];
    experience?: ExperienceEntry[];
    achievements?: string[];
    personalityTags?: string[];
    summary?: string;
  },
): UserCareerState {
  const skillMap: Record<string, number> = {};
  (parsed.skills || []).forEach((s) => { skillMap[s.name] = s.score; });

  // 确保核心5维都有值
  const coreSkills = ["产品设计", "用户研究", "原型设计", "视觉设计", "数据分析"];
  coreSkills.forEach((sk) => {
    if (!(sk in skillMap)) skillMap[sk] = 50;
  });

  return {
    userId,
    name: parsed.name || "未知用户",
    gender: parsed.gender || "female",
    visualTraits: parsed.visualTraits,
    primaryCareer: parsed.primaryCareer || "product",
    secondaryCareer: parsed.secondaryCareer || null,
    baselineSkills: { ...skillMap },
    currentSkills: { ...skillMap },
    challengeHistory: [],
    achievements: parsed.achievements || [],
    personalityTags: parsed.personalityTags || [],
    experience: parsed.experience || [],
    summary: parsed.summary || "",
    totalChallenges: 0,
    rank: "TOP 50%",
    unlockedEquips: [],
    nextUnlock: null,
  };
}

// 应用一次挑战评分结果 → 更新 currentSkills / rank / equips
export function applyChallengeResult(
  state: UserCareerState,
  challengeId: string,
  skillGrowth: Record<string, { before: number; after: number; change: string }>,
  rankAfter: string,
  newEquips: string[],
): UserCareerState {
  const growth: Record<string, number> = {};

  const newSkills = { ...state.currentSkills };
  Object.entries(skillGrowth).forEach(([name, entry]) => {
    newSkills[name] = entry.after;
    growth[name] = entry.after - entry.before;
  });

  // 计算总排名
  const sorted = Object.values(newSkills);
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const rank = rankAfter || (avg >= 85 ? "TOP 10%" : avg >= 70 ? "TOP 23%" : avg >= 55 ? "TOP 50%" : "TOP 75%");

  // 计算下一个解锁
  const nextUnlock = findNextUnlock(newSkills, [...state.unlockedEquips, ...newEquips]);

  return {
    ...state,
    currentSkills: newSkills,
    challengeHistory: [
      ...state.challengeHistory,
      { challengeId, date: new Date().toISOString().slice(0, 10), growth },
    ],
    totalChallenges: state.totalChallenges + 1,
    rank,
    unlockedEquips: [...new Set([...state.unlockedEquips, ...newEquips])],
    nextUnlock,
  };
}

// 查找下一个可解锁装备
function findNextUnlock(
  skills: Record<string, number>,
  alreadyUnlocked: string[],
): { skill: string; targetScore: number; equip: string } | null {
  const equipThresholds: { equip: string; skill: string; score: number }[] = [
    { equip: "golden_prototype_board", skill: "产品设计", score: 90 },
    { equip: "silver_prototype_board", skill: "产品设计", score: 80 },
    { equip: "bronze_prototype_board", skill: "产品设计", score: 70 },
    { equip: "golden_research_lens",   skill: "用户研究", score: 90 },
    { equip: "silver_research_lens",   skill: "用户研究", score: 80 },
    { equip: "bronze_research_lens",   skill: "用户研究", score: 70 },
  ];

  for (const t of equipThresholds) {
    if (!alreadyUnlocked.includes(t.equip) && (skills[t.skill] || 0) >= t.score) {
      return { skill: t.skill, targetScore: t.score, equip: t.equip };
    }
  }

  // 已有装备的下一级
  for (const t of equipThresholds) {
    if (!alreadyUnlocked.includes(t.equip)) {
      return { skill: t.skill, targetScore: t.score, equip: t.equip };
    }
  }

  return null;
}
