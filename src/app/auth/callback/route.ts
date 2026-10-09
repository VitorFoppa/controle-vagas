
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Confirma a sessão após o usuário clicar no link
// recebido por e-mail.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // Aceita somente caminhos locais para o redirecionamento.
  const destinoSolicitado = url.searchParams.get("next");
  const destino =
    destinoSolicitado?.startsWith("/") &&
    !destinoSolicitado.startsWith("//")
      ? destinoSolicitado
      : "/dashboard";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(destino, url.origin));
    }
  }

  // Se o código estiver ausente ou inválido,
  // direciona para o login com uma mensagem.
  return NextResponse.redirect(
    new URL("/login?erro=confirmacao", url.origin)
  );
}