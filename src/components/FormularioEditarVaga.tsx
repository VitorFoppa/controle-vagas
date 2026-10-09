"use client";

// Formulário para editar uma vaga já cadastrada.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

// Define os dados que serão recebidos da página.
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

// Define as propriedades esperadas pelo formulário.
type FormularioEditarVagaProps = {
vaga: Vaga;
};

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
const [observacoes, setObservacoes] = useState(vaga.observacoes ?? "");

// Mantém a data já salva ao abrir a edição.
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

const supabase = createClient();

// Confirma que existe um usuário autenticado.
const {
  data: { user },
  error: erroUsuario,
} = await supabase.auth.getUser();

if (erroUsuario || !user) {
  setCarregando(false);
  router.replace("/login");
  router.refresh();
  return;
}

// Atualiza o registro existente, sem criar uma nova vaga.
// O RLS do banco controla quais registros podem ser alterados.
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
    updated_at: new Date().toISOString(),
    // Atualiza a data da candidatura.
    data_candidatura: dataCandidatura || null,
  })
  .eq("id", vaga.id);

if (erroAtualizacao) {
  console.error("Erro ao atualizar vaga:", erroAtualizacao);
  setErro("Não foi possível atualizar a vaga. Tente novamente.");
  setCarregando(false);
  return;
}

// Retorna à lista e atualiza os dados exibidos.
router.push("/vagas");
router.refresh();

}

return ( <form
   onSubmit={atualizarVaga}
   className="max-w-3xl rounded-xl border bg-white p-6 shadow-sm"
 >
{/* Empresa */} <div className="mb-5"> <label htmlFor="empresa" className="mb-2 block text-sm font-medium">
Empresa </label>
<input
id="empresa"
type="text"
required
maxLength={150}
value={empresa}
onChange={(event) => setEmpresa(event.target.value)}
className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
/> </div>

  {/* Cargo */}
  <div className="mb-5">
    <label htmlFor="cargo" className="mb-2 block text-sm font-medium">
      Cargo
    </label>
    <input
      id="cargo"
      type="text"
      required
      maxLength={150}
      value={cargo}
      onChange={(event) => setCargo(event.target.value)}
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
    />
  </div>

  {/* Modalidade */}
  <div className="mb-5">
    <label htmlFor="modalidade" className="mb-2 block text-sm font-medium">
      Modalidade
    </label>
    <select
      id="modalidade"
      value={modalidade}
      onChange={(event) => setModalidade(event.target.value)}
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
    >
      <option value="">Não informada</option>
      <option value="REMOTO">Remoto</option>
      <option value="HIBRIDO">Híbrido</option>
      <option value="PRESENCIAL">Presencial</option>
    </select>
  </div>

  {/* Localização */}
  <div className="mb-5">
    <label htmlFor="localizacao" className="mb-2 block text-sm font-medium">
      Localização
    </label>
    <input
      id="localizacao"
      type="text"
      value={localizacao}
      onChange={(event) => setLocalizacao(event.target.value)}
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
    />
  </div>

  {/* Salário */}
  <div className="mb-5">
    <label htmlFor="salario" className="mb-2 block text-sm font-medium">
      Salário
    </label>
    <input
      id="salario"
      type="text"
      value={salario}
      onChange={(event) => setSalario(event.target.value)}
      placeholder="Ex.: R$ 5.000 - R$ 7.000"
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
    />
  </div>

  {/* Link do anúncio */}
  <div className="mb-5">
    <label htmlFor="url" className="mb-2 block text-sm font-medium">
      Link da vaga
    </label>
    <input
      id="url"
      type="url"
      value={url}
      onChange={(event) => setUrl(event.target.value)}
      placeholder="https://..."
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
    />
  </div>

  {/* Status da candidatura */}
  <div className="mb-5">
    <label htmlFor="status" className="mb-2 block text-sm font-medium">
      Status
    </label>
    <select
      id="status"
      value={status}
      onChange={(event) => setStatus(event.target.value)}
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
    >
      <option value="SALVA">Salva</option>
      <option value="CANDIDATEI">Candidatei</option>
      <option value="PROCESSO">Processo seletivo</option>
      <option value="ENTREVISTA">Entrevista</option>
      <option value="APROVADO">Aprovado</option>
      <option value="REJEITADO">Rejeitado</option>
    </select>
  </div>

  {/* Observações */}
  <div className="mb-6">
    <label htmlFor="observacoes" className="mb-2 block text-sm font-medium">
      Observações
    </label>
    <textarea
      id="observacoes"
      rows={5}
      value={observacoes}
      onChange={(event) => setObservacoes(event.target.value)}
      className="w-full resize-none rounded-lg border px-4 py-2 outline-none focus:ring-2"
    />
  </div>

  {/* Exibe possíveis erros */}
  {erro && (
    <p role="alert" className="mb-4 text-sm text-red-600">
      {erro}
    </p>
  )}

  {/* Botões de ação */}
  <div className="flex flex-wrap gap-3">
    <button
      type="submit"
      disabled={carregando}
      className="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
    >
      {carregando ? "Salvando..." : "Salvar alterações"}
    </button>

    <Link
      href="/vagas"
      className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-100"
    >
      Cancelar
    </Link>
  </div>
</form>

);
}
