// Página inicial da aplicação.
//
// Neste momento direcionamos o usuário para o dashboard.
// Posteriormente poderemos alterar esse comportamento
// para direcionar usuários não autenticados para /login.

import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona "/" para "/dashboard".
  redirect("/dashboard");
}