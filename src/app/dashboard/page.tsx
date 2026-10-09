// Página inicial do dashboard.
//
// Por enquanto estamos utilizando apenas
// dados fictícios para construir a interface.
// Os números reais virão do banco de dados
// em uma etapa posterior.

import AppLayout from "@/components/AppLayout";

export default function DashboardPage() {
  return (
    <AppLayout>

      {/* Título da página */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-600">
          Resumo das suas candidaturas.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Total de vagas */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total de vagas
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        {/* Candidaturas enviadas */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Candidaturas
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        {/* Processos seletivos */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Em processo
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        {/* Entrevistas */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Entrevistas
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

      </div>

      {/* Área que posteriormente receberá gráficos */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold">
          Atividade das candidaturas
        </h2>

        <p className="mt-2 text-gray-500">
          Os gráficos serão adicionados posteriormente.
        </p>

      </div>

    </AppLayout>
  );
}