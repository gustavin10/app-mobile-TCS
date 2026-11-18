import { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackParamList } from '../navigation/types';
import { buscarCurso, matricular } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { Botao, Estado } from '../components/ui';
import { cartao, cores } from '../styles/theme';
import { data } from '../utils/formatar';
import { avisar } from '../utils/avisar';

type Props = NativeStackScreenProps<StackParamList, 'Curso'>;

const iconeTipo: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Vídeo': 'play-circle',
  Texto: 'document-text',
  Quiz: 'help-circle',
};

// Detalhe do curso com módulos e aulas. Aulas só abrem para quem está matriculado.
export default function CursoScreen({ route, navigation }: Props) {
  const { dados: curso, erro, recarregar } = useCarregar(() => buscarCurso(route.params.id));
  const [matriculando, setMatriculando] = useState(false);

  // Aluno com assinatura ativa: matricula direto, sem pagar de novo
  async function matricularComAssinatura() {
    setMatriculando(true);
    try {
      await matricular(route.params.id);
      avisar('Matrícula confirmada! 🎉', 'O curso já está em Meus Cursos.');
      recarregar();
    } catch (e) {
      avisar('Não foi possível matricular', (e as Error).message);
    } finally {
      setMatriculando(false);
    }
  }

  function renderMatricula() {
    if (curso!.matriculado) {
      return (
        <View style={styles.matriculado}>
          <Ionicons name="checkmark-circle" size={20} color={cores.sucesso} />
          <Text style={styles.matriculadoTexto}>Você está matriculado. Bons estudos!</Text>
        </View>
      );
    }
    if (curso!.assinatura) {
      return (
        <View style={styles.caixa}>
          <Text style={styles.caixaTexto}>
            Incluso no seu plano <Text style={styles.negrito}>{curso!.assinatura.plano}</Text>
            {' '}(válido até {data(curso!.assinatura.dataFim)})
          </Text>
          <Botao titulo="Matricular-se" onPress={matricularComAssinatura} carregando={matriculando} />
        </View>
      );
    }
    return (
      <View style={styles.caixa}>
        <Text style={styles.caixaTexto}>Assine um plano para ter acesso a este e a todos os cursos.</Text>
        <Botao
          titulo="Matricular-se"
          onPress={() => navigation.navigate('Pagamento', { idCurso: curso!.id, titulo: curso!.titulo })}
        />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <Estado pronto={!!curso} erro={erro} onTentar={recarregar}>
        {() => (
          <ScrollView contentContainerStyle={styles.conteudo}>
            <View style={styles.topo}>
              <Text style={styles.categoria}>{curso!.categoria} · {curso!.nivel}</Text>
              <Text style={styles.titulo}>{curso!.titulo}</Text>
              <Text style={styles.descricao}>{curso!.descricao}</Text>
              <Text style={styles.info}>
                Instrutor: {curso!.instrutor} · {curso!.totalAulas} aulas · {curso!.totalHoras}h
              </Text>
            </View>

            {renderMatricula()}

            <Text style={styles.secao}>Conteúdo do curso</Text>
            {curso!.modulos.length === 0 && <Text style={styles.info}>Nenhum módulo cadastrado ainda.</Text>}
            {curso!.modulos.map((modulo) => (
              <View key={modulo.id} style={styles.modulo}>
                <Text style={styles.moduloTitulo}>
                  Módulo {modulo.ordem} · {modulo.titulo}
                </Text>
                {modulo.aulas.map((aula) => (
                  <TouchableOpacity
                    key={aula.id}
                    style={styles.aula}
                    disabled={!curso!.matriculado}
                    onPress={() => navigation.navigate('Aula', { id: aula.id })}
                  >
                    <Ionicons
                      name={curso!.matriculado ? iconeTipo[aula.tipoConteudo] ?? 'book' : 'lock-closed'}
                      size={20}
                      color={curso!.matriculado ? cores.primaria : cores.cinza}
                    />
                    <Text style={styles.aulaTitulo}>{aula.titulo}</Text>
                    <Text style={styles.aulaDuracao}>{aula.duracaoMinutos} min</Text>
                  </TouchableOpacity>
                ))}
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
  conteudo: { padding: 20, gap: 14 },
  topo: { gap: 6 },
  categoria: { color: cores.primaria, fontWeight: '600' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto },
  descricao: { fontSize: 15, color: cores.texto },
  info: { color: cores.textoSuave },
  caixa: { ...cartao, padding: 16, gap: 12 },
  caixaTexto: { color: cores.texto },
  negrito: { fontWeight: 'bold' }, // Text aninhado: herda o resto do estilo do pai
  matriculado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: cores.sucessoClaro,
  },
  matriculadoTexto: { color: cores.sucesso, fontWeight: '600' },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  modulo: { ...cartao, overflow: 'hidden' },
  moduloTitulo: { padding: 14, fontWeight: 'bold', color: cores.primariaEscura, backgroundColor: cores.primariaClara },
  aula: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  aulaTitulo: { flex: 1, color: cores.texto },
  aulaDuracao: { color: cores.textoSuave, fontSize: 12 },
});
