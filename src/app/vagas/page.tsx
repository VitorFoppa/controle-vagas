import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { exigirUsuario } from "@/utils/supabase/proteger-rota";
import { createClient } from "@/utils/supabase/server";
import ExcluirVagaButton from "@/components/ExcluirVagaButton";

// Página principal da lista de vagas.
export default function VagasPage() {
return ( <AppLayout>
<Suspense
fallback={<p className="text-gray-500">Carregando vagas...</p>}
> <ConteudoVagas /> </Suspense> </AppLayout>
);
}

// Busca no banco e exibe somente as vagas do usuário autenticado.
async function ConteudoVagas() {
// Permite que esta parte utilize dados da requisição atual.
await connection();

// Verifica se o usuário está autenticado.
await exigirUsuario();

// Cria o cliente Supabase do servidor.
const supabase = await createClient();

// Busca as vagas mais recentes primeiro.
// As políticas RLS limitam os registros ao usuário autenticado.
const { data: vagas, error } = await supabase
.from("vagas")
.select(
"id, empresa, cargo, modalidade, localizacao, salario, url, status, created_at"
)
.order("created_at", { ascending: false });

// Registra o erro no terminal para facilitar o diagnóstico.
if (error) {
console.error("Erro ao consultar vagas:", error);
}

// Converte os códigos internos em textos para a interface.
const nomesStatus: Record<string, string> = {
SALVA: "Salva",
CANDIDATEI: "Candidatei",
PROCESSO: "Processo seletivo",
ENTREVISTA: "Entrevista",
APROVADO: "Aprovado",
REJEITADO: "Rejeitado",
};

return ( <main>
{/* Cabeçalho da página */} <div className="mb-6 flex flex-wrap items-center justify-between gap-4"> <div> <h1 className="text-2xl font-bold text-gray-900">
Minhas vagas </h1>

      <p className="mt-1 text-gray-600">
        Acompanhe as oportunidades e suas candidaturas.
      </p>
    </div>

    <Link
      href="/vagas/nova"
      className="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800"
    >
      + Nova vaga
    </Link>
  </div>

  {/* Mensagem de erro da consulta */}
  {error ? (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
      <h2 className="font-semibold">
        Não foi possível carregar as vagas.
      </h2>

      <p className="mt-1 text-sm">
        Verifique o terminal onde o Next.js está executando para
        consultar o erro detalhado.
      </p>
    </div>
  ) : !vagas || vagas.length === 0 ? (
    /* Estado exibido quando ainda não existem vagas */
    <div className="rounded-xl border border-dashed bg-white p-10 text-center">
      <h2 className="text-lg font-semibold text-gray-900">
        Nenhuma vaga cadastrada
      </h2>

      <p className="mt-2 text-gray-600">
        Suas vagas cadastradas aparecerão aqui.
      </p>

      <Link
        href="/vagas/nova"
        className="mt-5 inline-block rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800"
      >
        Cadastrar primeira vaga
      </Link>
    </div>
  ) : (
    /* Lista de vagas retornadas pelo Supabase */
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {vagas.length}{" "}
        {vagas.length === 1
          ? "vaga cadastrada"
          : "vagas cadastradas"}
      </p>

      {vagas.map((vaga) => (
        <article
          key={vaga.id}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {vaga.cargo}
              </h2>

              <p className="mt-1 font-medium text-gray-700">
                {vaga.empresa}
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {nomesStatus[vaga.status] ?? vaga.status}
            </span>
          </div>

          {/* Informações complementares */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
            {vaga.modalidade && (
              <span>
                Modalidade: {vaga.modalidade}
              </span>
            )}

            {vaga.localizacao && (
              <span>
                Localização: {vaga.localizacao}
              </span>
            )}

            {vaga.salario && (
              <span>
                Salário: {vaga.salario}
              </span>
            )}

            <span>
              Cadastrada em:{" "}
              {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>

          {/* Link externo para a oportunidade, quando informado */}
          {vaga.url && (
            <div className="mt-4 border-t pt-4">
              <a
                href={vaga.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-700 underline hover:text-blue-900"
              >
                Abrir anúncio da vaga
              </a>
            </div>
          )}

          {/* Ação para excluir a vaga */}
          <ExcluirVagaButton id={Number(vaga.id)} />
        </article>
      ))}
    </div>
  )}
</main>


);
}
