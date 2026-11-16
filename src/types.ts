export type Usuario = {
  id: number;
  nomeCompleto: string;
  email: string;
  perfil: string;
};

export type Curso = {
  id: number;
  titulo: string;
  descricao: string;
  nivel: string;
  totalHoras: number;
  totalAulas: number;
  categoria: string;
  instrutor: string;
  dataMatricula?: string;
  dataConclusao?: string | null;
};

export type Trilha = {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  cursos: Curso[];
};

export type Aula = {
  id: number;
  titulo: string;
  tipoConteudo: 'Vídeo' | 'Texto' | 'Quiz';
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
  modulo?: { titulo: string };
};

export type Modulo = {
  id: number;
  titulo: string;
  ordem: number;
  aulas: Aula[];
};

export type Assinatura = {
  id: number;
  plano: string;
  dataInicio: string;
  dataFim: string;
};

export type CursoDetalhe = Curso & {
  modulos: Modulo[];
  matriculado: boolean;
  assinatura: Assinatura | null;
};

export type Plano = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMeses: number;
};

export type Notificacao = {
  id: number;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadaEm: string;
};
