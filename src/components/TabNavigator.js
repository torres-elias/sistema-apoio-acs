import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

import HomeScreen from "../screens/HomeScreen";
import FamiliesScreen from "../screens/FamiliesScreen";
import FamilyFormScreen from "../screens/FamilyFormScreen";
import FamilyDetailScreen from "../screens/FamilyDetailScreen";
import VisitsScreen from "../screens/VisitsScreen";
import AdminScreen from "../screens/AdminScreen";
import UserFormScreen from "../screens/UserFormScreen";
import COLORS from "../constants/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para a área administrativa
function AdminStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ 
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name="AdminHome" component={AdminScreen} options={{ title: 'Painel Administrativo' }} />
      <Stack.Screen name="UserForm" component={UserFormScreen} options={{ title: 'Cadastrar Agente' }} />
    </Stack.Navigator>
  );
}

function FamiliesStackNavigator() {
  return (
    <FamiliesStack.Navigator screenOptions={{ headerShown: false }}>
      <FamiliesStack.Screen name="FamiliesList" component={FamiliesScreen} />
      <FamiliesStack.Screen name="FamilyDetail" component={FamilyDetailScreen} />
      <FamiliesStack.Screen name="FamilyForm" component={FamilyFormScreen} />
      <FamiliesStack.Screen name="NovaVisita" component={NovaVisitaScreen} /> 
    </FamiliesStack.Navigator>
  );
}

export default function TabNavigator() {
  const { profile } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "Familias") iconName = "people";
          else if (route.name === "Visitas") iconName = "calendar";
          else if (route.name === "AdminTab") iconName = "shield-checkmark";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: { height: 60, paddingBottom: 10 }
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Familias" component={FamiliesStackNavigator} />
      <Tab.Screen name="Visitas" component={VisitsScreen} />
      
      {/* Exibição condicional da aba Admin */}
      {profile?.cargo === 'ADM' && (
        <Tab.Screen 
          name="AdminTab" 
          component={AdminStackNavigator} 
          options={{ title: 'Admin' }}
        />
      )}
    </Tab.Navigator>
  );
}