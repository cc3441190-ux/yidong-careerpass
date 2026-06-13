import { useState } from "react";
import { showToast } from "./Toast";
import { getGuestId } from "../utils/guestId";

interface LoginScreenProps {
  onLogin: (guestId: string) => void;
  onBack: () => void;
}

export function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);

  // 一键体验登录：为每台设备分配唯一访客 ID
  const handleOneClickLogin = () => {
    const guestId = getGuestId();
    showToast(`正在进入您的专属体验空间...`, "success");
    setTimeout(() => onLogin(guestId), 600);
  };

  const handleSubmit = () => {
    if (phone.length === 11 && (mode === "login" ? code.length === 6 : true)) {
      const guestId = getGuestId();
      showToast("登录成功！正在跳转...", "success");
      setTimeout(() => onLogin(guestId), 800);
    } else {
      showToast("请填写完整信息", "error");
    }
  };

  return (
    <div style={{ flex:1, display: "flex", flexDirection: "column", background: "#FAF9F6" }}>
      {/* Header */}
      <div style={{
        background: "#1A1A1A",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "relative",
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
          {mode === "login" ? "登录" : "注册"}
        </span>
      </div>

      {/* Form */}
      <div style={{ flex:1, display: "flex", flexDirection: "column", padding: "40px 24px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            border: "2px solid #FF4D00",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "20px", fontWeight: 700, color: "#FF4D00" }}>CP</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", fontWeight: 700, color: "#1A1A1A", letterSpacing: "0.15em" }}>
            CareerPass
          </div>
        </div>

        {/* Phone input */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "11px", color: "#8C8C8C", marginBottom: "6px", display: "block" }}>
            手机号
          </label>
          <div style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            padding: "0 12px",
            height: "44px",
            display: "flex",
            alignItems: "center",
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#8C8C8C", marginRight: "8px" }}>+86</span>
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "13px",
                color: "#1A1A1A",
                background: "transparent",
              }}
            />
          </div>
        </div>

        {/* Code input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "11px", color: "#8C8C8C", marginBottom: "6px", display: "block" }}>
            验证码
          </label>
          <div style={{
            background: "#FFFFFF",
            border: "2px solid #1A1A1A",
            borderRadius: "6px",
            padding: "0 12px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <input
              type="tel"
              placeholder="请输入验证码"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "13px",
                color: "#1A1A1A",
                background: "transparent",
              }}
            />
            <button
              onClick={() => setSent(true)}
              disabled={phone.length !== 11}
              style={{
                background: sent ? "none" : "#1A1A1A",
                border: sent ? "1.5px solid #1A1A1A" : "none",
                borderRadius: "4px",
                padding: "4px 10px",
                cursor: phone.length !== 11 ? "not-allowed" : "pointer",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                fontWeight: 700,
                color: sent ? "#8C8C8C" : "#FAF9F6",
                whiteSpace: "nowrap",
                opacity: phone.length !== 11 ? 0.4 : 1,
              }}
            >
              {sent ? "60s后重发" : "获取验证码"}
            </button>
          </div>
        </div>

        {/* One-click login button */}
        <button
          onClick={handleOneClickLogin}
          style={{
            width: "100%",
            height: "44px",
            background: "#1A1A1A",
            border: "2px solid #1A1A1A",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #FF4D00",
            color: "#FAF9F6",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: "pointer",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.093 5.618c-.9.36-.9 1.618 0 1.978L13 11.5V2z" fill="#FAF9F6"/>
            <path d="M13 11.5v9.5c0 .97-.78 1.79-1.75 1.93-1.2.18-2.35-.64-2.51-1.84-.2-1.4.87-2.63 2.26-2.63H11v-2h-.5c-2.48 0-4.5 2.02-4.5 4.5 0 2.48 2.02 4.5 4.5 4.5h6c2.48 0 4.5-2.02 4.5-4.5V11.5h-3.5z" fill="#FAF9F6"/>
          </svg>
          一键体验登录
        </button>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            height: "48px",
            background: phone.length === 11 && (mode === "login" ? code.length === 6 : true) ? "#FF4D00" : "#E5E5E5",
            border: "2px solid #1A1A1A",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A",
            color: phone.length === 11 && (mode === "login" ? code.length === 6 : true) ? "#FAF9F6" : "#8C8C8C",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: "pointer",
            marginBottom: "16px",
            transition: "background-color 0.2s",
          }}
        >
          {mode === "login" ? "登录" : "注册"}
        </button>

        {/* Switch mode */}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "11px", color: "#8C8C8C" }}>
            {mode === "login" ? "还没有账号？" : "已有账号？"}
          </span>
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setCode("");
              setSent(false);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'PingFang SC', sans-serif",
              fontSize: "11px",
              color: "#FF4D00",
              fontWeight: 700,
              marginLeft: "4px",
            }}
          >
            {mode === "login" ? "立即注册" : "去登录"}
          </button>
        </div>

        {/* Wechat login */}
        <div style={{ flex:1, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'PingFang SC', sans-serif", fontSize: "10px", color: "#8C8C8C", marginBottom: "12px" }}>— 其他登录方式 —</div>
            <button style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#07C160",
              border: "2px solid #1A1A1A",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08), 2px 2px 0px #1A1A1A",
            }}>
              <span style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 700 }}>W</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
