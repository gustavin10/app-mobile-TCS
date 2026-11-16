import { Alert, Platform } from 'react-native';

// Alert.alert não aparece na versão web; lá usamos o window.alert
export function avisar(titulo: string, mensagem?: string) {
  if (Platform.OS === 'web') {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
  } else {
    Alert.alert(titulo, mensagem);
  }
}
