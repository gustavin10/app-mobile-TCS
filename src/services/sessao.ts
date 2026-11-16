// Guarda o usuário logado e o token JWT enquanto o app está aberto
import type { Usuario } from '../types';

let usuarioLogado: Usuario | null = null;
let token: string | null = null;

export function iniciarSessao(novoToken: string, usuario: Usuario) {
  token = novoToken;
  usuarioLogado = usuario;
}

export function getToken() {
  return token;
}

export function getUsuario(): Usuario {
  if (!usuarioLogado) throw new Error('Nenhum usuário logado');
  return usuarioLogado;
}

export function encerrarSessao() {
  token = null;
  usuarioLogado = null;
}
