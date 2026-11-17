import { getCurrentUser } from "@/lib/server/dal/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileSidebarClient from "./profile-sidebar-client";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "1024px", margin: "64px auto 0", width: "100%", padding: "48px 24px", boxSizing: "border-box" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", marginBottom: "48px" }}>
          My Account
        </h1>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "48px" }}>
          
          {/* Sidebar */}
          <ProfileSidebarClient userName={user.name || "Customer"} userEmail={user.email} />

          {/* Main Content Area */}
          <div style={{ flex: "3 1 500px", display: "flex", flexDirection: "column", gap: "24px", minWidth: "300px" }}>
            {children}
          </div>
          
        </div>
      </main>
    </div>
  );
}
