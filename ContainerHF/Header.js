import { StyleSheet, View,Image } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.header}>
      <Image style={styles.logoStyle} source={require('../android/app/src/main/res/assets/Images/HideMySecrets.png')}/>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    header:{
        height:70,
        backgroundColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center',
    },
    logoStyle:{
        height:50,
        width:150
    }
})