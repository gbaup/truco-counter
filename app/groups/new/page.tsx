import { redirect } from "next/navigation";
import NewGroupForm from "./NewGroupForm";

export default function NewGroupPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_GROUP_CREATION === "false") {
    redirect("/onboarding/choose");
  }
  return <NewGroupForm />;
}
