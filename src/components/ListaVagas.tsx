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

// Traduz as modalidades do banco para textos da interface.
const nomesModalidade: Record<string, string> = {
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
  PRESENCIAL: "Presencial",
};

// Cores das etiquetas de status (claro e escuro).
const coresStatus: Record<string, string> = {
  SALVA: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  CANDIDATEI: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  PROCESSO:
    "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  ENTREVISTA:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  APROVADO:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  REJEITADO: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

// Classes compartilhadas pelos campos de busca e filtro.
const campo =
  "w-full rounded-lg border border-line bg-surface px-4 py-2 text-foreground " +
  "placeholder:text-muted outline-none focus:ring-2 focus:ring-primary";

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
        statusSelecionado === "TODOS" || vaga.status === statusSelecionado;

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
      <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="busca-vaga"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Buscar empresa ou cargo
          </label>

          <input
            id="busca-vaga"
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Ex.: Java, Solinftec..."
            className={campo}
          />
        </div>

        <div>
          <label
            htmlFor="filtro-status"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Filtrar por status
          </label>

          <select
            id="filtro-status"
            value={statusSelecionado}
            onChange={(event) => setStatusSelecionado(event.target.value)}
            className={campo}
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
          <p className="text-sm text-muted">
            Exibindo <strong className="text-foreground">{vagasFiltradas.length}</strong>{" "}
            de <strong className="text-foreground">{vagas.length}</strong>{" "}
            {vagas.length === 1 ? "vaga" : "vagas"}
          </p>

          <button
            type="button"
            onClick={limparFiltros}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {vagas.length === 0 ? (
        // Mensagem quando não há vagas cadastradas
        <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Nenhuma vaga cadastrada
          </h2>

          <p className="mt-2 text-muted">
            Cadastre sua primeira oportunidade para começar a acompanhar
            suas candidaturas.
          </p>

          <Link
            href="/vagas/nova"
            className="mt-5 inline-block rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Cadastrar primeira vaga
          </Link>
        </div>
      ) : vagasFiltradas.length === 0 ? (
        // Mensagem quando os filtros não encontram resultados
        <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center">
          <h2 className="font-semibold text-foreground">
            Nenhuma vaga encontrada
          </h2>

          <p className="mt-2 text-sm text-muted">
            Tente alterar o texto da busca ou selecionar outro status.
          </p>
        </div>
      ) : (
        // Cartões das vagas filtradas
        <div className="grid grid-cols-1 gap-4">
          {vagasFiltradas.map((vaga) => (
            <article
              key={vaga.id}
              className="flex min-w-0 flex-col rounded-2xl border border-line bg-surface p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
            >
              {/* Cabeçalho: cargo, empresa e status */}
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-lg font-semibold leading-snug text-foreground">
                    {vaga.cargo}
                  </h2>

                  <p className="mt-1 break-words text-sm font-medium text-muted">
                    {vaga.empresa}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    coresStatus[vaga.status] ?? coresStatus.SALVA
                  }`}
                >
                  {nomesStatus[vaga.status] ?? vaga.status}
                </span>
              </div>

              {/* Informações em grade para manter o alinhamento */}
              <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-2 xl:grid-cols-3">
                {vaga.modalidade && (
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted">
                      Modalidade
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-foreground">
                      {nomesModalidade[vaga.modalidade] ?? vaga.modalidade}
                    </p>
                  </div>
                )}

                {vaga.localizacao && (
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted">
                      Localização
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-foreground">
                      {vaga.localizacao}
                    </p>
                  </div>
                )}

                {vaga.salario && (
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted">Salário</p>
                    <p className="mt-1 break-words text-sm font-medium text-foreground">
                      {vaga.salario}
                    </p>
                  </div>
                )}

                {vaga.data_candidatura && (
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted">
                      Data da candidatura
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {new Date(
                        `${vaga.data_candidatura}T12:00:00`
                      ).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted">
                    Data de cadastro
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              {/* Ações: todos os botões com a mesma altura e alinhados */}
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <Link
                  href={`/vagas/${vaga.id}/editar`}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Editar vaga
                </Link>

                {vaga.url && (
                  <a
                    href={vaga.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-foreground transition hover:bg-surface-hover"
                  >
                    Abrir anúncio
                  </a>
                )}

                {/* Empurra o botão de excluir para a direita e padroniza o botão interno */}
                <div className="ml-auto">
                  <ExcluirVagaButton id={vaga.id} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}