// Função responsável por criar o cliente Supabase
// durante a execução do middleware do Next.js.
//
// O middleware ajuda a manter a sessão do usuário
// atualizada através dos cookies.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Cria o cliente Supabase para o middleware.
export async function updateSession(request: NextRequest) {
  // Cria uma resposta padrão mantendo
  // os headers da requisição original.
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Cria o cliente Supabase utilizando
  // os cookies da requisição.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Retorna os cookies atuais.
        getAll() {
          return request.cookies.getAll();
        },

        // Atualiza os cookies da sessão.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          // Cria uma nova resposta mantendo
          // os cookies atualizados.
          supabaseResponse = NextResponse.next({
            request,
          });

          // Copia os cookies para a resposta.
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  // Consulta o usuário atual para garantir
  // que a sessão esteja atualizada.
  await supabase.auth.getUser();

  return supabaseResponse;
}