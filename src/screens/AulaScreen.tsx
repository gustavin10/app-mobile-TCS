import { ScrollView, Text, View, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackParamList } from '../navigation/types';
import { buscarAula } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { Botao, Estado } from '../components/ui';
import { cores } from '../styles/theme';

type Props = NativeStackScreenProps<StackParamList, 'Aula'>;

const iconeTipo = { 'Vídeo': 'play-circle', Texto: 'document-text', Quiz: 'help-circle' } as const;

export default function AulaScreen({ route }: Props) {
  const { dados: aula, erro, recarregar } = useCarregar(() => buscarAula(route.params.id));

  return (
    <View style={styles.tela}>
      <Estado pronto={!!aula} erro={erro} onTentar={recarregar}>
        {() => (
          <ScrollView contentContainerStyle={styles.conteudo}>
            <View style={styles.player}>
              <Ionicons name={iconeTipo[aula!.tipoConteudo] ?? 'book'} size={72} color={cores.branco} />
              <Text style={styles.playerTexto}>{aula!.tipoConteudo} · {aula!.duracaoMinutos} min</Text>
            </View>

            <Text style={styles.modulo}>{aula!.modulo?.titulo}</Text>
            <Text style={styles.titulo}>{aula!.titulo}</Text>
            <Text style={styles.texto}>Aula {aula!.ordem} do módulo · {aula!.tipoConteudo}</Text>

            <Botao titulo="Abrir material da aula" onPress={() => Linking.openURL(aula!.urlConteudo)} />
          </ScrollView>
        )}
      </Estado>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, gap: 12 },
  player: {
    height: 200,
    borderRadius: 12,
    backgroundColor: '#2d3436',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  playerTexto: { color: '#dfe6e9' },
  modulo: { color: cores.primaria, fontWeight: '600', marginTop: 4 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: cores.texto },
  texto: { fontSize: 15, lineHeight: 22, color: cores.texto, marginBottom: 8 },
});
