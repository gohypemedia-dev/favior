"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Heart, Star, RotateCcw, Settings, LifeBuoy } from "lucide-react";
import LogoutButton from "./logout-button";

export default function ProfileSidebarClient({ userName, userEmail }: { userName: string, userEmail: string }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/profile", label: "Overview", icon: User },
    { href: "/profile/orders", label: "My Orders", icon: Package },
    { href: "/profile/wishlist", label: "Wishlist", icon: Heart },
    { href: "/profile/reviews", label: "Reviews & Ratings", icon: Star },
    { href: "/profile/addresses", label: "Addresses", icon: MapPin },
    { href: "/profile/settings", label: "Profile & Settings", icon: Settings },
    { href: "/profile/support", label: "Help & Support", icon: LifeBuoy },
  ];

  return (
    <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", gap: "32px", minWidth: "250px" }}>
      
      {/* User Info */}
      <div>
        <p style={{ fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", color: "#18181b", margin: "0 0 4px 0", letterSpacing: "0.05em" }}>
          {userName}
        </p>
        <p style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>{userEmail}</p>
      </div>

      {/* Navigation Menu */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "12px",
                fontWeight: isActive ? "bold" : "500",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: isActive ? "#000" : "#71717a",
                textDecoration: "none",
                transition: "color 0.2s ease"
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div style={{ paddingTop: "24px", borderTop: "1px solid #f4f4f5" }}>
         <LogoutButton />
      </div>
    </div>
  );
}
