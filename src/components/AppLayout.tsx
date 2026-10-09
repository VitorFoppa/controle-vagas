
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  // Controla a abertura do menu lateral em telas pequenas.
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Menu lateral e fundo escurecido para dispositivos móveis. */}
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] md:hidden"
        />
      )}

      <Sidebar
        aberto={menuAberto}
        aoNavegar={() => setMenuAberto(false)}
      />

      {/* Área principal: ocupa todo o espaço restante. */}
      <div className="min-h-screen min-w-0 md:pl-64">
        <Header onMenuClick={() => setMenuAberto(true)} />

        {/* Área útil responsiva das páginas. */}
        <main className="mx-auto w-full max-w-[1600px] min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}