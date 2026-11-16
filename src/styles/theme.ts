import { Platform, ViewStyle } from 'react-native';

// Paleta vermelho e branco (inspirada nas cores do Vila Nova)
export const cores = {
  primaria: '#C8102E', // vermelho
  primariaEscura: '#8E0B20',
  primariaClara: '#FDECEF', // fundo de destaque suave
  fundo: '#FFFFFF',
  branco: '#FFFFFF',
  texto: '#1D1D1F',
  textoSuave: '#6E6E73',
  cinza: '#B5B5BA',
  borda: '#ECECEE',
  sucesso: '#1E8E3E',
  sucessoClaro: '#E8F5EC',
};

// Cartão branco com borda fina e sombra leve (para destacar sobre o fundo branco)
export const cartao: ViewStyle = {
  backgroundColor: cores.branco,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: cores.borda,
  ...Platform.select<ViewStyle>({
    ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
    android: { elevation: 2 },
    default: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' } as ViewStyle,
  }),
};

// Cabeçalho vermelho das abas (Início, Meus Cursos, Notificações)
export const cabecalhoVermelho: ViewStyle = {
  paddingHorizontal: 20,
  paddingTop: 60,
  paddingBottom: 24,
  backgroundColor: cores.primaria,
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
};
