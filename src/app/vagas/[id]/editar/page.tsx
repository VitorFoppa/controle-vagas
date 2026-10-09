import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import FormularioEditarVaga from "@/components/FormularioEditarVaga";
import { exigirUsuario } from "@/utils/supabase/proteger-rota";
import { createClient } from "@/utils/supabase/server";

// Página que recebe o identificador da vaga pela URL.
export default function EditarVagaPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
return ( <AppLayout>
<Suspense
fallback={<p className="text-gray-500">Carregando vaga...</p>}
> <ConteudoEditarVaga params={params} /> </Suspense> </AppLayout>
);
}

// Busca os dados da vaga e verifica a autenticação.
async function ConteudoEditarVaga({
params,
}: {
params: Promise<{ id: string }>;
}) {
// Compatível com Cache Components do Next.js.
await connection();

// Impede o acesso de usuários não autenticados.
await exigirUsuario();

// Obtém o identificador da URL.
const { id } = await params;

// Aceita somente identificadores numéricos positivos.
if (!/^[1-9]\d*$/.test(id)) {
notFound();
}

// Consulta a vaga no Supabase.
const supabase = await createClient();

const { data: vaga, error } = await supabase
.from("vagas")
.select(
"id, empresa, cargo, modalidade, localizacao, salario, url, status, observacoes"
)
.eq("id", id)
.maybeSingle();

// Registra falhas de consulta no terminal.
if (error) {
console.error("Erro ao buscar vaga para edição:", error);
throw new Error("Não foi possível carregar os dados da vaga.");
}

// Se a vaga não existir ou não puder ser acessada,
// apresenta a página 404.
if (!vaga) {
notFound();
}

return ( <main>
{/* Cabeçalho */} <div className="mb-6"> <h1 className="text-2xl font-bold text-gray-900">
Editar vaga </h1>


    <p className="mt-1 text-gray-600">
      Atualize os dados da oportunidade selecionada.
    </p>
  </div>

  {/* Formulário preenchido com os dados do banco */}
  <FormularioEditarVaga
    vaga={{
      ...vaga,
      id: String(vaga.id),
    }}
  />
</main>

);
}
