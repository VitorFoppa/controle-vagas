// Componente responsável pela estrutura visual
// das páginas internas da aplicação.
//
// Ele recebe o conteúdo da página através
// da propriedade "children".

import Sidebar from "./Sidebar";
import Header from "./Header";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Menu lateral */}
      <Sidebar />

      {/* Área principal */}
      <div className="flex flex-1 flex-col">

        {/* Cabeçalho */}
        <Header />

        {/* Conteúdo específico da página */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}