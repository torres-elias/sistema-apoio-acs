import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import FamiliesScreen from "../screens/FamiliesScreen";
import FamilyFormScreen from "../screens/FamilyFormScreen";
import FamilyDetailScreen from "../screens/FamilyDetailScreen";
import VisitsScreen from "../screens/VisitsScreen";
import COLORS from "../constants/colors";

const Tab = createBottomTabNavigator();
const FamiliesStack = createNativeStackNavigator();

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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Familias") {
            iconName = "people";
          } else if (route.name === "Visitas") {
            iconName = "calendar";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Familias" component={FamiliesStackNavigator} />
      <Tab.Screen name="Visitas" component={VisitsScreen} />
    </Tab.Navigator>
  );
}