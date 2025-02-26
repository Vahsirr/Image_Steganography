import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import MyStack from './Navigation/MyStack'
import Header from './ContainerHF/Header'
import Footer from './ContainerHF/Footer'

const hideMySecrets = () => {
  return (
    <NavigationContainer>
      <Header/>
      <MyStack/>
      <Footer/>
    </NavigationContainer>
  )
}

export default hideMySecrets

const styles = StyleSheet.create({})