import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cabecalhoVermelho, cores } from '../styles/theme';
import type { StackParamList, TabParamList } from '../navigation/types';
import { getUsuario } from '../services/sessao';
import { listarCursos, listarTrilhas } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { CursoCard, Estado, Vazio } from '../components/ui';
import { iniciais } from '../utils/formatar';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Início'>,
  NativeStackScreenProps<StackParamList>
>;

const TODAS = 'Todas';

// Catálogo: resumo, trilhas, filtro por categoria e cursos
export default function HomeScreen({ navigation }: Props) {
  const usuario = getUsuario();
  const primeiroNome = usuario.nomeCompleto.split(' ')[0];

  // useWindowDimensions (Etapa 3.2): o cartão de trilha ocupa 60% da tela, no máximo 260
  const { width } = useWindowDimensions();
  const larguraTrilha = Math.min(width * 0.6, 260);

  // Categoria escolhida no filtro
  const [filtro, setFiltro] = useState(TODAS);

  const { dados, erro, carregando, recarregar } = useCarregar(async () => {
    const [trilhas, cursos] = await Promise.all([listarTrilhas(), listarCursos()]);
    return { trilhas, cursos };
  });

  return (
    <View style={styles.tela}>
      {/* BLOCO 1: cabeçalho em linha, saudação à esquerda e avatar à direita (space-between) */}
      <View style={styles.cabecalho}>
        <View style={styles.saudacao}>
          <Text style={styles.marca}>GM CURSOS</Text>
          <Text style={styles.ola} numberOfLines={1}>Olá, {primeiroNome}! 👋</Text>
          <Text style={styles.subtitulo}>O que vamos aprender hoje?</Text>
        </View>
        {/* Avatar: toque para abrir o Perfil */}
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.avatarTexto}>{iniciais(usuario.nomeCompleto)}</Text>
        </TouchableOpacity>
      </View>

      {/* BLOCO 2: conteúdo rolável que ocupa o espaço restante */}
      <Estado pronto={!!dados} erro={erro} onTentar={recarregar}>
        {() => {
          const categorias = [TODAS, ...new Set(dados!.cursos.map((c) => c.categoria))];
          const cursosFiltrados = filtro === TODAS
            ? dados!.cursos
            : dados!.cursos.filter((c) => c.categoria === filtro);

          return (
            <ScrollView
              style={styles.rolagem}
              contentContainerStyle={styles.conteudo}
              refreshControl={<RefreshControl refreshing={carregando} onRefresh={recarregar} />}
            >
              {/* Cards de resumo lado a lado: cada um com flex 1 divide a largura */}
              <View style={styles.linhaCards}>
                <View style={[styles.resumo, styles.resumoPrimario]}>
                  <Text style={styles.resumoValor}>{dados!.cursos.length}</Text>
                  <Text style={styles.resumoRotulo}>Cursos</Text>
                </View>
                <View style={[styles.resumo, styles.resumoEscuro]}>
                  <Text style={styles.resumoValor}>{dados!.trilhas.length}</Text>
                  <Text style={styles.resumoRotulo}>Trilhas</Text>
                </View>
              </View>

              <Text style={styles.secao}>Trilhas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trilhas}>
                {dados!.trilhas.map((trilha) => (
                  <TouchableOpacity
                    key={trilha.id}
                    style={[styles.trilha, { width: larguraTrilha }]}
                    onPress={() => navigation.navigate('Trilha', { id: trilha.id, titulo: trilha.titulo })}
                  >
                    <Ionicons name="git-network-outline" size={26} color={cores.branco} />
                    <Text style={styles.trilhaTitulo} numberOfLines={2}>{trilha.titulo}</Text>
                    <Text style={styles.trilhaInfo}>{trilha.cursos.length} cursos</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Grade de categorias: quebra de linha com flexWrap + gap */}
              <Text style={styles.secao}>Categorias</Text>
              <View style={styles.grade}>
                {categorias.map((categoria) => (
                  <TouchableOpacity
                    key={categoria}
                    style={[styles.chip, filtro === categoria && styles.chipAtivo]}
                    onPress={() => setFiltro(categoria)}
                  >
                    <Text style={[styles.chipTexto, filtro === categoria && styles.chipTextoAtivo]}>
                      {categoria}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.secao}>
                {filtro === TODAS ? 'Todos os cursos' : `Cursos de ${filtro}`}
              </Text>
              {cursosFiltrados.length === 0 && <Vazio icone="school-outline" texto="Nenhum curso nesta categoria." />}
              {cursosFiltrados.map((curso) => (
                <CursoCard key={curso.id} curso={curso} onPress={() => navigation.navigate('Curso', { id: curso.id })} />
              ))}
            </ScrollView>
          );
        }}
      </Estado>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: {
    ...cabecalhoVermelho,
    flexDirection: 'row',            // saudação e avatar na mesma linha
    justifyContent: 'space-between', // um em cada ponta
    alignItems: 'center',            // centralizados na vertical
    gap: 12,
  },
  saudacao: { flexShrink: 1 },       // se o nome for longo, o texto encolhe em vez de empurrar o avatar
  marca: { color: cores.branco, opacity: 0.8, fontWeight: 'bold', letterSpacing: 2, fontSize: 12, marginBottom: 6 },
  ola: { fontSize: 24, fontWeight: 'bold', color: cores.branco },
  subtitulo: { color: cores.branco, opacity: 0.85, marginTop: 2 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,                // círculo: metade do tamanho
    backgroundColor: cores.branco,
    justifyContent: 'center',        // letras no centro dos dois eixos
    alignItems: 'center',
  },
  avatarTexto: { color: cores.primaria, fontWeight: 'bold', fontSize: 16 },
  rolagem: { flex: 1 },              // ocupa o espaço entre o cabeçalho e as abas
  conteudo: { padding: 20, gap: 12 },
  linhaCards: { flexDirection: 'row', gap: 12 },
  resumo: { flex: 1, padding: 16, borderRadius: 14 }, // os dois cards dividem a largura igualmente
  resumoPrimario: { backgroundColor: cores.primaria },
  resumoEscuro: { backgroundColor: cores.primariaEscura },
  resumoValor: { color: cores.branco, fontSize: 24, fontWeight: 'bold' },
  resumoRotulo: { color: cores.branco, opacity: 0.85 },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginTop: 4 },
  trilhas: { gap: 12 },
  trilha: {
    padding: 16,
    gap: 6,
    borderRadius: 14,
    backgroundColor: cores.primariaEscura,
  },
  trilhaTitulo: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
  trilhaInfo: { color: cores.branco, opacity: 0.8 },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',                // chips que não cabem quebram para a próxima linha
    rowGap: 8,
    columnGap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
  },
  chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto: { color: cores.texto, fontWeight: '600' },
  chipTextoAtivo: { color: cores.branco },
});
