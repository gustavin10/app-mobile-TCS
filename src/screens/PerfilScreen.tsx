import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../styles/theme';
import type { StackParamList, TabParamList } from '../navigation/types';
import { sair } from '../services/usuarios';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Perfil'>,
  NativeStackScreenProps<StackParamList>
>;

export default function PerfilScreen({ navigation, route }: Props) {
  const nome = route.params?.nome ?? 'Visitante';
  const email = route.params?.email ?? '-';

  function handleSair() {
    sair();
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{nome}</Text>
      <Text style={styles.email}>{email}</Text>

      <TouchableOpacity style={styles.botao} onPress={handleSair}>
        <Text style={styles.botaoTexto}>SAIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  nome: { fontSize: 22, fontWeight: 'bold' },
  email: { color: cores.cinza },
  botao: {
    marginTop: 24,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#d63031',
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});
