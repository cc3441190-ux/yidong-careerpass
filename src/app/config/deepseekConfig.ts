// DeepSeek API 配置
// 使用前请填入你的 DeepSeek API Key

export const DEEPSEEK_CONFIG = {
  // 👇 在这里填入你的 DeepSeek API Key
  apiKey: "sk-9cf95edcfadf44f29835b7681010ed3d",
  // DeepSeek 模型名称（可选，默认 deepseek-chat）
  model: "deepseek-chat",
  baseUrl: "https://api.deepseek.com",
};

export function isDeepSeekConfigured(): boolean {
  const key = DEEPSEEK_CONFIG.apiKey;
  return key !== "" && key !== "YOUR_DEEPSEEK_API_KEY";
}
