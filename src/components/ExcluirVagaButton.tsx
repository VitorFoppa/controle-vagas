"use client";

// Botão responsável por excluir uma vaga cadastrada.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type ExcluirVagaButtonProps = {
  id: number;
};

export default function ExcluirVagaButton({
  id,
}: ExcluirVagaButtonProps) {
  const router = useRouter();

  // Controla o estado do botão durante a exclusão.
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function excluirVaga() {
    // Evita excluir por acidente.
    const confirmou = window.confirm(
      "Tem certeza de que deseja excluir esta vaga? Essa ação não pode ser desfeita."
    );

    if (!confirmou) return;

    setCarregando(true);
    setErro("");

    const supabase = createClient();

    // Confirma a sessão do usuário.
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

    // Exclui apenas a vaga identificada.
    // A política RLS impede excluir vagas de outros usuários.
    const { error: erroExclusao } = await supabase
      .from("vagas")
      .delete()
      .eq("id", id);

    if (erroExclusao) {
      console.error("Erro ao excluir vaga:", erroExclusao);
      setErro("Não foi possível excluir a vaga. Tente novamente.");
      setCarregando(false);
      return;
    }

    // Atualiza a listagem após a exclusão.
    router.refresh();
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={excluirVaga}
        disabled={carregando}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {carregando ? "Excluindo..." : "Excluir vaga"}
      </button>

      {erro && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}