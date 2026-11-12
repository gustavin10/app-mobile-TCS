import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
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
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Registro" component={RegisterScreen} options={{ title: 'Cadastro' }} />
      <Stack.Screen name="Principal" component={TabRoutes} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
