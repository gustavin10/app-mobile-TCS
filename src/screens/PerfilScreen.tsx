import { View, Text, StyleSheet } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../styles/theme';
import type { StackParamList, TabParamList } from '../navigation/types';
import { encerrarSessao, getUsuario } from '../services/sessao';
import { Botao } from '../components/ui';
import { iniciais } from '../utils/formatar';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Perfil'>,
  NativeStackScreenProps<StackParamList>
>;

export default function PerfilScreen({ navigation }: Props) {
  const usuario = getUsuario();

  function handleSair() {
    encerrarSessao();
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>{iniciais(usuario.nomeCompleto)}</Text>
      </View>
      <Text style={styles.nome}>{usuario.nomeCompleto}</Text>
      <Text style={styles.email}>{usuario.email}</Text>
      <Text style={styles.perfil}>{usuario.perfil}</Text>

      <View style={{ marginTop: 24 }}>
        <Botao titulo="SAIR" onPress={handleSair} cor="#d63031" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: cores.fundo },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 30 },
  nome: { fontSize: 22, fontWeight: 'bold', color: cores.texto },
  email: { color: '#636e72' },
  perfil: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    color: cores.primaria,
    backgroundColor: '#ecebfd',
    textTransform: 'capitalize',
  },
});
