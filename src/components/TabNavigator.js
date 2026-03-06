import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import FamiliesScreen from "../screens/FamiliesScreen/";
import VisitsScreen from "../screens/VisitsScreen/";

const Tab = createBottomTabNavigator();

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
        tabBarActiveTintColor: "#ff3c3c",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Familias" component={FamiliesScreen} />
      <Tab.Screen name="Visitas" component={VisitsScreen}/>
    </Tab.Navigator>
  );
}