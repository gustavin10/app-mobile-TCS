import { FlatList, Text, TouchableOpacity, View, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarNotificacoes, marcarComoLida } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { Estado, Vazio } from '../components/ui';
import { cabecalhoVermelho, cartao, cores } from '../styles/theme';
import { data } from '../utils/formatar';

// Notificações geradas pelo serviço que consome o Kafka
export default function NotificacoesScreen() {
  const { dados, erro, carregando, recarregar } = useCarregar(listarNotificacoes);

  async function abrir(id: number) {
    await marcarComoLida(id).catch(() => null);
    recarregar();
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Notificações</Text>
      <Estado pronto={!!dados} erro={erro} onTentar={recarregar}>
        {() => (
          <FlatList
            data={dados!}
            keyExtractor={(n) => String(n.id)}
            contentContainerStyle={styles.lista}
            refreshControl={<RefreshControl refreshing={carregando} onRefresh={recarregar} />}
            ListEmptyComponent={<Vazio icone="notifications-off-outline" texto="Nenhuma notificação por aqui." />}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.card, !item.lida && styles.naoLida]} onPress={() => abrir(item.id)}>
                <Ionicons name="mail-unread-outline" size={24} color={cores.primaria} />
                <View style={styles.cardTextos}>
                  <Text style={styles.cardTitulo}>{item.titulo}</Text>
                  <Text style={styles.cardTexto}>{item.mensagem}</Text>
                  <Text style={styles.cardData}>{data(item.criadaEm)}</Text>
                </View>
                {!item.lida && <View style={styles.ponto} />}
              </TouchableOpacity>
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
  card: { ...cartao, flexDirection: 'row', gap: 12, padding: 14 },
  naoLida: { backgroundColor: cores.primariaClara, borderColor: '#F7C5CE' },
  cardTextos: { flex: 1, gap: 2 },
  cardTitulo: { fontWeight: 'bold', color: cores.texto, fontSize: 15 },
  cardTexto: { color: cores.texto },
  cardData: { color: cores.textoSuave, fontSize: 12 },
  ponto: { width: 10, height: 10, borderRadius: 5, backgroundColor: cores.primaria, marginTop: 4 },
});
