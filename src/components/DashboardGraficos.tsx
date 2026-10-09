
"use client";

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
  LineChart,
  Line,
} from "recharts";

// Dados necessários para montar os gráficos.
type VagaGrafico = {
  status: string;
  modalidade: string | null;
  data_candidatura: string | null;
};

type DashboardGraficosProps = {
  vagas: VagaGrafico[];
};

// Nomes amigáveis para os status armazenados no banco.
const nomesStatus: Record<string, string> = {
  SALVA: "Salva",
  CANDIDATEI: "Candidatei",
  PROCESSO: "Em processo",
  ENTREVISTA: "Entrevista",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

// Nomes amigáveis para as modalidades.
const nomesModalidade: Record<string, string> = {
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
  PRESENCIAL: "Presencial",
};

const cores = [
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#dc2626",
];

// Monta os últimos seis meses, incluindo o mês atual.
function criarDadosMensais(vagas: VagaGrafico[]) {
  const agora = new Date();

  const meses = Array.from({ length: 6 }, (_, indice) => {
    // Começa cinco meses antes e termina no mês atual.
    const data = new Date(
      agora.getFullYear(),
      agora.getMonth() - 5 + indice,
      1
    );

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");

    return {
      chave: `${ano}-${mes}`,
      mes: data.toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      }),
      quantidade: 0,
    };
  });

  // Conta as candidaturas por ano e mês.
  vagas.forEach((vaga) => {
    if (!vaga.data_candidatura) return;

    // A data do banco vem no formato YYYY-MM-DD.
    const chave = vaga.data_candidatura.slice(0, 7);
    const mesEncontrado = meses.find((mes) => mes.chave === chave);

    if (mesEncontrado) {
      mesEncontrado.quantidade += 1;
    }
  });

  return meses;
}

export default function DashboardGraficos({
  vagas,
}: DashboardGraficosProps) {
  // Quantidade de vagas por status.
  const dadosStatus = Object.entries(nomesStatus).map(([status, nome]) => ({
    nome,
    quantidade: vagas.filter((vaga) => vaga.status === status).length,
  }));

  // Quantidade de vagas por modalidade.
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
        (modalidade === "NAO_INFORMADA"
          ? "Não informada"
          : modalidade),
      quantidade,
    })
  );

  // Evolução mensal das candidaturas realizadas.
  const dadosMensais = criarDadosMensais(vagas);

  if (vagas.length === 0) {
    return (
      <section className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-bold">Análise das vagas</h2>
        <p className="mt-2 text-gray-600">
          Cadastre vagas para visualizar seus gráficos.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-xl font-bold">Análise das vagas</h2>

      {/* Gráfico de candidaturas realizadas por mês. */}
      <article className="rounded-xl border bg-white p-5">
        <h3 className="mb-1 font-semibold">
          Evolução mensal das candidaturas
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          Últimos seis meses, considerando a data da candidatura.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="quantidade"
                name="Candidaturas"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* Gráficos de status e modalidade. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="rounded-xl border bg-white p-5">
          <h3 className="mb-4 font-semibold">Vagas por status</h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
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

        <article className="rounded-xl border bg-white p-5">
          <h3 className="mb-4 font-semibold">Vagas por modalidade</h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosModalidade}
                  dataKey="quantidade"
                  nameKey="nome"
                  cx="50%"
                  cy="45%"
                  outerRadius={85}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {dadosModalidade.map((item, indice) => (
                    <Cell
                      key={item.nome}
                      fill={cores[indice % cores.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}