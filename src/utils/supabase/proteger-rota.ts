
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Verifica se existe um usuário autenticado.
// Se não existir, redireciona para a tela de login.
export async function exigirUsuario() {
  const supabase = await createClient();

  // Verifica a sessão no servidor.
  // getUser() valida o usuário com o Supabase Auth.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Não permite continuar sem uma sessão válida.
  if (error || !user) {
    redirect("/login");
  }

  // Devolve os dados do usuário autenticado.
  return user;
}