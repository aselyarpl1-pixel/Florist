/**
 * FILE: AuthProvider.tsx
 * KEGUNAAN: Pengelola status autentikasi (Login/Logout) di seluruh aplikasi.
 * File ini memantau apakah ada user yang sedang login dan mengecek apakah user tersebut adalah Admin.
 */
import { ReactNode, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State untuk menyimpan data user, sesi, dan status loading
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Menentukan apakah user yang login adalah admin

  // Fungsi untuk mengecek peran (role) user di database
  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    return !!data;
  };

  // Efek untuk memantau perubahan status login (Login, Logout, atau Token Refresh)
  useEffect(() => {
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(async (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Jika user login, cek apakah dia admin
        if (session?.user) {
          const admin = await checkAdminRole(session.user.id);
          setIsAdmin(admin);
        } else {
          setIsAdmin(false);
        }

        setIsLoading(false); // Selesai memuat status login
      });

    // Membersihkan subscription saat komponen tidak lagi digunakan
    return () => subscription.unsubscribe();
  }, []);

  return (
    // Membagikan data auth ke seluruh komponen aplikasi melalui Context API
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        // Fungsi untuk proses Login
        signIn: async (email, password) =>
          supabase.auth.signInWithPassword({ email, password }),
        // Fungsi untuk proses Register (jika diperlukan)
        signUp: async (email, password, fullName) =>
          supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
          }),
          // Fungsi untuk proses Logout
          signOut: async () => {
            await supabase.auth.signOut();
          },          
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
