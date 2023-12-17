import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
  },
  chatFooter:{
    flex:0.1,
    marginTop:20,
    alignItems:'flex-start',
    // justifyContent:'space-between',
    flexDirection:'row',
    // backgroundColor:'gray',
    height:200,
    paddingTop:20,
    padding:20,
    paddingBottom:30,
    borderWidth:0.5,
    borderColor:'green'

  },
  textFooterChat:{
    textAlign:'right',
    position:'absolute',
    top:-10,
    right:-6,
    fontSize:12,
    marginLeft:10,
    color:'gray',
    backgroundColor:'#ffefef',
    paddingHorizontal:6,
    borderRadius:30
    
    // paddingBottom:30
  }
});

export default styles;
