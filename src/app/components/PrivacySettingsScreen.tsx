import { useState } from "react";

interface PrivacySettingsScreenProps {
  onBack: () => void;
}

export function PrivacySettingsScreen({ onBack }: PrivacySettingsScreenProps) {
  const [passVisible, setPassVisible] = useState(true);
  const [challengeVisible, setChallengeVisible] = useState(true);
  const [resumeVisible, setResumeVisible] = useState(false);
  const [allowRecruiters, setAllowRecruiters] = useState(true);
  const [allowAnalytics, setAllowAnalytics] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "44px",
        height: "24px",
        background: value ? "#FF4D00" : "#E5E5E5",
        border: "2px solid #1A1A1A",
        borderRadius: "12px",
        position: "relative",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        transition: "background-color 0.2s",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          background: "#FAF9F6",
          border: "1.5px solid #1A1A1A",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: value ? "22px" : "2px",
          transition: "left 0.2s",
        }}
      />
    </button>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAF9F6" }}>
      {/* Header */}
      <div style={{
        background: "#1A1A1A",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "relative",
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", alignItems: "center", gap: "6px",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M1 7L7 1M1 7L7 13" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", fontWeight: 700, color: "#FAF9F6", letterSpacing: "0.1em" }}>
            返回
          </span>
        </button>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          fontWeight: 700,
          color: "#FAF9F6",
          opacity: 0.45,
          letterSpacing: "0.15em",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          PRIVACY
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "20px 20px 0" }}>
        {/* 通行证可见性 */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "16px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 14px",
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1A1A1A",
            borderBottom: "1px solid #E5E5E5",
          }}>
            通行证可见性
          </div>
          {[
            { label: "向认证企业展示通行证", sub: "关闭后企业无法查看你的能力档案", value: passVisible, onChange: setPassVisible },
            { label: "展示挑战记录", sub: "向企业展示你的挑战成绩", value: challengeVisible, onChange: setChallengeVisible },
            { label: "向所有人公开简历", sub: "任何人可通过链接查看你的简历", value: resumeVisible, onChange: setResumeVisible },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderBottom: i < 2 ? "1px solid #F0F0F0" : "none",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  color: "#1A1A1A",
                  marginBottom: "2px",
                }}>{item.label}</div>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "9px",
                  color: "#8C8C8C",
                }}>{item.sub}</div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>

        {/* 数据共享 */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "16px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 14px",
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1A1A1A",
            borderBottom: "1px solid #E5E5E5",
          }}>
            数据共享
          </div>
          {[
            { label: "允许招聘方联系我", sub: "认证企业可向您发送面试邀请", value: allowRecruiters, onChange: setAllowRecruiters },
            { label: "允许匿名数据分析", sub: "帮助我们改进能力评估算法", value: allowAnalytics, onChange: setAllowAnalytics },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderBottom: i < 1 ? "1px solid #F0F0F0" : "none",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  color: "#1A1A1A",
                  marginBottom: "2px",
                }}>{item.label}</div>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "9px",
                  color: "#8C8C8C",
                }}>{item.sub}</div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>

        {/* 数据管理 */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A1A",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 3px 3px 0px #1A1A1A",
          marginBottom: "24px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 14px",
            fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1A1A1A",
            borderBottom: "1px solid #E5E5E5",
          }}>
            数据管理
          </div>
          {[
            { label: "下载我的数据", sub: "导出所有个人数据为 ZIP 文件" },
            { label: "删除账户", sub: "永久删除账户及所有数据，不可恢复", danger: true },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderBottom: i < 1 ? "1px solid #F0F0F0" : "none",
              cursor: "pointer",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "12px",
                  color: item.danger ? "#EF4444" : "#1A1A1A",
                  marginBottom: "2px",
                }}>{item.label}</div>
                <div style={{
                  fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  fontSize: "9px",
                  color: "#8C8C8C",
                }}>{item.sub}</div>
              </div>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                <path d="M1 1L7 6L1 11" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "8px",
          color: "#1A1A1A",
          opacity: 0.2,
          letterSpacing: "0.1em",
          marginBottom: "32px",
        }}>
          CAREERPASS PRIVACY v2.4.1
        </div>
      </div>
    </div>
  );
}
