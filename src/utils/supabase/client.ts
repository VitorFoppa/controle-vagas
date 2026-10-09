// Cliente Supabase utilizado pelos componentes
// que são executados no navegador.

import { createBrowserClient } from "@supabase/ssr";

// Cria uma conexão com o projeto Supabase
// utilizando as variáveis públicas do ambiente.
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );