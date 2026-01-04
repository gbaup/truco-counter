"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { isLoading, error, handleLogin } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleLogin(username, password);
    if (success) {
      router.push("/");
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-zinc-900 dark:text-white">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 p-2 text-zinc-900 focus:border-primary-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 p-2 text-zinc-900 focus:border-primary-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              required
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="font-normal"
            disabled={isLoading}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
