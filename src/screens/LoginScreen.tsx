import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../styles/theme';
import { avisar } from '../utils/avisar';
import type { StackParamList } from '../navigation/types';
import { login } from '../services/api';
import { iniciarSessao } from '../services/sessao';

type Props = NativeStackScreenProps<StackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha) {
      avisar('Informe e-mail e senha');
      return;
    }
    setCarregando(true);
    try {
      const { access_token, usuario } = await login(email, senha);
      iniciarSessao(access_token, usuario);
      navigation.replace('Principal');
    } catch (e) {
      avisar('Não foi possível entrar', (e as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topo}>
        <View style={styles.logo}>
          <Ionicons name="school" size={44} color={cores.primaria} />
        </View>
        <Text style={styles.titulo}>GM Cursos</Text>
        <Text style={styles.subtitulo}>Aprenda no seu ritmo</Text>
      </View>

      <View style={styles.painel}>
        <Text style={styles.painelTitulo}>Entrar</Text>
        <Text style={styles.painelSubtitulo}>Use seu e-mail e senha</Text>

        <View style={styles.campo}>
          <Ionicons name="mail-outline" size={20} color={cores.textoSuave} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor={cores.cinza}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.campo}>
          <Ionicons name="lock-closed-outline" size={20} color={cores.textoSuave} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={cores.cinza}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={cores.branco} />
            : <Text style={styles.botaoTexto}>ENTRAR</Text>}
        </TouchableOpacity>

        <View style={styles.rodape}>
          <Text style={{ color: cores.textoSuave }}>Não tem conta? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Registro')}>
            Cadastre-se
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.primaria },
  topo: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6, paddingTop: 40 },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: { fontSize: 30, fontWeight: 'bold', color: cores.branco },
  subtitulo: { color: cores.branco, opacity: 0.85 },
  painel: {
    backgroundColor: cores.branco,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  painelTitulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto },
  painelSubtitulo: { color: cores.textoSuave, marginBottom: 8 },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: '#FAFAFA',
  },
  input: { flex: 1, height: '100%', color: cores.texto },
  botao: {
    height: 52,
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  rodape: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  link: { color: cores.primaria, fontWeight: 'bold' },
});
