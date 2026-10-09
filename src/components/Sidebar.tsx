// Componente responsável pelo menu lateral
// que será utilizado nas páginas internas
// da aplicação.

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r bg-white">
      
      {/* Nome da aplicação */}
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          Controle de Vagas
        </h1>
      </div>

      {/* Menu principal */}
      <nav className="flex-1 p-4">

        {/* Link para o dashboard */}
        <a
          href="/dashboard"
          className="mb-2 block rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          📊 Dashboard
        </a>

        {/* Link para a lista de vagas */}
        <a
          href="/vagas"
          className="mb-2 block rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          💼 Vagas
        </a>

        {/* Link para cadastrar uma nova vaga */}
        <a
          href="/vagas/nova"
          className="mb-2 block rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          ➕ Nova vaga
        </a>

        {/* Configurações será implementado posteriormente */}
        <a
          href="#"
          className="mb-2 block rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          ⚙ Configurações
        </a>

      </nav>

      {/* Área inferior do menu */}
      <div className="border-t p-4">

        {/* O logout será implementado na etapa de autenticação */}
        <button
          type="button"
          className="w-full rounded-lg px-4 py-3 text-left hover:bg-gray-100"
        >
          🚪 Sair
        </button>

      </div>
    </aside>
  );
}