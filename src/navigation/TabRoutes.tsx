import { View, Text } from 'react-native';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { cores } from '../styles/theme';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type NomeIcone = keyof typeof Ionicons.glyphMap;

const icones: Record<keyof TabParamList, { ativo: NomeIcone; inativo: NomeIcone }> = {
  'Início': { ativo: 'home', inativo: 'home-outline' },
  Busca: { ativo: 'search', inativo: 'search-outline' },
  Pedidos: { ativo: 'receipt', inativo: 'receipt-outline' },
  Perfil: { ativo: 'person', inativo: 'person-outline' },
};

function EmConstrucao({ route }: BottomTabScreenProps<TabParamList>) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tela {route.name} em construção</Text>
    </View>
  );
}

export default function TabRoutes() {
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
      <Tab.Screen name="Busca" component={EmConstrucao} />
      <Tab.Screen name="Pedidos" component={EmConstrucao} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
