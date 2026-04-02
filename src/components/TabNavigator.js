import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
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
const AdminStack = createNativeStackNavigator();
const FamiliesStack = createNativeStackNavigator();

// Stack para a área administrativa
function AdminStackNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ 
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <AdminStack.Screen name="AdminHome" component={AdminScreen} options={{ title: 'Painel Administrativo' }} />
      <AdminStack.Screen name="UserForm" component={UserFormScreen} options={{ title: 'Cadastrar Agente' }} />
    </AdminStack.Navigator>
  );
}

function FamiliesStackNavigator() {
  return (
    <FamiliesStack.Navigator screenOptions={{ headerShown: false }}>
      <FamiliesStack.Screen name="FamiliesList" component={FamiliesScreen} />
      <FamiliesStack.Screen name="FamilyDetail" component={FamilyDetailScreen} />
      <FamiliesStack.Screen name="FamilyForm" component={FamilyFormScreen} />
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
        tabBarStyle: {
          height: Platform.OS === 'android' ? 100 : 60, 
          // O paddingBottom garante que o ícone e o texto subam um pouco
          paddingBottom: Platform.OS === 'android' ? 40 : 10,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'android' ? 4 : 0,
        }
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