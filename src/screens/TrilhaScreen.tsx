import { ScrollView, Text, View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackParamList } from '../navigation/types';
import { listarTrilhas } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { CursoCard, Estado, Vazio } from '../components/ui';
import { cores } from '../styles/theme';

type Props = NativeStackScreenProps<StackParamList, 'Trilha'>;

export default function TrilhaScreen({ route, navigation }: Props) {
  const { dados: trilha, erro, recarregar } = useCarregar(async () => {
    const trilhas = await listarTrilhas();
    const encontrada = trilhas.find((t) => t.id === route.params.id);
    if (!encontrada) throw new Error('Trilha não encontrada');
    return encontrada;
  });

  return (
    <View style={styles.tela}>
      <Estado pronto={!!trilha} erro={erro} onTentar={recarregar}>
        {() => (
          <ScrollView contentContainerStyle={styles.conteudo}>
            <Text style={styles.categoria}>{trilha!.categoria}</Text>
            <Text style={styles.descricao}>{trilha!.descricao}</Text>
            <Text style={styles.secao}>Cursos da trilha (em ordem)</Text>
            {trilha!.cursos.length === 0 && <Vazio icone="school-outline" texto="Nenhum curso nesta trilha ainda." />}
            {trilha!.cursos.map((curso, i) => (
              <View key={curso.id} style={styles.linha}>
                <Text style={styles.numero}>{i + 1}</Text>
                <View style={styles.cartaoCurso}>
                  <CursoCard curso={curso} onPress={() => navigation.navigate('Curso', { id: curso.id })} />
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </Estado>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, gap: 12 },
  categoria: { color: cores.primaria, fontWeight: 'bold' },
  descricao: { fontSize: 15, color: cores.texto },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginTop: 8 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartaoCurso: { flex: 1 }, // o card ocupa o espaço que sobra ao lado do número
  numero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    color: cores.branco,
    fontWeight: 'bold',
    backgroundColor: cores.primariaEscura,
    overflow: 'hidden',
  },
});
