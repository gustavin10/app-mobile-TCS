import { useEffect, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MeusCursosScreen from '../screens/MeusCursosScreen';
import NotificacoesScreen from '../screens/NotificacoesScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { cores } from '../styles/theme';
import { avisar } from '../utils/avisar';
import { listarNotificacoes } from '../services/api';
import { getToken } from '../services/sessao';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type NomeIcone = keyof typeof Ionicons.glyphMap;

const icones: Record<keyof TabParamList, { ativo: NomeIcone; inativo: NomeIcone }> = {
  'Início': { ativo: 'home', inativo: 'home-outline' },
  'Meus Cursos': { ativo: 'book', inativo: 'book-outline' },
  'Notificações': { ativo: 'notifications', inativo: 'notifications-outline' },
  Perfil: { ativo: 'person', inativo: 'person-outline' },
};

// Consulta o serviço de notificações a cada 5s.
// Quando chega uma notificação nova (ex.: boas-vindas vinda do Kafka), mostra um alerta.
function useNotificacoesNaoLidas() {
  const [naoLidas, setNaoLidas] = useState(0);
  const jaMostradas = useRef(new Set<number>());

  useEffect(() => {
    let ativo = true;

    async function verificar() {
      try {
        const lista = await listarNotificacoes();
        if (!ativo) return;
        const pendentes = lista.filter((n) => !n.lida);
        setNaoLidas(pendentes.length);

        const nova = pendentes.find((n) => !jaMostradas.current.has(n.id));
        pendentes.forEach((n) => jaMostradas.current.add(n.id));
        if (nova) avisar(nova.titulo, nova.mensagem);
      } catch {
        // serviço de notificações fora do ar: tenta de novo no próximo ciclo
      }
    }

    verificar();
    const timer = setInterval(verificar, 5000);
    return () => {
      ativo = false;
      clearInterval(timer);
    };
  }, []);

  return naoLidas;
}

export default function TabRoutes({ navigation }: NativeStackScreenProps<StackParamList, 'Principal'>) {
  const logado = !!getToken();

  // Sem sessão (ex.: página recarregada na versão web): volta para o login
  useEffect(() => {
    if (!logado) navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [logado, navigation]);

  if (!logado) return null;
  return <Abas />;
}

function Abas() {
  const naoLidas = useNotificacoesNaoLidas();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.cinza,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? icones[route.name].ativo : icones[route.name].inativo}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Meus Cursos" component={MeusCursosScreen} />
      <Tab.Screen
        name="Notificações"
        component={NotificacoesScreen}
        options={{ tabBarBadge: naoLidas > 0 ? naoLidas : undefined }}
      />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
