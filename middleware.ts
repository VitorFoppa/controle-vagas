// Middleware principal da aplicação.
//
// Ele executa a atualização da sessão Supabase
// antes das requisições chegarem às páginas.

import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Executa a atualização da sessão.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Define quais rotas devem passar pelo middleware.
//
// Arquivos estáticos, imagens e recursos internos
// do Next.js ficam de fora.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};