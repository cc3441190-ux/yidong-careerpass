import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "#4CAF50" : type === "error" ? "#F44336" : "#1A1A1A";

  return (
    <div
      style={{
        background: bgColor,
        color: "#FAF9F6",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "10px",
        fontWeight: 700,
        padding: "8px 16px",
        border: "2px solid #1A1A1A",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08), 3px 3px 0px #1A1A1A",
        borderRadius: "6px",
        animation: "toastIn 0.3s ease-out both",
        maxWidth: "260px",
        textAlign: "center",
        lineHeight: 1.5,
        wordBreak: "break-word",
      }}
    >
      {message}
    </div>
  );
}

// Toast manager
let toastId = 0;
const listeners = new Set<(toast: ToastItem | null) => void>();

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

function notify(toast: ToastItem | null) {
  listeners.forEach(fn => fn(toast));
}

export function showToast(message: string, type: "success" | "error" | "info" = "info") {
  const id = ++toastId;
  notify({ id, message, type });
  setTimeout(() => notify(null), 3000);
}

export function ToastContainer() {
  const [toast, setToast] = useState<ToastItem | null>(null);

  useEffect(() => {
    const handler = (newToast: ToastItem | null) => setToast(newToast);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    >
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => notify(null)}
      />
    </div>
  );
}
