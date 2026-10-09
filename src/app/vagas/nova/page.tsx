import { Suspense } from "react";
import { connection } from "next/server";
import AppLayout from "@/components/AppLayout";
import FormularioNovaVaga from "@/components/FormularioNovaVaga";
import { exigirUsuario } from "@/utils/supabase/proteger-rota";

// Mantém o layout e prepara a página de cadastro.
export default function NovaVagaPage() {
return ( <AppLayout>
<Suspense
fallback={<p className="text-gray-500">Carregando...</p>}
> <ConteudoNovaVaga /> </Suspense> </AppLayout>
);
}

// Executa a verificação de autenticação no servidor.
async function ConteudoNovaVaga() {
// Informa ao Next.js que esta parte depende
// da requisição atual, compatível com Cache Components.
await connection();

// Impede que usuários não autenticados acessem o conteúdo.
await exigirUsuario();

return (
<>
{/* Cabeçalho */} <div className="mb-6"> <h1 className="text-2xl font-bold">Nova vaga</h1>


    <p className="mt-1 text-gray-600">
      Cadastre uma nova oportunidade de emprego.
    </p>
  </div>

  {/* Formulário interativo */}
  <FormularioNovaVaga />
</>


);
}
