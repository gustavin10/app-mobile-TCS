import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackParamList } from '../navigation/types';
import { listarPlanos, matricular } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { Botao, Estado } from '../components/ui';
import { cores } from '../styles/theme';
import { moeda } from '../utils/formatar';
import { avisar } from '../utils/avisar';

type Props = NativeStackScreenProps<StackParamList, 'Pagamento'>;

const metodos = [
  { nome: 'Pix', icone: 'qr-code-outline' },
  { nome: 'Cartão de Crédito', icone: 'card-outline' },
  { nome: 'Boleto', icone: 'barcode-outline' },
] as const;

// Escolhe o plano e a forma de pagamento. A API cria Assinatura + Pagamento + Matrícula
// (os mesmos registros que aparecem no Financeiro e em Matrículas do sistema web).
export default function PagamentoScreen({ route, navigation }: Props) {
  const { idCurso, titulo } = route.params;
  const { dados: planos, erro, recarregar } = useCarregar(listarPlanos);
  const [idPlano, setIdPlano] = useState<number | null>(null);
  const [metodo, setMetodo] = useState<string>('Pix');
  const [cartao, setCartao] = useState('');
  const [carregando, setCarregando] = useState(false);

  const plano = planos?.find((p) => p.id === idPlano);

  async function confirmar() {
    if (!plano) {
      avisar('Escolha um plano');
      return;
    }
    if (metodo === 'Cartão de Crédito' && cartao.replace(/\D/g, '').length < 16) {
      avisar('Informe os 16 números do cartão');
      return;
    }
    setCarregando(true);
    try {
      const { pagamento } = await matricular(idCurso, plano.id, metodo);
      avisar(
        'Matrícula confirmada! 🎉',
        pagamento
          ? `Pagamento de ${moeda(pagamento.valorPago)} aprovado.\nTransação: ${pagamento.idTransacaoGateway}`
          : 'Curso liberado.',
      );
      navigation.goBack();
    } catch (e) {
      avisar('Não foi possível concluir', (e as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Estado pronto={!!planos} erro={erro} onTentar={recarregar}>
      {() => (
        <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <View style={styles.resumo}>
            <Text style={styles.rotulo}>Matrícula no curso</Text>
            <Text style={styles.titulo}>{titulo}</Text>
          </View>

          <Text style={styles.secao}>1. Escolha o plano</Text>
          {planos!.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.opcao, idPlano === p.id && styles.opcaoAtiva]}
              onPress={() => setIdPlano(p.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.opcaoTitulo}>{p.nome}</Text>
                <Text style={styles.opcaoDescricao}>{p.descricao}</Text>
              </View>
              <Text style={styles.preco}>{moeda(p.preco)}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.secao}>2. Forma de pagamento</Text>
          {metodos.map((m) => (
            <TouchableOpacity
              key={m.nome}
              style={[styles.opcao, metodo === m.nome && styles.opcaoAtiva]}
              onPress={() => setMetodo(m.nome)}
            >
              <Ionicons name={m.icone} size={22} color={metodo === m.nome ? cores.primaria : cores.texto} />
              <Text style={[styles.opcaoTitulo, { flex: 1 }]}>{m.nome}</Text>
              <Ionicons
                name={metodo === m.nome ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={metodo === m.nome ? cores.primaria : cores.cinza}
              />
            </TouchableOpacity>
          ))}

          {metodo === 'Cartão de Crédito' && (
            <TextInput
              style={styles.input}
              placeholder="Número do cartão"
              keyboardType="number-pad"
              maxLength={19}
              value={cartao}
              onChangeText={setCartao}
            />
          )}
          <Text style={styles.dica}>Pagamento simulado: é aprovado na hora.</Text>

          <Botao
            titulo={plano ? `Pagar ${moeda(plano.preco)}` : 'Escolha um plano'}
            onPress={confirmar}
            carregando={carregando}
            cor="#00b894"
          />
        </ScrollView>
      )}
    </Estado>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, gap: 12 },
  resumo: { padding: 16, gap: 4, borderRadius: 12, backgroundColor: cores.branco },
  rotulo: { color: '#636e72' },
  titulo: { fontSize: 18, fontWeight: 'bold', color: cores.texto },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginTop: 8 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: cores.branco,
  },
  opcaoAtiva: { borderColor: cores.primaria },
  opcaoTitulo: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  opcaoDescricao: { color: '#636e72', fontSize: 12 },
  preco: { fontWeight: 'bold', color: '#00b894', fontSize: 16 },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    backgroundColor: cores.branco,
  },
  dica: { color: '#636e72' },
});
