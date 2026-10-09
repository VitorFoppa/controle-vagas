// Página inicial do dashboard.
//
// Por enquanto estamos utilizando apenas
// dados fictícios para construir a interface.
// Os números reais virão do banco de dados
// em uma etapa posterior.

import { Suspense } from "react";
import { connection } from "next/server";
import AppLayout from "@/components/AppLayout";
import { exigirUsuario } from "@/utils/supabase/proteger-rota";

const cards = [
  { titulo: "Total de vagas", valor: 0 },
  { titulo: "Candidaturas", valor: 0 },
  { titulo: "Em processo", valor: 0 },
  { titulo: "Entrevistas", valor: 0 },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      {/* Título da página (estático) */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-gray-600">Resumo das suas candidaturas.</p>
      </div>

      {/* Parte que depende do usuário logado (dinâmica) */}
      <Suspense fallback={<p className="text-gray-500">Carregando...</p>}>
        <ResumoDoUsuario />
      </Suspense>
    </AppLayout>
  );
}

async function ResumoDoUsuario() {
  // Marca este trecho como dinâmico (renderizado a cada requisição).
  // Deve vir antes de qualquer acesso à sessão.
  await connection();

  // Impede que visitantes não autenticados vejam o dashboard.
  await exigirUsuario();

  return (
    <>
      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.titulo}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.titulo}</p>
            <p className="mt-2 text-3xl font-bold">{card.valor}</p>
          </div>
        ))}
      </div>

      {/* Área que posteriormente receberá gráficos */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Atividade das candidaturas</h2>
        <p className="mt-2 text-gray-500">
          Os gráficos serão adicionados posteriormente.
        </p>
      </div>
    </>
  );
}