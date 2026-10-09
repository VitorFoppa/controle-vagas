// Página responsável pelo cadastro de uma nova vaga.
//
// Nesta etapa o formulário ainda não salva dados.
// O funcionamento será implementado depois,
// quando tivermos o banco de dados.

import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { exigirUsuario } from "@/utils/supabase/proteger-rota";

export default function NovaVagaPage() {
  return (
    <AppLayout>
      <Suspense fallback={<p className="text-gray-500">Carregando...</p>}>
        <ConteudoNovaVaga />
      </Suspense>
    </AppLayout>
  );
}

async function ConteudoNovaVaga() {
  await connection();
  await exigirUsuario();

  return (
    <>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nova vaga</h1>

        <p className="mt-1 text-gray-600">
          Cadastre uma nova oportunidade de emprego.
        </p>
      </div>

      {/* Formulário */}
      <form className="max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
        {/* Empresa */}
        <div className="mb-5">
          <label htmlFor="empresa" className="mb-2 block text-sm font-medium">
            Empresa
          </label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            placeholder="Ex.: Solinftec"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
          />
        </div>

        {/* Cargo */}
        <div className="mb-5">
          <label htmlFor="cargo" className="mb-2 block text-sm font-medium">
            Cargo
          </label>
          <input
            id="cargo"
            name="cargo"
            type="text"
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
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
          >
            <option value="">Selecione</option>
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
            name="localizacao"
            type="text"
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
            placeholder="Ex.: R$ 5.000 - R$ 7.000"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
          />
        </div>

        {/* URL da vaga */}
        <div className="mb-5">
          <label htmlFor="url" className="mb-2 block text-sm font-medium">
            Link da vaga
          </label>
          <input
            id="url"
            name="url"
            type="url"
            placeholder="https://..."
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
          />
        </div>

        {/* Status */}
        <div className="mb-5">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
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
            placeholder="Anotações sobre a vaga..."
            className="w-full resize-none rounded-lg border px-4 py-2 outline-none focus:ring-2"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          {/* Botão salvar.
              O funcionamento será implementado depois. */}
          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800"
          >
            Salvar vaga
          </button>

          {/* Voltar para a lista */}
          <Link
            href="/vagas"
            className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-100"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}