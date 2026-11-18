import { FlatList, Text, View, StyleSheet, RefreshControl } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackParamList, TabParamList } from '../navigation/types';
import { listarMeusCursos } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { CursoCard, Estado, Vazio } from '../components/ui';
import { cabecalhoVermelho, cores } from '../styles/theme';
import { data } from '../utils/formatar';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Meus Cursos'>,
  NativeStackScreenProps<StackParamList>
>;

export default function MeusCursosScreen({ navigation }: Props) {
  const { dados: cursos, erro, carregando, recarregar } = useCarregar(listarMeusCursos);

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Meus Cursos</Text>
      <Estado pronto={!!cursos} erro={erro} onTentar={recarregar}>
        {() => (
          <FlatList
            data={cursos!}
            keyExtractor={(c) => String(c.id)}
            contentContainerStyle={styles.lista}
            refreshControl={<RefreshControl refreshing={carregando} onRefresh={recarregar} />}
            ListEmptyComponent={
              <Vazio icone="book-outline" texto="Você ainda não está matriculado em nenhum curso. Explore o catálogo na aba Início!" />
            }
            renderItem={({ item }) => (
              <View style={styles.item}>
                <CursoCard curso={item} onPress={() => navigation.navigate('Curso', { id: item.id })} />
                <Text style={styles.data}>Matriculado em {data(item.dataMatricula!)}</Text>
              </View>
            )}
          />
        )}
      </Estado>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  titulo: { ...cabecalhoVermelho, fontSize: 24, fontWeight: 'bold', color: cores.branco },
  lista: { padding: 20, gap: 12 },
  item: { gap: 4 },
  data: { fontSize: 12, color: cores.textoSuave, marginLeft: 4 },
});
