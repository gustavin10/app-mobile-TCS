// Comunicação com a API NestJS (a mesma usada pelo sistema web: github.com/gustavin10/plataforma-cursos-nestjs)
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getToken } from './sessao';
import type {
  Aula, Curso, CursoDetalhe, Notificacao, Plano, Trilha, Usuario,
} from '../types';

// Descobre o IP do computador que está rodando o Expo (funciona no celular e no emulador).
// Pode ser sobrescrito com EXPO_PUBLIC_API_URL no arquivo .env (ex.: http://192.168.0.10:3000)
function descobrirUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === 'web') return 'http://localhost:3000';
  const hostUri = Constants.expoConfig?.hostUri; // ex.: "192.168.0.10:8081"
  const host = hostUri ? hostUri.split(':')[0] : '10.0.2.2';
  return `http://${host}:3000`;
}

const API_URL = descobrirUrl();

async function requisicao<T>(caminho: string, opcoes?: { method?: string; body?: unknown }): Promise<T> {
  const token = getToken();
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: opcoes?.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opcoes?.body ? JSON.stringify(opcoes.body) : undefined,
    });
  } catch {
    throw new Error(`Não foi possível conectar à API (${API_URL}). Ela está rodando?`);
  }

  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    if (resposta.status === 401 && token) throw new Error('Sessão expirada. Saia e entre novamente.');
    // O NestJS devolve "message" como texto ou como lista (erros de validação)
    const mensagem = Array.isArray(corpo?.message) ? corpo.message.join('\n') : corpo?.message;
    throw new Error(mensagem ?? `Erro ${resposta.status}`);
  }
  return corpo as T;
}

// ---------- Autenticação ----------
export const registrar = (nomeCompleto: string, email: string, senha: string) =>
  requisicao<Usuario>('/usuarios', {
    method: 'POST',
    body: { nomeCompleto, email: email.trim().toLowerCase(), senha, perfil: 'aluno' },
  });

export const login = (email: string, senha: string) =>
  requisicao<{ access_token: string; usuario: Usuario }>('/auth/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), senha },
  });

// ---------- Catálogo ----------
export const listarTrilhas = () => requisicao<Trilha[]>('/aluno/trilhas');
export const listarCursos = () => requisicao<Curso[]>('/aluno/cursos');
export const buscarCurso = (id: number) => requisicao<CursoDetalhe>(`/aluno/cursos/${id}`);
export const buscarAula = (id: number) => requisicao<Aula>(`/aluno/aulas/${id}`);

// ---------- Meus cursos / matrícula ----------
export const listarMeusCursos = () => requisicao<Curso[]>('/aluno/meus-cursos');
export const listarPlanos = () => requisicao<Plano[]>('/planos');

export const matricular = (idCurso: number, idPlano?: number, metodoPagamento?: string) =>
  requisicao<{ pagamento: { valorPago: number; idTransacaoGateway: string } | null }>('/aluno/matriculas', {
    method: 'POST',
    body: { idCurso, idPlano, metodoPagamento },
  });

// ---------- Notificações (criadas pelo consumidor Kafka) ----------
export const listarNotificacoes = () => requisicao<Notificacao[]>('/notificacoes');
export const marcarComoLida = (id: number) =>
  requisicao<Notificacao>(`/notificacoes/${id}/lida`, { method: 'PATCH' });
