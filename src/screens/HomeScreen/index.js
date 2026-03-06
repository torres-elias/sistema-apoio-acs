import { View, Text, TouchableOpacity, ScrollView, Image} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import styles from './style';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View>
        <View style={styles.header}>
            <Text style={{color:"#fff"}}>Olá, Elias</Text>
            <TouchableOpacity onPress={() => alert("Logout")} style={styles.logoutButton}>
            <Ionicons name="log-out" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
        <View style={styles.infoView}>
            <TouchableOpacity style={styles.infoCard}>
                <Text style={styles.infoCardText}>5</Text>
                <Text style={styles.infoCardText}>Familias</Text>
                <Text style={styles.infoCardText}>2 Visitadas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoCard}>
                <Text style={styles.infoCardText}>10</Text>
                <Text style={styles.infoCardText}>Indivíduos</Text>
                <Text style={styles.infoCardText}>0 Visitados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoCard}>
                <Text style={styles.infoCardText}>3</Text>
                <Text style={styles.infoCardText}>Vistas/Mês</Text>
                <Text style={styles.infoCardText}>Março 2026</Text>
            </TouchableOpacity>
        </View>
        </View>
        <ScrollView>
        {/* ACESSOS RAPIDOS */}
        <Text style={styles.sectionTitle}>ACESSOS RÁPIDOS</Text>

        <View style={styles.grid}>

            <TouchableOpacity style={styles.card}>
                <FontAwesome5 name="home" size={30} color="#000000"/>
                <Text style={styles.cardText}>Familias</Text>
                <Text style={styles.cardText}>5 cadastradas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
            <FontAwesome5 name="calendar-alt" size={30} color="#000000"/>
            <Text style={styles.cardText}>Visitas</Text>
            <Text style={styles.cardText}>3 este mês</Text>
            </TouchableOpacity>


        </View>

        {/* PERFIL */}
        <Text style={styles.sectionTitle}>PERFIL DE TRABALHO</Text>

            <View style={styles.profileBox}>
                <TouchableOpacity style={styles.profileCard}>
                    <FontAwesome5 name="heartbeat" size={30} color="#ff3c3c"/>
                    <Text>Hipertensos</Text>
                    <View style={[styles.profileCardNumber,{backgroundColor:"#ff3c3c22"}]}>
                        <Text style={{color:"#ff3c3c"}}>5</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileCard}>
                    <FontAwesome5 name="tint" size={30} color="#ff3cce"/>
                    <Text>Diabéticos</Text>
                    <View style={[styles.profileCardNumber,{backgroundColor:"#ff3cce22"}]}>
                        <Text style={{color:"#ff3cce"}}>7</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileCard}>
                    <FontAwesome5 name="female" size={30} color="#ff7ab6"/>
                    <Text>Gestantes</Text>
                    <View style={[styles.profileCardNumber,{backgroundColor:"#ff7ab622"}]}>
                        <Text style={{color:"#ff7ab6"}}>10</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileCard}>
                    <FontAwesome5 name="child" size={30} color="#4c8dff"/>
                    <Text>Crianças até 12 anos</Text>
                    <View style={[styles.profileCardNumber,{backgroundColor:"#4c8dff22"}]}>
                        <Text style={{color:"#4c8dff"}}>81</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>

    </View>
  );
}