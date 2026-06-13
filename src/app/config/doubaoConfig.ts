// 豆包 (Doubao) 文生图 API 配置
// ⚠️ 重要：请到火山引擎控制台开通「图片生成」类模型
// 控制台地址：https://console.volcengine.com/ark/region:ark+cn-beijing/model

export const DOUBAO_CONFIG = {
  // 主模型
  primary: {
    apiKey: "ark-74702aa2-deae-407d-99c7-2cc0d976b393-685fe",
    // 以下是火山引擎支持图片生成的模型名称（请确认哪个可用）
    model: "doubao-seedream-4-5-251128",
    size: "2048x2048",
  },
  // 备用模型
  fallback: {
    apiKey: "ark-50728577-e236-447a-b22f-3aa6b1c2c5a5-50b89",
    model: "doubao-seedream-4-5-251128",
    size: "2048x2048",
  },
  // 火山引擎 OpenAI 兼容端点
  baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
};

function isKeyValid(key: string): boolean {
  return key !== "" && !key.startsWith("YOUR_");
}

export function isDoubaoConfigured(): boolean {
  return isKeyValid(DOUBAO_CONFIG.primary.apiKey) || isKeyValid(DOUBAO_CONFIG.fallback.apiKey);
}

