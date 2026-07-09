import { createElement, useState } from "react";
import { loginWithEmail } from "@arrivio/firebase";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  background: "#F8FAFC",
  color: "#08183A"
};

const inputStyle = {
  width: "100%",
  maxWidth: "520px",
  padding: "13px",
  marginTop: "8px",
  marginBottom: "14px",
  border: "1px solid #D1D5DB",
  borderRadius: "12px"
};

const buttonStyle = {
  padding: "14px 18px",
  borderRadius: "999px",
  border: 0,
  background: "#0B63F6",
  color: "#FFFFFF",
  fontWeight: 700,
  cursor: "pointer"
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Sign in with your admin account.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin() {
    if (!email.trim() || !password.trim()) {
      setStatus("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithEmail(email.trim(), password);
      setStatus("Login successful. Opening admin dashboard...");
      window.location.href = "/";
    } catch (error) {
      setStatus("Login failed. Check email and password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "42px", margin: "0 0 12px" } }, "Admin Login"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, status),
    createElement("label", null, "Email"),
    createElement("input", { style: inputStyle, value: email, onChange: (event) => setEmail(event.currentTarget.value), placeholder: "admin@example.com" }),
    createElement("label", null, "Password"),
    createElement("input", { style: inputStyle, type: "password", value: password, onChange: (event) => setPassword(event.currentTarget.value), placeholder: "Password" }),
    createElement("br"),
    createElement("button", { type: "button", onClick: submitLogin, disabled: isSubmitting, style: buttonStyle }, isSubmitting ? "Signing in..." : "Sign In"),
    createElement("p", { style: { color: "#4B5563", marginTop: "18px" } }, "After login, admin role is read from users/{uid}.role and the admin dashboard opens automatically.")
  );
}
