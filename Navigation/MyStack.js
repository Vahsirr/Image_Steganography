import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Encode from '../Screens/Encode'
import Camera from '../Screens/Camera'
import EncodeGallery from '../Screens/EncodeGallery'
import Start from '../Screens/Start'
import Decode from '../Screens/Decode'
import DecodeGallery from '../Screens/DecodeGallery'
import Home from '../Screens/Home'
import { createStackNavigator } from '@react-navigation/stack';


const MyStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Start" component={Start} options={{headerShown:false}}/>
      <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
      <Stack.Screen name="Decode" component={Decode} options={{headerShown:false}}/>
      <Stack.Screen name="Encode" component={Encode} options={{headerShown:false}} />
      <Stack.Screen name="Camera" component={Camera} options={{headerShown:false}} />
      <Stack.Screen name="EncodeGallery" component={EncodeGallery} options={{headerShown:false}} />
      <Stack.Screen name="DecodeGallery" component={DecodeGallery} options={{headerShown:false}}/>
    </Stack.Navigator>
  )
}

export default MyStack

const styles = StyleSheet.create({})