import { getCurrentUser } from "@/lib/server/dal/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AddressManager from "../address-manager";
import { MapPin } from "lucide-react";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }]
  });

  return (
    <>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 32px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <MapPin size={20} /> Saved Addresses
      </h2>
      <AddressManager addresses={addresses} />
    </>
  );
}
