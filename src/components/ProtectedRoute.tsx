import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthed = typeof window !== "undefined" && localStorage.getItem("pulse_authed") === "true";
  if (!isAuthed) return <Navigate to="/signin" replace />;
  return children;
}
