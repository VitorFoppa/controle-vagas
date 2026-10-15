
"use client";

// Permite alterar o status de uma vaga diretamente no cartão.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type StatusVaga =
  | "SALVA"
  | "CANDIDATEI"
  | "PROCESSO"
  | "ENTREVISTA"
  | "APROVADO"
  | "REJEITADO";

type AlterarStatusVagaProps = {
  id: number;
  statusAtual: string;
};

const opcoesStatus: { valor: StatusVaga; nome: string }[] = [
  { valor: "SALVA", nome: "Salva" },
  { valor: "CANDIDATEI", nome: "Candidatei" },
  { valor: "PROCESSO", nome: "Processo seletivo" },
  { valor: "ENTREVISTA", nome: "Entrevista" },
  { valor: "APROVADO", nome: "Aprovado" },
  { valor: "REJEITADO", nome: "Rejeitado" },
];

export default function AlterarStatusVaga({
  id,
  statusAtual,
}: AlterarStatusVagaProps) {
  const router = useRouter();

  const [status, setStatus] = useState(statusAtual);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Salva o novo status no Supabase.
  async function atualizarStatus(novoStatus: string) {
    if (novoStatus === status || salvando) {
      return;
    }

    setSalvando(true);
    setErro("");

    const supabase = createClient();

    const { error } = await supabase
      .from("vagas")
      .update({
        status: novoStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      setErro("Não foi possível atualizar o status.");
      setSalvando(false);
      return;
    }

    // Atualiza o valor exibido e recarrega os dados da página.
    setStatus(novoStatus);
    router.refresh();
    setSalvando(false);
  }

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label
        htmlFor={`status-vaga-${id}`}
        className="text-xs font-medium text-muted"
      >
        Status da vaga
      </label>

      <select
        id={`status-vaga-${id}`}
        value={status}
        onChange={(event) => atualizarStatus(event.target.value)}
        disabled={salvando}
        aria-label={`Alterar status da vaga ${id}`}
        className="w-full min-w-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none transition focus:ring-2 focus:ring-primary disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {opcoesStatus.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.nome}
          </option>
        ))}
      </select>

      {salvando && (
        <span className="text-xs text-muted">Salvando...</span>
      )}

      {erro && (
        <span role="alert" className="text-xs text-red-600 dark:text-red-400">
          {erro}
        </span>
      )}
    </div>
  );
}
