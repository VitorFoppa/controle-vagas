import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { exigirUsuario } from "@/utils/supabase/proteger-rota";
import { createClient } from "@/utils/supabase/server";
import DashboardGraficos from "@/components/DashboardGraficos";

// Dashboard principal do Controle de Vagas.
export default function DashboardPage() {
return ( <AppLayout>
<Suspense
fallback={<p className="text-gray-500">Carregando dashboard...</p>}
> <ConteudoDashboard /> </Suspense> </AppLayout>
);
}

// Busca os indicadores e as vagas recentes no Supabase.
async function ConteudoDashboard() {
// Permite utilizar dados da requisição atual com Cache Components.
await connection();

// Garante que somente usuários autenticados acessem o dashboard.
await exigirUsuario();

const supabase = await createClient();

// Busca a quantidade de vagas para cada status.
// As políticas RLS limitam os resultados ao usuário autenticado.
const [
resultadoTotal,
resultadoCandidaturas,
resultadoProcessos,
resultadoEntrevistas,
resultadoRecentes,
resultadoGraficos,
] = await Promise.all([
supabase.from("vagas").select("id", { count: "exact", head: true }),

supabase
  .from("vagas")
  .select("id", { count: "exact", head: true })
  .eq("status", "CANDIDATEI"),

supabase
  .from("vagas")
  .select("id", { count: "exact", head: true })
  .eq("status", "PROCESSO"),

supabase
  .from("vagas")
  .select("id", { count: "exact", head: true })
  .eq("status", "ENTREVISTA"),

supabase
  .from("vagas")
  .select("id, empresa, cargo, status, created_at")
  .order("created_at", { ascending: false })
  .limit(5),

// Busca status, modalidade e data da candidatura
// de todas as vagas do usuário para montar os gráficos.
supabase
  .from("vagas")
  .select("status, modalidade, data_candidatura"),
]);

// Identifica falhas para não apresentar os indicadores
// como se a consulta tivesse sido concluída corretamente.
const erroConsulta =
resultadoTotal.error ||
resultadoCandidaturas.error ||
resultadoProcessos.error ||
resultadoEntrevistas.error ||
resultadoRecentes.error ||
resultadoGraficos.error;

if (erroConsulta) {
console.error("Erro ao carregar dashboard:", erroConsulta);

return (
  <main>
    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

    <p role="alert" className="mt-4 text-red-600">
      Não foi possível carregar os indicadores. Confira o terminal
      do Next.js para ver os detalhes do erro.
    </p>

    <Link
      href="/vagas"
      className="mt-4 inline-block rounded-lg border px-4 py-2 hover:bg-gray-100"
    >
      Ver minhas vagas
    </Link>
  </main>
);

}

// Converte os resultados das consultas em números.
const total = resultadoTotal.count ?? 0;
const candidaturas = resultadoCandidaturas.count ?? 0;
const processos = resultadoProcessos.count ?? 0;
const entrevistas = resultadoEntrevistas.count ?? 0;

const vagasRecentes = resultadoRecentes.data ?? [];

// Dados usados para calcular os gráficos.
const dadosGraficos = resultadoGraficos.data ?? [];

// Traduz os status para nomes mais amigáveis.
const nomesStatus: Record<string, string> = {
SALVA: "Salva",
CANDIDATEI: "Candidatei",
PROCESSO: "Processo seletivo",
ENTREVISTA: "Entrevista",
APROVADO: "Aprovado",
REJEITADO: "Rejeitado",
};

// Define os cartões de indicadores do dashboard.
const indicadores = [
{
titulo: "Total de vagas",
valor: total,
descricao: "Oportunidades cadastradas",
},
{
titulo: "Candidaturas",
valor: candidaturas,
descricao: "Candidaturas enviadas",
},
{
titulo: "Em processo",
valor: processos,
descricao: "Processos seletivos ativos",
},
{
titulo: "Entrevistas",
valor: entrevistas,
descricao: "Vagas com entrevista",
},
];

return ( <main>
{/* Cabeçalho do dashboard */} <div className="mb-8 flex flex-wrap items-center justify-between gap-4"> <div> <h1 className="text-2xl font-bold text-gray-900">
Dashboard </h1>

      <p className="mt-1 text-gray-600">
        Acompanhe o resumo das suas oportunidades profissionais.
      </p>
    </div>

    <Link
      href="/vagas/nova"
      className="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800"
    >
      + Nova vaga
    </Link>
  </div>

  {/* Cartões com indicadores calculados a partir do banco */}
  <section
    aria-label="Resumo das vagas"
    className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
  >
    {indicadores.map((indicador) => (
      <article
        key={indicador.titulo}
        className="rounded-xl border bg-white p-5 shadow-sm"
      >
        <p className="text-sm font-medium text-gray-600">
          {indicador.titulo}
        </p>

        <p className="mt-3 text-3xl font-bold text-gray-900">
          {indicador.valor}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {indicador.descricao}
        </p>
      </article>
    ))}
  </section>

  {/* Lista das cinco vagas mais recentes */}
  <section className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Vagas recentes
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Suas últimas oportunidades cadastradas.
        </p>
      </div>

      <Link
        href="/vagas"
        className="text-sm font-medium text-blue-700 hover:underline"
      >
        Ver todas
      </Link>
    </div>

    {vagasRecentes.length === 0 ? (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <p className="font-medium text-gray-700">
          Você ainda não cadastrou nenhuma vaga.
        </p>

        <Link
          href="/vagas/nova"
          className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline"
        >
          Cadastrar primeira vaga
        </Link>
      </div>
    ) : (
      <div className="divide-y">
        {vagasRecentes.map((vaga) => (
          <article
            key={vaga.id}
            className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
          >
            <div>
              <h3 className="font-medium text-gray-900">
                {vaga.cargo}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {vaga.empresa}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Cadastrada em{" "}
                {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {nomesStatus[vaga.status] ?? vaga.status}
            </span>
          </article>
        ))}
      </div>
    )}
  </section>
  {/* Gráficos alimentados pelos dados do Supabase */}
<DashboardGraficos vagas={resultadoGraficos.data ?? []} />
</main>


);
}
