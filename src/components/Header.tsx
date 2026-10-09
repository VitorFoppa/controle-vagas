// Componente responsável pelo cabeçalho
// das páginas internas da aplicação.

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      {/* Título da página atual */}
      <div>
        <h2 className="text-lg font-semibold">
          Controle de Vagas
        </h2>
      </div>

      {/* Informações do usuário */}
      <div className="flex items-center gap-3">

        {/* Nome temporário do usuário.
            O login será implementado posteriormente. */}
        <span className="text-sm text-gray-600">
          Usuário
        </span>

        {/* Avatar temporário */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
          👤
        </div>

      </div>
    </header>
  );
}