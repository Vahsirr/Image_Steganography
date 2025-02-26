import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Footer = () => {
  return (
    <View style={styles.Footer}>
      <Text style={styles.copyrightTextStyle}>@2023 Rishav Mukherjee</Text>
    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
    Footer:{
        height:50,
        backgroundColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center',
    },
    copyrightTextStyle:{
        color:'black',
        opacity:0.4,
    },
})