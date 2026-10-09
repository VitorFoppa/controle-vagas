"use client";

// Componente visual dos gráficos do dashboard.
// Recebe os dados consultados no servidor e monta os gráficos.

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Define os dados necessários para os gráficos.
type VagaGrafico = {
  status: string;
  modalidade: string | null;
};

type DashboardGraficosProps = {
  vagas: VagaGrafico[];
};

// Traduz os status internos para nomes amigáveis.
const nomesStatus: Record<string, string> = {
  SALVA: "Salva",
  CANDIDATEI: "Candidatei",
  PROCESSO: "Em processo",
  ENTREVISTA: "Entrevista",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

// Agrupa as modalidades para facilitar a leitura do gráfico.
const nomesModalidade: Record<string, string> = {
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
  PRESENCIAL: "Presencial",
};

const cores = ["#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2", "#dc2626"];

export default function DashboardGraficos({
  vagas,
}: DashboardGraficosProps) {
  // Conta as vagas de cada status, inclusive os que têm valor zero.
  const dadosStatus = Object.entries(nomesStatus).map(
    ([status, nome]) => ({
      nome,
      quantidade: vagas.filter((vaga) => vaga.status === status).length,
    })
  );

  // Conta as vagas por modalidade.
  const contagemModalidade: Record<string, number> = {};

  vagas.forEach((vaga) => {
    const modalidade = vaga.modalidade || "NAO_INFORMADA";

    contagemModalidade[modalidade] =
      (contagemModalidade[modalidade] ?? 0) + 1;
  });

  const dadosModalidade = Object.entries(contagemModalidade).map(
    ([modalidade, quantidade]) => ({
      nome:
        nomesModalidade[modalidade] ??
        (modalidade === "NAO_INFORMADA" ? "Não informada" : modalidade),
      quantidade,
    })
  );

  // Exibe uma mensagem quando ainda não existem registros.
  if (vagas.length === 0) {
    return (
      <section className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Análise das vagas
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Cadastre vagas para visualizar os gráficos de status e modalidade.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Análise das vagas
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Distribuição das oportunidades cadastradas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Gráfico de barras: quantidade por status */}
        <article className="min-w-0 rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            Vagas por status
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosStatus}
                margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="nome"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={65}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="quantidade"
                  name="Quantidade"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Gráfico de pizza: distribuição por modalidade */}
        <article className="min-w-0 rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            Vagas por modalidade
          </h3>

          {dadosModalidade.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Nenhuma modalidade informada.
            </p>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosModalidade}
                    dataKey="quantidade"
                    nameKey="nome"
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {dadosModalidade.map((item, index) => (
                      <Cell
                        key={item.nome}
                        fill={cores[index % cores.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}