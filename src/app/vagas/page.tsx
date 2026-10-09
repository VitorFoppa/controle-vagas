// Página responsável por listar as vagas cadastradas.
//
// Nesta etapa ainda não temos banco de dados,
// portanto a lista está vazia.

import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { exigirUsuario } from "@/utils/supabase/proteger-rota";

export default function VagasPage() {
  return (
    <AppLayout>
      <Suspense fallback={<p className="text-gray-500">Carregando...</p>}>
        <ConteudoVagas />
      </Suspense>
    </AppLayout>
  );
}

async function ConteudoVagas() {
  await connection();
  await exigirUsuario();

  return (
    <>
      {/* Cabeçalho da página */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas vagas</h1>
          <p className="mt-1 text-gray-600">
            Gerencie suas oportunidades de emprego.
          </p>
        </div>

        {/* Botão para cadastrar nova vaga */}
        <Link
          href="/vagas/nova"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Nova vaga
        </Link>
      </div>

      {/* Estado inicial quando ainda não existem vagas */}
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold">Nenhuma vaga cadastrada</h2>

        <p className="mt-2 text-gray-500">
          Cadastre sua primeira vaga para começar.
        </p>

        <Link
          href="/vagas/nova"
          className="mt-5 inline-block rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Cadastrar primeira vaga
        </Link>
      </div>
    </>
  );
}