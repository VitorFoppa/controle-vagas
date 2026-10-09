// Cliente Supabase utilizado no servidor.
//
// Ele permite que Server Components do Next.js
// acessem o Supabase mantendo a sessão do usuário.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cria um cliente Supabase para utilização
// dentro de Server Components.
export async function createClient() {
  // Obtém os cookies da requisição atual.
  const cookieStore = await cookies();

  // Cria o cliente Supabase utilizando
  // a sessão armazenada nos cookies.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Retorna todos os cookies disponíveis.
        getAll() {
          return cookieStore.getAll();
        },

        // Atualiza os cookies quando necessário.
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              }
            );
          } catch {
            // Em alguns Server Components os cookies
            // não podem ser modificados diretamente.
            //
            // O middleware cuidará da atualização
            // da sessão nesses casos.
          }
        },
      },
    }
  );
}