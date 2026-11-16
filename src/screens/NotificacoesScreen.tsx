import { FlatList, Text, TouchableOpacity, View, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarNotificacoes, marcarComoLida } from '../services/api';
import { useCarregar } from '../hooks/useCarregar';
import { Estado, Vazio } from '../components/ui';
import { cores } from '../styles/theme';
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
                <View style={{ flex: 1, gap: 2 }}>
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
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.texto,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: cores.branco,
  },
  lista: { padding: 20, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: cores.branco,
  },
  naoLida: { backgroundColor: '#ecebfd' },
  cardTitulo: { fontWeight: 'bold', color: cores.texto, fontSize: 15 },
  cardTexto: { color: cores.texto },
  cardData: { color: '#636e72', fontSize: 12 },
  ponto: { width: 10, height: 10, borderRadius: 5, backgroundColor: cores.primaria, marginTop: 4 },
});
