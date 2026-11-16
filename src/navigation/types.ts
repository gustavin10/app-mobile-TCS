import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  'Início': undefined;
  'Meus Cursos': undefined;
  'Notificações': undefined;
  Perfil: undefined;
};

export type StackParamList = {
  Login: undefined;
  Registro: undefined;
  Principal: NavigatorScreenParams<TabParamList> | undefined;
  Trilha: { id: number; titulo: string };
  Curso: { id: number };
  Aula: { id: number };
  Pagamento: { idCurso: number; titulo: string };
};
