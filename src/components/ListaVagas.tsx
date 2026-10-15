"use client";

// Lista interativa de vagas com busca, filtro, ordenação e paginação.

import { useMemo, useState } from "react";
import Link from "next/link";
import ExcluirVagaButton from "@/components/ExcluirVagaButton";
import AlterarStatusVaga from "@/components/AlterarStatusVaga";

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
  updated_at: string;
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

// Cores das etiquetas de status.
const coresStatus: Record<string, string> = {
  SALVA:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  CANDIDATEI:
    "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  PROCESSO:
    "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  ENTREVISTA:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  APROVADO:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  REJEITADO:
    "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

// Classes compartilhadas pelos campos de busca e filtro.
const campo =
  "w-full rounded-lg border border-line bg-surface px-4 py-2 text-foreground " +
  "placeholder:text-muted outline-none focus:ring-2 focus:ring-primary";

// Quantidade máxima de vagas exibidas por página.
const VAGAS_POR_PAGINA = 10;

type ListaVagasProps = {
  vagas: Vaga[];
};

export default function ListaVagas({ vagas }: ListaVagasProps) {
  // Armazena o texto digitado e o status selecionado.
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("TODOS");

  // Controla a página atual da paginação.
  const [paginaAtual, setPaginaAtual] = useState(1);

  /*
   * Filtra e ordena as vagas.
   *
   * Regra de ordenação:
   * 1. Vagas normais aparecem primeiro.
   * 2. Vagas rejeitadas aparecem no final.
   * 3. Dentro de cada grupo, a vaga alterada mais recentemente aparece primeiro.
   */
  const vagasFiltradas = useMemo(() => {
    const textoBusca = busca.trim().toLocaleLowerCase("pt-BR");

    const resultado = vagas.filter((vaga) => {
      const correspondeTexto =
        vaga.empresa.toLocaleLowerCase("pt-BR").includes(textoBusca) ||
        vaga.cargo.toLocaleLowerCase("pt-BR").includes(textoBusca);

      const correspondeStatus =
        statusSelecionado === "TODOS" ||
        vaga.status === statusSelecionado;

      return correspondeTexto && correspondeStatus;
    });

    // Cria uma cópia antes de ordenar para não alterar o array original.
    return [...resultado].sort((a, b) => {
      // Define se cada vaga é rejeitada.
      const aRejeitada = a.status === "REJEITADO";
      const bRejeitada = b.status === "REJEITADO";

      // Vagas normais vêm antes das rejeitadas.
      if (aRejeitada !== bRejeitada) {
        return aRejeitada ? 1 : -1;
      }

      // Dentro do mesmo grupo, mostra primeiro a mais recentemente alterada.
      return (
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
      );
    });
  }, [vagas, busca, statusSelecionado]);

  // Calcula a quantidade total de páginas.
  const totalPaginas = Math.ceil(
    vagasFiltradas.length / VAGAS_POR_PAGINA
  );

  /*
   * Seleciona somente as vagas pertencentes à página atual.
   *
   * Exemplo:
   * Página 1 → posições 0 a 9
   * Página 2 → posições 10 a 19
   * Página 3 → posições 20 a 29
   */
  const vagasPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * VAGAS_POR_PAGINA;
    const fim = inicio + VAGAS_POR_PAGINA;

    return vagasFiltradas.slice(inicio, fim);
  }, [vagasFiltradas, paginaAtual]);

  // Altera a página atual garantindo que ela fique dentro dos limites.
  function mudarPagina(novaPagina: number) {
    if (novaPagina < 1 || novaPagina > totalPaginas) {
      return;
    }

    setPaginaAtual(novaPagina);

    // Volta o usuário para o início da lista.
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Quando a busca é alterada, volta para a primeira página.
  function alterarBusca(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

  // Quando o status é alterado, volta para a primeira página.
  function alterarStatus(valor: string) {
    setStatusSelecionado(valor);
    setPaginaAtual(1);
  }

  // Restaura os filtros e volta para a primeira página.
  function limparFiltros() {
    setBusca("");
    setStatusSelecionado("TODOS");
    setPaginaAtual(1);
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
            onChange={(event) => alterarBusca(event.target.value)}
            placeholder="Ex.: Java..."
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
            onChange={(event) => alterarStatus(event.target.value)}
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
            Exibindo{" "}
            <strong className="text-foreground">
              {vagasFiltradas.length === 0
                ? 0
                : (paginaAtual - 1) * VAGAS_POR_PAGINA + 1}
              {vagasFiltradas.length > 0 &&
                `–${Math.min(
                  paginaAtual * VAGAS_POR_PAGINA,
                  vagasFiltradas.length
                )}`}
            </strong>{" "}
            de{" "}
            <strong className="text-foreground">
              {vagasFiltradas.length}
            </strong>{" "}
            {vagasFiltradas.length === 1 ? "vaga" : "vagas"}
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
        // Mensagem quando não há vagas cadastradas.
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
        // Mensagem quando os filtros não encontram resultados.
        <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center">
          <h2 className="font-semibold text-foreground">
            Nenhuma vaga encontrada
          </h2>

          <p className="mt-2 text-sm text-muted">
            Tente alterar o texto da busca ou selecionar outro status.
          </p>
        </div>
      ) : (
        <>
          {/* Cartões das vagas da página atual */}
          <div className="grid grid-cols-1 gap-4">
            {vagasPaginadas.map((vaga) => (
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

                  <AlterarStatusVaga
                    id={vaga.id}
                    statusAtual={vaga.status}
                  />
                </div>

                {/* Informações em grade */}
                <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-2 xl:grid-cols-3">
                  {vaga.modalidade && (
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted">
                        Modalidade
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-foreground">
                        {nomesModalidade[vaga.modalidade] ??
                          vaga.modalidade}
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
                      <p className="text-xs font-medium text-muted">
                        Salário
                      </p>

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
                      {new Date(vaga.created_at).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </div>

                {/* Ações */}
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

                  {/* Empurra o botão de excluir para a direita */}
                  <div className="ml-auto">
                    <ExcluirVagaButton id={vaga.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4 sm:flex-row">
              <p className="text-sm text-muted">
                Página{" "}
                <strong className="text-foreground">
                  {paginaAtual}
                </strong>{" "}
                de{" "}
                <strong className="text-foreground">
                  {totalPaginas}
                </strong>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                <div className="hidden items-center gap-1 sm:flex">
                  {Array.from(
                    { length: totalPaginas },
                    (_, indice) => indice + 1
                  ).map((pagina) => (
                    <button
                      key={pagina}
                      type="button"
                      onClick={() => mudarPagina(pagina)}
                      className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                        pagina === paginaAtual
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-surface-hover"
                      }`}
                    >
                      {pagina}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}