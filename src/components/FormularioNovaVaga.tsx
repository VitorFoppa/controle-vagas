
"use client";

// Formulário responsável por cadastrar uma vaga no Supabase.

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

// Estilo padrão dos campos.
const campo =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 " +
  "text-sm text-slate-800 placeholder:text-slate-400 outline-none transition " +
  "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

// Estilo padrão dos rótulos.
const rotulo = "mb-2 block text-sm font-medium text-slate-700";

// Cabeçalho reutilizável das seções.
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

export default function FormularioNovaVaga() {
  // Controla os campos do formulário.
  const [empresa, setEmpresa] = useState("");
  const [cargo, setCargo] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [salario, setSalario] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("SALVA");
  const [observacoes, setObservacoes] = useState("");
  const [dataCandidatura, setDataCandidatura] = useState("");

  // Controla o envio e a mensagem de erro.
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Permite navegar após salvar a vaga.
  const router = useRouter();

  // Envia os dados do formulário para o Supabase.
  async function salvarVaga(
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

      // Insere a vaga. O banco preenche user_id automaticamente.
      const { error: erroCadastro } = await supabase
        .from("vagas")
        .insert({
          empresa: empresa.trim(),
          cargo: cargo.trim(),
          modalidade: modalidade || null,
          localizacao: localizacao.trim() || null,
          salario: salario.trim() || null,
          url: url.trim() || null,
          status,
          observacoes: observacoes.trim() || null,
          data_candidatura: dataCandidatura || null,
        });

      // Exibe um erro se o Supabase rejeitar o cadastro.
      if (erroCadastro) {
        console.error("Erro ao cadastrar vaga:", erroCadastro);

        setErro(
          "Não foi possível salvar a vaga. Confira os dados e tente novamente."
        );
        return;
      }


      // Limpa os campos após salvar com sucesso.
      setEmpresa("");
      setCargo("");
      setModalidade("");
      setLocalizacao("");
      setSalario("");
      setUrl("");
      setStatus("SALVA");
      setObservacoes("");
      setDataCandidatura("");
      // Retorna à lista após salvar com sucesso.
      router.push("/vagas");
      router.refresh();
    } catch (error) {
      console.error("Erro inesperado ao cadastrar vaga:", error);
      setErro("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form
      onSubmit={salvarVaga}
      className="w-full max-w-5xl space-y-6"
    >
      {/* Seção 1: informações principais da vaga. */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <TituloSecao
          icone={<Building2 size={20} />}
          titulo="Informações da vaga"
          descricao="Informe a empresa e os detalhes da oportunidade."
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
                name="empresa"
                type="text"
                required
                maxLength={150}
                value={empresa}
                onChange={(event) => setEmpresa(event.target.value)}
                placeholder="Ex.: Empresa X"
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
                name="cargo"
                type="text"
                required
                maxLength={150}
                value={cargo}
                onChange={(event) => setCargo(event.target.value)}
                placeholder="Ex.: Desenvolvedor Backend Java Jr"
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
                name="modalidade"
                value={modalidade}
                onChange={(event) => setModalidade(event.target.value)}
                className={`${campo} pl-10`}
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
                name="localizacao"
                type="text"
                value={localizacao}
                onChange={(event) => setLocalizacao(event.target.value)}
                placeholder="Ex.: Remoto ou Curitiba - PR"
                className={`${campo} pl-10`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: candidatura e acompanhamento. */}
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
                name="salario"
                type="text"
                value={salario}
                onChange={(event) => setSalario(event.target.value)}
                placeholder="Ex.: R$ 5.000 - R$ 7.000"
                className={`${campo} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className={rotulo}>
              Status da vaga
            </label>

            <select
              id="status"
              name="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
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
            <label htmlFor="dataCandidatura" className={rotulo}>
              Data da candidatura
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="dataCandidatura"
                name="dataCandidatura"
                type="date"
                value={dataCandidatura}
                onChange={(event) =>
                  setDataCandidatura(event.target.value)
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
                name="url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://..."
                className={`${campo} pl-10`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção 3: observações adicionais. */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <TituloSecao
          icone={<FileText size={20} />}
          titulo="Observações"
          descricao="Adicione anotações importantes sobre a oportunidade."
        />

        <label htmlFor="observacoes" className={rotulo}>
          Anotações
        </label>

        <textarea
          id="observacoes"
          name="observacoes"
          rows={5}
          value={observacoes}
          onChange={(event) => setObservacoes(event.target.value)}
          placeholder="Ex.: Requisitos, tecnologias exigidas, contato do recrutador..."
          className={`${campo} resize-y`}
        />
      </section>

      {/* Mensagem de erro. */}
      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      {/* Ações do formulário. */}
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
              Salvando vaga...
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar vaga
            </>
          )}
        </button>
      </div>
    </form>
  );
}
