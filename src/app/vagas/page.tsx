import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import ListaVagas from "@/components/ListaVagas";
import { exigirUsuario } from "@/utils/supabase/proteger-rota";
import { createClient } from "@/utils/supabase/server";

// Página principal da listagem de vagas.
export default function VagasPage() {
  return (
    <AppLayout>
      <Suspense
        fallback={<p className="text-gray-500">Carregando vagas...</p>}
      >
        <ConteudoVagas />
      </Suspense>
    </AppLayout>
  );
}

// Autentica o usuário e busca suas vagas no banco.
async function ConteudoVagas() {
  // Compatibilidade com Cache Components do Next.js.
  await connection();

  // Redireciona para o login se não houver sessão válida.
  await exigirUsuario();

  const supabase = await createClient();

  // Consulta as vagas mais recentes.
  const { data: vagas, error } = await supabase
    .from("vagas")
    .select(
      "id, empresa, cargo, modalidade, localizacao, salario, url, status, created_at, data_candidatura"
    )
    .order("created_at", { ascending: false });

  // Trata erros da consulta sem mostrar uma lista enganosa.
  if (error) {
    console.error("Erro ao consultar vagas:", error);

    return (
      <main>
        <h1 className="text-2xl font-bold text-gray-900">
          Minhas vagas
        </h1>

        <p role="alert" className="mt-4 text-red-600">
          Não foi possível carregar as vagas. Confira o terminal do Next.js.
        </p>
      </main>
    );
  }

  return (
    <main>
      {/* Cabeçalho da página */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Minhas vagas
          </h1>

          <p className="mt-1 text-gray-600">
            Pesquise, filtre e gerencie suas oportunidades.
          </p>
        </div>

        <Link
          href="/vagas/nova"
          className="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800"
        >
          + Nova vaga
        </Link>
      </div>

      {/* Busca, filtros e cartões */}
      <ListaVagas
        vagas={(vagas ?? []).map((vaga) => ({
          ...vaga,
          id: Number(vaga.id),
        }))}
      />
    </main>
  );
}