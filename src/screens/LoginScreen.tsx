import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../styles/theme';
import type { StackParamList } from '../navigation/types';
import { entrar } from '../services/usuarios';

type Props = NativeStackScreenProps<StackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleLogin() {
    // TODO: integrar com a API (POST /auth/login)
    const usuario = entrar(email);

    navigation.replace('Principal', {
      screen: 'Perfil',
      params: { nome: usuario.nome, email: usuario.email },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.cabecalho}>
        <View style={styles.logo}>
          <Text style={styles.logoTexto}>A</Text>
        </View>
        <Text style={styles.titulo}>Bem-vindo!</Text>
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

        <Text style={styles.esqueci}>Esqueci a senha</Text>

        <TouchableOpacity style={styles.botao} onPress={handleLogin}>
          <Text style={styles.botaoTexto}>ENTRAR</Text>
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
  logoTexto: { color: cores.branco, fontSize: 36, fontWeight: 'bold' },
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
  esqueci: {
    alignSelf: 'flex-end',
    color: cores.primaria,
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
