import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TrilhaScreen from '../screens/TrilhaScreen';
import CursoScreen from '../screens/CursoScreen';
import AulaScreen from '../screens/AulaScreen';
import PagamentoScreen from '../screens/PagamentoScreen';
import TabRoutes from './TabRoutes';
import { cores } from '../styles/theme';
import type { StackParamList } from './types';

const Stack = createNativeStackNavigator<StackParamList>();

export default function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Registro" component={RegisterScreen} options={{ title: 'Cadastro' }} />
      <Stack.Screen name="Principal" component={TabRoutes} options={{ headerShown: false }} />
      <Stack.Screen name="Trilha" component={TrilhaScreen} options={({ route }) => ({ title: route.params.titulo })} />
      <Stack.Screen name="Curso" component={CursoScreen} options={{ title: 'Curso' }} />
      <Stack.Screen name="Aula" component={AulaScreen} options={{ title: 'Aula' }} />
      <Stack.Screen name="Pagamento" component={PagamentoScreen} options={{ title: 'Matrícula e pagamento' }} />
    </Stack.Navigator>
  );
}
