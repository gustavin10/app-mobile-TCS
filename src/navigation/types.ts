import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  'Início': undefined;
  Busca: undefined;
  Pedidos: undefined;
  Perfil: { nome: string; email: string } | undefined;
};

export type StackParamList = {
  Login: undefined;
  Registro: undefined;
  Principal: NavigatorScreenParams<TabParamList> | undefined;
};
