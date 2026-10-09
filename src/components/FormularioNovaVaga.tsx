"use client";

// Formulário responsável por cadastrar uma vaga no Supabase.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

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
// Data em que a candidatura foi realizada.
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

// Insere a vaga no banco de dados.
// O user_id é preenchido automaticamente pelo banco.
const { error: erroCadastro } = await supabase
  .from("vagas")
  .insert({
    empresa: empresa.trim(),
    cargo: cargo.trim(),
    modalidade: modalidade || null,
    // Salva a data ou NULL caso o campo fique vazio.
    data_candidatura: dataCandidatura || null,
    localizacao: localizacao.trim() || null,
    salario: salario.trim() || null,
    url: url.trim() || null,
    status,
    observacoes: observacoes.trim() || null,
  });

// Exibe uma mensagem se o banco rejeitar o cadastro.
if (erroCadastro) {
  console.error("Erro ao cadastrar vaga:", erroCadastro);
  setErro(
    "Não foi possível salvar a vaga. Confira os dados e tente novamente."
  );
  setCarregando(false);
  return;
}

// Volta para a lista após salvar com sucesso.
router.push("/vagas");
router.refresh();


}

return ( <form
   onSubmit={salvarVaga}
   className="max-w-3xl rounded-xl border bg-white p-6 shadow-sm"
 >
{/* Empresa */} <div className="mb-5"> <label htmlFor="empresa" className="mb-2 block text-sm font-medium">
Empresa </label>
<input
id="empresa"
name="empresa"
type="text"
required
maxLength={150}
value={empresa}
onChange={(event) => setEmpresa(event.target.value)}
placeholder="Ex.: Solinftec"
className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
/> </div>

```
  {/* Cargo */}
  <div className="mb-5">
    <label htmlFor="cargo" className="mb-2 block text-sm font-medium">
      Cargo
    </label>
    <input
      id="cargo"
      name="cargo"
      type="text"
      required
      maxLength={150}
      value={cargo}
      onChange={(event) => setCargo(event.target.value)}
      placeholder="Ex.: Desenvolvedor Backend Java Jr"
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
      name="modalidade"
      value={modalidade}
      onChange={(event) => setModalidade(event.target.value)}
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
    >
      <option value="">Selecione</option>
      <option value="REMOTO">Remoto</option>
      <option value="HIBRIDO">Híbrido</option>
      <option value="PRESENCIAL">Presencial</option>
    </select>
  </div>

  {/* Data em que você se candidatou à vaga */}
<div>
  <label
    htmlFor="dataCandidatura"
    className="mb-1 block text-sm font-medium text-gray-700"
  >
    Data da candidatura
  </label>

  <input
    id="dataCandidatura"
    type="date"
    value={dataCandidatura}
    onChange={(e) => setDataCandidatura(e.target.value)}
    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
  />
</div>

  {/* Localização */}
  <div className="mb-5">
    <label htmlFor="localizacao" className="mb-2 block text-sm font-medium">
      Localização
    </label>
    <input
      id="localizacao"
      name="localizacao"
      type="text"
      value={localizacao}
      onChange={(event) => setLocalizacao(event.target.value)}
      placeholder="Ex.: Curitiba - PR"
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
      name="salario"
      type="text"
      value={salario}
      onChange={(event) => setSalario(event.target.value)}
      placeholder="Ex.: R$ 5.000 - R$ 7.000"
      className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
    />
  </div>

  {/* Link da vaga */}
  <div className="mb-5">
    <label htmlFor="url" className="mb-2 block text-sm font-medium">
      Link da vaga
    </label>
    <input
      id="url"
      name="url"
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
      name="status"
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
      name="observacoes"
      rows={5}
      value={observacoes}
      onChange={(event) => setObservacoes(event.target.value)}
      placeholder="Anotações sobre a vaga..."
      className="w-full resize-none rounded-lg border px-4 py-2 outline-none focus:ring-2"
    />
  </div>

  {/* Mensagem de erro */}
  {erro && (
    <p role="alert" className="mb-4 text-sm text-red-600">
      {erro}
    </p>
  )}

  {/* Ações do formulário */}
  <div className="flex flex-wrap gap-3">
    <button
      type="submit"
      disabled={carregando}
      className="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {carregando ? "Salvando..." : "Salvar vaga"}
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
