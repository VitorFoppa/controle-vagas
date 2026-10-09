
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, UserRound } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Usuario = {
  nome: string;
  email: string;
};

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);
  const [erroSaida, setErroSaida] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let ativo = true;

    async function carregarUsuario() {
      const { data, error } = await supabase.auth.getUser();

      if (!ativo) return;

      if (error) {
        console.error("Erro ao buscar usuário:", error.message);
      }

      const user = data.user;

      if (user) {
        const nomeMetadata =
          user.user_metadata?.nome ?? user.user_metadata?.name;

        setUsuario({
          nome:
            typeof nomeMetadata === "string" && nomeMetadata.trim()
              ? nomeMetadata.trim()
              : user.email ?? "Usuário",
          email: user.email ?? "",
        });
      } else {
        setUsuario(null);
      }

      setCarregando(false);
    }

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  // Encerra a sessão no Supabase e volta para a tela de login.
  async function sair() {
    if (saindo) return;

    setSaindo(true);
    setErroSaida("");

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao sair:", error.message);
      setErroSaida("Não foi possível sair. Tente novamente.");
      setSaindo(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  const inicial = usuario?.nome.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {/* Visível somente em telas menores que desktop. */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu de navegação"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            Controle de Vagas
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Organize sua busca por oportunidades
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {carregando ? (
          <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
        ) : usuario ? (
          <>
            {/* Informações da conta: ocultadas em telas muito pequenas. */}
            <div className="hidden min-w-0 text-right sm:block">
              <p className="max-w-48 truncate text-sm font-medium text-slate-800">
                {usuario.nome}
              </p>
              <p className="max-w-48 truncate text-xs text-slate-500">
                {usuario.email}
              </p>
            </div>

            <div
              aria-label={`Usuário: ${usuario.nome}`}
              title={usuario.nome}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700 ring-1 ring-blue-100"
            >
              {inicial || <UserRound size={18} />}
            </div>

            <button
              type="button"
              onClick={sair}
              disabled={saindo}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">
                {saindo ? "Saindo..." : "Sair"}
              </span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Entrar
          </button>
        )}
      </div>

      {/* Mensagem de erro de saída, quando necessário. */}
      {erroSaida && (
        <p
          role="alert"
          className="absolute right-4 top-full mt-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-red-700 shadow-sm"
        >
          {erroSaida}
        </p>
      )}
    </header>
  );
}