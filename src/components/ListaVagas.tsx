"use client";

// Lista interativa de vagas com busca e filtro por status.

import { useMemo, useState } from "react";
import Link from "next/link";
import ExcluirVagaButton from "@/components/ExcluirVagaButton";

// Define os dados de cada vaga recebida do servidor.
type Vaga = {
  id: number;
  empresa: string;
  cargo: string;
  modalidade: string | null;
  localizacao: string | null;
  salario: string | null;
  url: string | null;
  status: string;
  created_at: string;
  data_candidatura: string | null;
};

// Traduz os status do banco para textos da interface.
const nomesStatus: Record<string, string> = {
  SALVA: "Salva",
  CANDIDATEI: "Candidatei",
  PROCESSO: "Processo seletivo",
  ENTREVISTA: "Entrevista",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

type ListaVagasProps = {
  vagas: Vaga[];
};

export default function ListaVagas({ vagas }: ListaVagasProps) {
  // Armazena o texto digitado e o status selecionado.
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("TODOS");

  // Filtra as vagas quando a busca ou o status mudar.
  const vagasFiltradas = useMemo(() => {
    const textoBusca = busca.trim().toLocaleLowerCase("pt-BR");

    return vagas.filter((vaga) => {
      const correspondeTexto =
        vaga.empresa.toLocaleLowerCase("pt-BR").includes(textoBusca) ||
        vaga.cargo.toLocaleLowerCase("pt-BR").includes(textoBusca);

      const correspondeStatus =
        statusSelecionado === "TODOS" ||
        vaga.status === statusSelecionado;

      return correspondeTexto && correspondeStatus;
    });
  }, [vagas, busca, statusSelecionado]);

  // Restaura os filtros para os valores iniciais.
  function limparFiltros() {
    setBusca("");
    setStatusSelecionado("TODOS");
  }

  return (
    <section>
      {/* Campos de pesquisa e filtragem */}
      <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="busca-vaga"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Buscar empresa ou cargo
          </label>

          <input
            id="busca-vaga"
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Ex.: Java, Solinftec..."
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <div>
          <label
            htmlFor="filtro-status"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Filtrar por status
          </label>

          <select
            id="filtro-status"
            value={statusSelecionado}
            onChange={(event) => setStatusSelecionado(event.target.value)}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="TODOS">Todos os status</option>
            <option value="SALVA">Salva</option>
            <option value="CANDIDATEI">Candidatei</option>
            <option value="PROCESSO">Processo seletivo</option>
            <option value="ENTREVISTA">Entrevista</option>
            <option value="APROVADO">Aprovado</option>
            <option value="REJEITADO">Rejeitado</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
          <p className="text-sm text-gray-600">
            Exibindo{" "}
            <strong>{vagasFiltradas.length}</strong>{" "}
            de <strong>{vagas.length}</strong>{" "}
            {vagas.length === 1 ? "vaga" : "vagas"}
          </p>

          <button
            type="button"
            onClick={limparFiltros}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Mensagem quando não há vagas cadastradas */}
      {vagas.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Nenhuma vaga cadastrada
          </h2>

          <p className="mt-2 text-gray-600">
            Cadastre sua primeira oportunidade para começar a acompanhar
            suas candidaturas.
          </p>

          <Link
            href="/vagas/nova"
            className="mt-5 inline-block rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800"
          >
            Cadastrar primeira vaga
          </Link>
        </div>
      ) : vagasFiltradas.length === 0 ? (
        /* Mensagem quando os filtros não encontram resultados */
        <div className="rounded-xl border border-dashed bg-white p-8 text-center">
          <h2 className="font-semibold text-gray-900">
            Nenhuma vaga encontrada
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Tente alterar o texto da busca ou selecionar outro status.
          </p>
        </div>
      ) : (
        /* Cartões das vagas filtradas */
        <div className="space-y-4">
          {vagasFiltradas.map((vaga) => (
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
                  <span>Modalidade: {vaga.modalidade}</span>
                )}

                {vaga.localizacao && (
                  <span>Localização: {vaga.localizacao}</span>
                )}

                {vaga.salario && <span>Salário: {vaga.salario}</span>}

                {/* Exibe a data da candidatura quando informada */}
                {vaga.data_candidatura && (
                <p className="mt-2 text-sm text-gray-500">
                    Candidatura:{" "}
                    {new Date(`${vaga.data_candidatura}T12:00:00`).toLocaleDateString(
                    "pt-BR"
                    )}
                </p>
                )}

                <span>
                  Cadastrada em:{" "}
                  {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>

              {/* Ações disponíveis para cada vaga */}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
                <Link
                  href={`/vagas/${vaga.id}/editar`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Editar vaga
                </Link>

                {vaga.url && (
                  <a
                    href={vaga.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-700 underline hover:text-blue-900"
                  >
                    Abrir anúncio
                  </a>
                )}

                <ExcluirVagaButton id={vaga.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}