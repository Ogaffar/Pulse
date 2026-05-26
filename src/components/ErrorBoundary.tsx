import React from "react";

interface State { hasError: boolean }

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("App error boundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "#FAFAF8", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>⚡</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A18", marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ fontSize: 14, color: "#6B6B65", maxWidth: 360, marginBottom: 20, lineHeight: 1.6 }}>
            Pulse hit an unexpected error. Your data is safe.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
            style={{ background: "#1A6B4A", color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Return to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
