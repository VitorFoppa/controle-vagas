
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Plus,
  X,
  ClipboardList,
} from "lucide-react";

type SidebarProps = {
  aberto?: boolean;
  aoNavegar?: () => void;
};

const links = [
  {
    nome: "Dashboard",
    href: "/dashboard",
    Icone: LayoutDashboard,
  },
  {
    nome: "Minhas vagas",
    href: "/vagas",
    Icone: BriefcaseBusiness,
  },
  {
    nome: "Nova vaga",
    href: "/vagas/nova",
    Icone: Plus,
  },
];

// Componente interno que utiliza o caminho atual da URL.
function SidebarConteudo({
  aberto,
  aoNavegar,
}: Required<Pick<SidebarProps, "aberto">> &
  Pick<SidebarProps, "aoNavegar">) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ${
        aberto ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Marca e botão para fechar o menu no celular. */}
      <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
        <Link
          href="/dashboard"
          onClick={aoNavegar}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <ClipboardList size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-slate-900">
              Controle de Vagas
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Painel de oportunidades
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={aoNavegar}
          aria-label="Fechar menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navegação principal. */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu principal
        </p>

        {links.map(({ nome, href, Icone }) => {
          const ativo =
            href === "/vagas"
              ? pathname === "/vagas" ||
                (pathname.startsWith("/vagas/") &&
                  pathname !== "/vagas/nova")
              : pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={aoNavegar}
              aria-current={ativo ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                ativo
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icone size={19} strokeWidth={1.9} />
              <span>{nome}</span>

              {ativo && (
                <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé do menu. */}
      <div className="border-t border-slate-100 p-4">
        <p className="text-center text-xs text-slate-400">
          Controle de Vagas
        </p>
      </div>
    </aside>
  );
}

// Exporta o menu com Suspense para tratar o usePathname().
export default function Sidebar({
  aberto = false,
  aoNavegar,
}: SidebarProps) {
  return (
    <Suspense
      fallback={
        <aside
          className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-200 bg-white md:flex"
          aria-hidden="true"
        />
      }
    >
      <SidebarConteudo
        aberto={aberto}
        aoNavegar={aoNavegar}
      />
    </Suspense>
  );
}

