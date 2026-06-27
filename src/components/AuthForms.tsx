"use client";

import { useState } from "react";

export function RegisterForm() {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password")
      })
    });
    const data = await res.json();
    setMessage(data.message ?? data.error);
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <input name="name" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password, 10+ characters" required />
      <button className="bg-cyan px-4 py-3 text-ink" type="submit">Create pending account</button>
      {message ? <p className="text-sm text-cyan">{message}</p> : null}
    </form>
  );
}

export function LoginForm() {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
    });
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem("best_unlocker_token", data.accessToken);
      setMessage(`Signed in as ${data.user.email}.`);
    } else {
      setMessage(data.error);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button className="bg-cyan px-4 py-3 text-ink" type="submit">Sign in</button>
      {message ? <p className="text-sm text-cyan">{message}</p> : null}
    </form>
  );
}
