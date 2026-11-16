import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cabecalhoVermelho, cartao, cores } from '../styles/theme';
import type { StackParamList, TabParamList } from '../navigation/types';
import { encerrarSessao, getUsuario } from '../services/sessao';
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
    <View style={styles.tela}>
      <View style={styles.topo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{iniciais(usuario.nomeCompleto)}</Text>
        </View>
        <Text style={styles.nome}>{usuario.nomeCompleto}</Text>
        <Text style={styles.perfil}>{usuario.perfil}</Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.item}>
          <Ionicons name="mail-outline" size={22} color={cores.primaria} />
          <View>
            <Text style={styles.rotulo}>E-mail</Text>
            <Text style={styles.valor}>{usuario.email}</Text>
          </View>
        </View>
        <View style={styles.item}>
          <Ionicons name="id-card-outline" size={22} color={cores.primaria} />
          <View>
            <Text style={styles.rotulo}>Código do usuário</Text>
            <Text style={styles.valor}>#{usuario.id}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.sair} onPress={handleSair}>
          <Ionicons name="log-out-outline" size={20} color={cores.primaria} />
          <Text style={styles.sairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  topo: { ...cabecalhoVermelho, alignItems: 'center', gap: 6, paddingBottom: 32 },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarTexto: { color: cores.primaria, fontWeight: 'bold', fontSize: 32 },
  nome: { fontSize: 22, fontWeight: 'bold', color: cores.branco },
  perfil: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    color: cores.primaria,
    backgroundColor: cores.branco,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  conteudo: { padding: 20, gap: 12 },
  item: { ...cartao, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  rotulo: { color: cores.textoSuave, fontSize: 12 },
  valor: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  sair: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 52,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: cores.primaria,
  },
  sairTexto: { color: cores.primaria, fontWeight: 'bold', fontSize: 16 },
});
