import { StyleSheet, Text, View, Image, NativeModules, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';


const Encode = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [secretKey, setSecretKey] = useState('');
  const [saveSteganography, setsaveSteganography] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEncodedButton, setEncodedButton] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const imagePath = route.params?.imagePath;
  const [isEncoded, setIsEncoded] = useState(false);

  const { LSBSteganography } = NativeModules;

  const encodeImage = async () => {
    try {
      if (!imagePath) {
        console.error('Image path is not set or is null.');
        return;
      }
      setEncodedButton(true);
      const fileExists = await RNFS.exists(imagePath);
      setIsEncoded(true);
      if (!fileExists) {
        console.error(`File not found at path: ${imagePath}`);
        return;
      }

      if (!secretKey) {
        console.error('Secret key is not set.');
        return;
      }

      const stegoImageDirPath = RNFS.TemporaryDirectoryPath;
      const stegoImageFilePath = stegoImageDirPath + '/stego_image.png';
      console.log('Creating directory:', stegoImageDirPath);

      await RNFS.mkdir(stegoImageDirPath);
      console.log('Encoding image:', imagePath);

      const spacesToAdd = 34 - secretKey.length;
      const spaces = Array(spacesToAdd).fill(' ').join('');
      const secretKeyWithSpaces = secretKey + spaces;


      console.log('Secret key:', secretKey);
      console.log('Stego image file path:', stegoImageFilePath);
      const imageslice = imagePath.slice(7);
      await LSBSteganography.encodeMessage(secretKeyWithSpaces, imageslice, stegoImageFilePath)
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.error(error);
        });

      setsaveSteganography(stegoImageFilePath);
      setEncodedButton(false);

      console.log('Encoded image path:', stegoImageFilePath);
    } catch (error) {
      console.error('Error encoding image:', error);
      setEncodedButton(false);
    }
  };

  const saveImage = async () => {
    try {
      if (!saveSteganography) {
        console.error('Stego image path is not set or is null.');
        return;
      }
      setIsSaving(true);
      console.log('Saving image to CameraRoll:', saveSteganography);
      const savedImage = await CameraRoll.save(saveSteganography, { type: 'photo' });

      console.log('Saved image:', savedImage);
      setShowMessage(true);

      if (savedImage.length > 0) {
        setIsSaving(false);
      }
      setSaveButton(true);

    } catch (error) {
      console.error('Error saving image:', error);
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encode Image</Text>
      <View>
        {imagePath ? (
          <Image source={{ uri: imagePath }} style={styles.image} />
        ) : (
          <Text>No image to display</Text>
        )}
      </View>
      <View style={styles.Alignment}>
        <Text style={styles.label}>Secret Key :</Text>
        <TextInput style={styles.textInput} value={secretKey} placeholder='Enter the Sceret Message,' placeholderTextColor="#999" onChangeText={(text) => {
          if (text.length === 0) {
            setSecretKey('');
          } else if (text.length === 1) {
            setSecretKey('  ' + text)
          } else if (text.length <= 33) {
            setSecretKey(text);
          }
        }} />
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.ButtonAlign}>
          {isEncodedButton ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.Buttons} onPress={encodeImage} disabled={!imagePath || !secretKey || isEncoded}>
              {!isEncoded ? (
                <Text>Encode Image</Text>
              ) : (
                <Text>Encoded</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.ButtonAlign}>
          {isSaving ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.Buttons} onPress={saveImage} disabled={!imagePath || !secretKey || !isEncoded || saveButton}>
              {showMessage ? (
                <Text style={styles.popupText}>Saved</Text>
              ) : (
                <Text>Save</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        {/* <Button title='Move to Decode' onPress={() => navigation.navigate('Decode')} /> */}
      </View>
    </View>
  );
};


export default Encode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3DEBA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 80
  },
  image: {
    width: 400,
    height: 500,
    resizeMode: 'contain',
  },
  textInput: {
    height: 40,
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 16,
    color: '#444',
    fontSize: 16,
    fontWeight: '500',
    maxWidth: 200
  },
  Buttons: {
    backgroundColor: '#443C68',
    width: 100,
    height: 50,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  ButtonAlign: {
    paddingHorizontal: 70,
    paddingTop: 30,
  },
  Alignment: {
    flexDirection: 'row',
    margin: 25,
    padding: 20
  },
  label: {
    color: 'black',
    paddingRight: 40,
    marginTop: 10,
  },
});

