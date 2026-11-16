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
      <View style={styles.cabecalho}>
        <View style={styles.logo}>
          <Ionicons name="school" size={40} color={cores.branco} />
        </View>
        <Text style={styles.titulo}>GM Cursos</Text>
        <Text style={styles.subtitulo}>Faça login para continuar</Text>
      </View>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={cores.branco} />
            : <Text style={styles.botaoTexto}>ENTRAR</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.rodape}>
        <Text>Não tem conta? </Text>
        <Text style={styles.link} onPress={() => navigation.navigate('Registro')}>
          Cadastre-se
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 32,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: { fontSize: 26, fontWeight: 'bold', color: cores.texto },
  subtitulo: { color: cores.cinza },
  formulario: {
    gap: 12,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    backgroundColor: cores.branco,
  },
  botao: {
    height: 50,
    borderRadius: 10,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: { color: cores.primaria, fontWeight: 'bold' },
});
