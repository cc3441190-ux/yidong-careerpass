/**
 * 装备→技能→来源映射表
 * 用于解释"你的像素化身的每个装备代表什么能力"
 */

export interface EquipmentInfo {
  id: string;
  name: string;
  emoji: string;
  skillName: string;       // 关联的技能名称
  skillKey: string;         // currentSkills 中的 key
  description: string;      // 装备说明
  threshold: number;        // 触发阈值
  tiers: { score: number; label: string; color: string }[];
}

export const EQUIPMENT_MAP: Record<string, EquipmentInfo> = {
  prototype_board: {
    id: "prototype_board",
    name: "原型板",
    emoji: "🎒",
    skillName: "产品设计",
    skillKey: "产品设计",
    description: "代表你的产品设计能力，包括需求分析、功能规划和原型制作",
    threshold: 70,
    tiers: [
      { score: 90, label: "金质原型板", color: "#FFD700" },
      { score: 80, label: "银质原型板", color: "#C0C0C0" },
      { score: 70, label: "铜质原型板", color: "#CD7F32" },
    ],
  },
  research_lens: {
    id: "research_lens",
    name: "研究透镜",
    emoji: "🔍",
    skillName: "用户研究",
    skillKey: "用户研究",
    description: "代表你的用户研究能力，包括访谈、调研和用户洞察",
    threshold: 70,
    tiers: [
      { score: 90, label: "金质透镜", color: "#FFD700" },
      { score: 80, label: "银质透镜", color: "#C0C0C0" },
      { score: 70, label: "铜质透镜", color: "#CD7F32" },
    ],
  },
};

/**
 * 根据已解锁装备和技能数据，生成装备说明列表
 */
export interface EquipmentExplanation {
  skillName: string;
  score: number;
  grade: string;
  gradeColor: string;
  equipmentName: string;
  equipmentEmoji: string;
  equipmentDesc: string;
  isWeakness: boolean;  // 灰色 = 短板
  tierLabel: string;
}

export function buildEquipmentExplanations(
  skills: Record<string, number>,
  unlockedEquips: string[],
): EquipmentExplanation[] {
  const results: EquipmentExplanation[] = [];

  for (const equip of Object.values(EQUIPMENT_MAP)) {
    const score = skills[equip.skillKey] || 50;
    let grade: string;
    let gradeColor: string;
    if (score >= 90) { grade = "S"; gradeColor = "#FFD700"; }
    else if (score >= 85) { grade = "A+"; gradeColor = "#C0C0C0"; }
    else if (score >= 78) { grade = "A"; gradeColor = "#C0C0C0"; }
    else if (score >= 70) { grade = "B+"; gradeColor = "#CD7F32"; }
    else if (score >= 60) { grade = "B"; gradeColor = "#808080"; }
    else { grade = "C"; gradeColor = "#808080"; }

    const isWeakness = score < 70;
    const matchedTier = [...equip.tiers].reverse().find(t => score >= t.score);
    const tierLabel = matchedTier ? matchedTier.label : "基础装备";

    // Check if unlocked
    const hasUnlocked = unlockedEquips.some(eq =>
      eq.includes(equip.id.replace("_", "")) || eq === `${tierLabel.includes("金") ? "golden" : tierLabel.includes("银") ? "silver" : "bronze"}_${equip.id}`
    );

    results.push({
      skillName: equip.skillName,
      score,
      grade,
      gradeColor: isWeakness ? "#808080" : gradeColor,
      equipmentName: hasUnlocked ? tierLabel : equip.name,
      equipmentEmoji: equip.emoji,
      equipmentDesc: equip.description,
      isWeakness,
      tierLabel: hasUnlocked ? tierLabel : "未解锁",
    });
  }

  return results;
}
