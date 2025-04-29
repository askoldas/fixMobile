import AuthGuard from "@/hooks/AuthGuard";
import CustomAdminPanel from "./AdminPanel";

export default function AdminPage() {
  return (
    <AuthGuard>
      <CustomAdminPanel />
    </AuthGuard>
  );
}
