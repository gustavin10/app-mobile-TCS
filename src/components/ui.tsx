import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../styles/theme';
import type { Curso } from '../types';

// Mostra "carregando" ou a mensagem de erro; senão renderiza o conteúdo
export function Estado({
  pronto, erro, onTentar, children,
}: { pronto: boolean; erro: string | null; onTentar: () => void; children: () => ReactNode }) {
  if (erro && !pronto) {
    return (
      <View style={styles.centro}>
        <Ionicons name="cloud-offline-outline" size={48} color={cores.cinza} />
        <Text style={styles.erro}>{erro}</Text>
        <Botao titulo="Tentar de novo" onPress={onTentar} />
      </View>
    );
  }
  if (!pronto) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }
  return <>{children()}</>;
}

export function Botao({
  titulo, onPress, carregando, cor = cores.primaria,
}: { titulo: string; onPress: () => void; carregando?: boolean; cor?: string }) {
  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: cor }, carregando && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={carregando}
    >
      {carregando ? <ActivityIndicator color={cores.branco} /> : <Text style={styles.botaoTexto}>{titulo}</Text>}
    </TouchableOpacity>
  );
}

export function CursoCard({ curso, onPress }: { curso: Curso; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.capa}>
        <Ionicons name="school" size={28} color={cores.branco} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.categoria}>{curso.categoria} · {curso.nivel}</Text>
        <Text style={styles.titulo}>{curso.titulo}</Text>
        <Text style={styles.info}>
          {curso.instrutor} · {curso.totalAulas} aulas · {curso.totalHoras}h
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={cores.cinza} />
    </TouchableOpacity>
  );
}

export function Vazio({ icone, texto }: { icone: keyof typeof Ionicons.glyphMap; texto: string }) {
  return (
    <View style={styles.vazio}>
      <Ionicons name={icone} size={48} color={cores.cinza} />
      <Text style={styles.vazioTexto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  erro: { textAlign: 'center', color: cores.texto },
  botao: {
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: cores.branco,
  },
  capa: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoria: { fontSize: 12, color: cores.primaria, fontWeight: '600' },
  titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  info: { fontSize: 12, color: '#636e72' },
  vazio: { alignItems: 'center', gap: 8, padding: 40 },
  vazioTexto: { color: '#636e72', textAlign: 'center' },
});
