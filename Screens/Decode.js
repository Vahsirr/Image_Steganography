import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { NativeModules } from 'react-native';
import { useState } from 'react';


const Decode = () => {

  const [message, setmessage] = useState(null);
  const [decodeButtonClicked, setDecodeButtonClicked] = useState(false);
  const [isdecode, setIsDecoded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const imagePath = route.params?.imagePath;
  console.log(imagePath);
  const { LSBSteganography } = NativeModules;


  //const imageSlice = imagePath.slice(7);

  const handleDecodeButtonClick = () => {
    setDecodeButtonClicked(true);
    setIsDecoded(true);
    LSBSteganography.decodeMessage(imagePath.slice(7))
      .then((result) => {
        if (result) {
          const text = result;
          //const trimmedText = text.replace(/^\s+|\s+$/g, "").replace(/[^a-zA-Z0-9\s!@#_-$%^&*()+=/`~|<>,.?:;'"]+/g, "");
          setmessage(text);
          console.log(result);
          setIsDecoded(false);
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
        } else {
          setmessage("no message found")
          setIsDecoded(false);
        }
      })
      .catch((error) => console.log(error));
  }




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Decode Image</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DecodeGallery')}>
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>
      </View>
      <View>
        {imagePath ? (
          <Image source={{ uri: imagePath }} style={styles.image} />
        ) : (
          <Text style={styles.noImage}>No image to Decode</Text>
        )}
        {decodeButtonClicked && message !== null ? (
          <View style={styles.extractedTextContainer}>
            <Text style={styles.extractedText}>{message}</Text>
          </View>
        ) : (
          decodeButtonClicked && <Text>No message found</Text>
        )}
      </View>
      <View>
        {isdecode ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleDecodeButtonClick} disabled={!imagePath}>
            <Text style={styles.buttonText}>Decode</Text>
          </TouchableOpacity>
        )}
        {showMessage && (
          <View style={styles.popup}>
            <Text style={styles.popupText}>Message Decoded!</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default Decode

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3DEBA',
  },
  image: {
    width: 400,
    height: 500,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#443C68',
    width: 200,
    height: 50,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  extractedTextContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extractedText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
  },
  noImage: {
    color: 'black',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: 'black',
  },
  popup: {
    position: 'absolute',
    top:-750,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  popupText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'black'
  },
})