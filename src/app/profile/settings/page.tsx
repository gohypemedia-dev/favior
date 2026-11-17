import { getCurrentUser } from "@/lib/server/dal/auth";
import { redirect } from "next/navigation";
import ProfileForm from "../profile-form";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 32px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <Settings size={20} /> Profile & Settings
      </h2>
      <ProfileForm user={user} />
    </>
  );
}
