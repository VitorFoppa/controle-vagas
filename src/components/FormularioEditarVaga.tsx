
"use client";

// Formulário para editar uma vaga já cadastrada.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  BriefcaseBusiness,
  MapPin,
  Monitor,
  Wallet,
  ExternalLink,
  CalendarDays,
  FileText,
  ArrowLeft,
  Save,
  LoaderCircle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Define os dados recebidos da página de edição.
type Vaga = {
  id: string;
  empresa: string;
  cargo: string;
  modalidade: string | null;
  localizacao: string | null;
  salario: string | null;
  url: string | null;
  status: string;
  observacoes: string | null;
  data_candidatura: string | null;
};

type FormularioEditarVagaProps = {
  vaga: Vaga;
};

// Estilo padrão dos campos.
const campo =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 " +
  "text-sm text-slate-800 placeholder:text-slate-400 outline-none transition " +
  "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

// Estilo padrão dos rótulos.
const rotulo =
  "mb-2 block text-sm font-medium text-slate-700";

// Cabeçalho de cada seção do formulário.
function TituloSecao({
  icone,
  titulo,
  descricao,
}: {
  icone: React.ReactNode;
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icone}
      </div>

      <div className="min-w-0">
        <h2 className="font-semibold text-slate-900">{titulo}</h2>
        <p className="mt-1 text-sm text-slate-500">{descricao}</p>
      </div>
    </div>
  );
}

export default function FormularioEditarVaga({
  vaga,
}: FormularioEditarVagaProps) {
  const router = useRouter();

  // Inicializa os campos com os dados já salvos.
  const [empresa, setEmpresa] = useState(vaga.empresa);
  const [cargo, setCargo] = useState(vaga.cargo);
  const [modalidade, setModalidade] = useState(vaga.modalidade ?? "");
  const [localizacao, setLocalizacao] = useState(vaga.localizacao ?? "");
  const [salario, setSalario] = useState(vaga.salario ?? "");
  const [url, setUrl] = useState(vaga.url ?? "");
  const [status, setStatus] = useState(vaga.status);
  const [observacoes, setObservacoes] = useState(
    vaga.observacoes ?? ""
  );
  const [dataCandidatura, setDataCandidatura] = useState(
    vaga.data_candidatura ?? ""
  );

  // Controla o envio e as mensagens da tela.
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Atualiza a vaga existente no Supabase.
  async function atualizarVaga(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const supabase = createClient();

      // Confirma que existe um usuário autenticado.
      const {
        data: { user },
        error: erroUsuario,
      } = await supabase.auth.getUser();

      if (erroUsuario || !user) {
        router.replace("/login");
        router.refresh();
        return;
      }

      // Atualiza o registro. O RLS controla o acesso do usuário.
      const { error: erroAtualizacao } = await supabase
        .from("vagas")
        .update({
          empresa: empresa.trim(),
          cargo: cargo.trim(),
          modalidade: modalidade || null,
          localizacao: localizacao.trim() || null,
          salario: salario.trim() || null,
          url: url.trim() || null,
          status,
          observacoes: observacoes.trim() || null,
          data_candidatura: dataCandidatura || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", vaga.id);

      if (erroAtualizacao) {
        console.error(
          "Erro ao atualizar vaga:",
          erroAtualizacao
        );

        setErro(
          "Não foi possível atualizar a vaga. Tente novamente."
        );
        return;
      }

      // Retorna à lista após salvar.
      router.push("/vagas");
      router.refresh();
    } catch (error) {
      console.error("Erro inesperado ao atualizar vaga:", error);
      setErro("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form
      onSubmit={atualizarVaga}
      className="w-full max-w-5xl space-y-6"
    >
      {/* Seção 1: informações principais da vaga. */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <TituloSecao
          icone={<Building2 size={20} />}
          titulo="Informações da vaga"
          descricao="Dados da empresa e da oportunidade profissional."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="empresa" className={rotulo}>
              Empresa <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Building2
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="empresa"
                type="text"
                required
                maxLength={150}
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Nome da empresa"
                className={`${campo} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="cargo" className={rotulo}>
              Cargo <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <BriefcaseBusiness
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="cargo"
                type="text"
                required
                maxLength={150}
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex.: Desenvolvedor Java Júnior"
                className={`${campo} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="modalidade" className={rotulo}>
              Modalidade de trabalho
            </label>

            <div className="relative">
              <Monitor
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                id="modalidade"
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                className={`${campo} appearance-none pl-10`}
              >
                <option value="">Não informada</option>
                <option value="REMOTO">Remoto</option>
                <option value="HIBRIDO">Híbrido</option>
                <option value="PRESENCIAL">Presencial</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="localizacao" className={rotulo}>
              Localização
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="localizacao"
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex.: Remoto ou Curitiba - PR"
                className={`${campo} pl-10`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: informações sobre candidatura e acompanhamento. */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <TituloSecao
          icone={<CalendarDays size={20} />}
          titulo="Candidatura e acompanhamento"
          descricao="Registre a remuneração, o andamento e a data da candidatura."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="salario" className={rotulo}>
              Salário
            </label>

            <div className="relative">
              <Wallet
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="salario"
                type="text"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                placeholder="Ex.: R$ 5.000 - R$ 7.000"
                className={`${campo} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className={rotulo}>
              Status da candidatura
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={campo}
            >
              <option value="SALVA">Salva</option>
              <option value="CANDIDATEI">Candidatei</option>
              <option value="PROCESSO">Processo seletivo</option>
              <option value="ENTREVISTA">Entrevista</option>
              <option value="APROVADO">Aprovado</option>
              <option value="REJEITADO">Rejeitado</option>
            </select>
          </div>

          <div>
            <label htmlFor="data-candidatura" className={rotulo}>
              Data da candidatura
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="data-candidatura"
                type="date"
                value={dataCandidatura}
                onChange={(e) =>
                  setDataCandidatura(e.target.value)
                }
                className={`${campo} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="url" className={rotulo}>
              Link da vaga
            </label>

            <div className="relative">
              <ExternalLink
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className={`${campo} pl-10`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção 3: anotações pessoais sobre a oportunidade. */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <TituloSecao
          icone={<FileText size={20} />}
          titulo="Observações"
          descricao="Anote contatos, requisitos, etapas e informações importantes."
        />

        <label htmlFor="observacoes" className={rotulo}>
          Anotações
        </label>

        <textarea
          id="observacoes"
          rows={5}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Ex.: Contato do recrutador, tecnologias exigidas, data da entrevista..."
          className={`${campo} resize-y`}
        />
      </section>

      {/* Mensagem de erro ao salvar. */}
      {erro && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span className="font-semibold">Atenção:</span>
          <p>{erro}</p>
        </div>
      )}

      {/* Rodapé com ações do formulário. */}
      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/vagas"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={carregando}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Salvando alterações...
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar alterações
            </>
          )}
        </button>
      </div>
    </form>
  );
}
