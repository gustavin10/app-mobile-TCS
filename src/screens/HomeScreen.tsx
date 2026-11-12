import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../styles/theme';
import type { StackParamList, TabParamList } from '../navigation/types';
import { getUsuarioLogado } from '../services/usuarios';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Início'>,
  NativeStackScreenProps<StackParamList>
>;

const atalhos = ['Pagar', 'Transferir', 'Extrato', 'Cartões', 'Recarga', 'Ajuda'];

// "Maria Silva" -> "MS"
function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.charAt(0) ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
  return (primeira + ultima).toUpperCase();
}

export default function HomeScreen({ navigation }: Props) {
  const nome = getUsuarioLogado()?.nome ?? 'Visitante';
  const primeiroNome = nome.split(' ')[0];

  return (
    <View style={styles.tela}>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.ola}>Olá, {primeiroNome}!</Text>
          <Text style={styles.subtitulo}>Bom dia</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.replace('Login')}>
          <Text style={styles.avatarTexto}>{iniciais(nome)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.conteudo}>
        <View style={styles.linhaCards}>
          <View style={[styles.card, { backgroundColor: cores.primaria }]}>
            <Text style={styles.cardValor}>12</Text>
            <Text style={styles.cardRotulo}>Pedidos</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#00b894' }]}>
            <Text style={styles.cardValor}>R$ 350</Text>
            <Text style={styles.cardRotulo}>Saldo</Text>
          </View>
        </View>

        <Text style={styles.secao}>Atalhos</Text>

        <View style={styles.grade}>
          {atalhos.map((item) => (
            <TouchableOpacity key={item} style={styles.atalho}>
              <View style={styles.icone} />
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: cores.branco,
  },
  ola: { fontSize: 22, fontWeight: 'bold', color: cores.texto },
  subtitulo: { color: cores.cinza },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: { color: cores.branco, fontWeight: 'bold' },
  conteudo: { padding: 20, gap: 16 },
  linhaCards: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  cardValor: { color: cores.branco, fontSize: 22, fontWeight: 'bold' },
  cardRotulo: { color: cores.branco },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  atalho: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  icone: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#dfe6e9' },
});
