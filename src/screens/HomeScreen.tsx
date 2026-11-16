import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../styles/theme';
import type { StackParamList, TabParamList } from '../navigation/types';
import { getUsuario } from '../services/sessao';
import { listarCursos, listarTrilhas } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { CursoCard, Estado } from '../components/ui';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Início'>,
  NativeStackScreenProps<StackParamList>
>;

// Catálogo: trilhas e todos os cursos
export default function HomeScreen({ navigation }: Props) {
  const primeiroNome = getUsuario().nomeCompleto.split(' ')[0];
  const { dados, erro, carregando, recarregar } = useCarregar(async () => {
    const [trilhas, cursos] = await Promise.all([listarTrilhas(), listarCursos()]);
    return { trilhas, cursos };
  });

  return (
    <View style={styles.tela}>
      <View style={styles.cabecalho}>
        <Text style={styles.ola}>Olá, {primeiroNome}!</Text>
        <Text style={styles.subtitulo}>O que vamos aprender hoje?</Text>
      </View>

      <Estado pronto={!!dados} erro={erro} onTentar={recarregar}>
        {() => (
          <ScrollView
            contentContainerStyle={styles.conteudo}
            refreshControl={<RefreshControl refreshing={carregando} onRefresh={recarregar} />}
          >
            <Text style={styles.secao}>Trilhas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {dados!.trilhas.map((trilha) => (
                <TouchableOpacity
                  key={trilha.id}
                  style={styles.trilha}
                  onPress={() => navigation.navigate('Trilha', { id: trilha.id, titulo: trilha.titulo })}
                >
                  <Ionicons name="git-network-outline" size={26} color={cores.branco} />
                  <Text style={styles.trilhaTitulo}>{trilha.titulo}</Text>
                  <Text style={styles.trilhaInfo}>{trilha.cursos.length} cursos</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.secao}>Todos os cursos</Text>
            {dados!.cursos.map((curso) => (
              <CursoCard key={curso.id} curso={curso} onPress={() => navigation.navigate('Curso', { id: curso.id })} />
            ))}
          </ScrollView>
        )}
      </Estado>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: cores.branco,
  },
  ola: { fontSize: 22, fontWeight: 'bold', color: cores.texto },
  subtitulo: { color: '#636e72' },
  conteudo: { padding: 20, gap: 12 },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginTop: 4 },
  trilha: {
    width: 200,
    padding: 16,
    gap: 6,
    borderRadius: 12,
    backgroundColor: '#0984e3',
  },
  trilhaTitulo: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
  trilhaInfo: { color: '#dfe6e9' },
});
