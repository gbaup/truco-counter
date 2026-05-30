import { Suspense } from "react";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "false" && !token) {
    redirect("/login");
  }

  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
