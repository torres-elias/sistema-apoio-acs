import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
container:{
  flex:1,
  backgroundColor:"#f4f4f4"
},

header:{
  backgroundColor:"#2f80c1",
  height:80,
  flexDirection:"row",
  alignItems:"center",
  justifyContent:"space-between",
  paddingTop:20,
  paddingLeft:10,
  paddingRight:10
},

statsContainer:{
  flexDirection:"row",
  flexWrap:"wrap",
  backgroundColor:"#fff"
},

statBox:{
  width:"50%",
  padding:15,
  borderWidth:0.5,
  borderColor:"#ddd"
},

statNumber:{
  fontSize:18,
  fontWeight:"bold"
},

statLabel:{
  fontSize:12,
  color:"#666"
},

sectionTitle:{
  marginTop:15,
  marginLeft:15,
  fontWeight:"bold",
  color:"#777",
  textAlign:"center"
},

grid:{
  flexDirection:"row",
  flexWrap:"wrap",
  padding:10
},

card:{
  width:"48%",
  backgroundColor:"#ebebeb",
  margin:"1%",
  padding:20,
  alignItems:"right",
  borderRadius:6,
  elevation:2
},

cardText:{
  marginTop:10,
  color:"fff"
},

profileBox:{
  backgroundColor:"#fff",
  margin:10,
  padding:15,
  borderRadius:6
},

logo:{
  width:40,
  height:40,
  marginRight:10,
},

logoutButton:{
  backgroundColor:"#b9b6b725",
  borderRadius:8,
},

infoView:{
  backgroundColor:"#2f80c1",
  flexDirection:"row",
  justifyContent:"space-around",
  paddingVertical:5

},
infoCard:{
  backgroundColor:"#b9b6b725",
  borderRadius:16,
  allingItems:"center",
  justifyContent:"center",
  padding:15,
  margin:10
},
infoCardText:{
  textAlign:"center",
  color:"#fff",
},

cardImage:{
  width:50,
  height:50,
},
profileCard:{
  flexDirection:"row",
  justifyContent:"space-between",
  paddingVertical:15,
  borderBottomWidth:0.5,
  borderColor:"#ddd",
},
profileCardNumber:{
  borderRadius:10,
  paddingHorizontal:5,
  paddingVertical:3,
  alignSelf:"flex-start",
  alignItems: "center",
  justifyContent: "center"
}
});

export default styles;