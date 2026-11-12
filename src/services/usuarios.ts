// Guarda os usuários cadastrados enquanto o app está aberto
// TODO: trocar pela API (POST /users e POST /auth/login)

type Usuario = {
  nome: string;
  email: string;
};

const cadastrados: Usuario[] = [];

let usuarioLogado: Usuario | null = null;

export function cadastrar(nome: string, email: string) {
  cadastrados.push({ nome: nome.trim(), email: email.trim().toLowerCase() });
}

export function entrar(email: string): Usuario {
  const emailFormatado = email.trim().toLowerCase();
  const encontrado = cadastrados.find((u) => u.email === emailFormatado);

  // Sem cadastro: usa o que vem antes do @ como nome
  usuarioLogado = encontrado ?? {
    nome: emailFormatado.split('@')[0] || 'Visitante',
    email: emailFormatado,
  };

  return usuarioLogado;
}

export function getUsuarioLogado() {
  return usuarioLogado;
}

export function sair() {
  usuarioLogado = null;
}
