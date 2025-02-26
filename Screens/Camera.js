import { StyleSheet, Text, View, TouchableOpacity,Alert,ActivityIndicator} from 'react-native'
import React,{useState} from 'react'
import { RNCamera } from 'react-native-camera'
import { useCamera } from 'react-native-camera-hooks'
import RNFS from 'react-native-fs'
import { useNavigation } from '@react-navigation/native'
import { CameraRoll } from '@react-native-camera-roll/camera-roll';


const Camera = () => {

  const [{ cameraRef }, { takePicture }] = useCamera(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const captureHandle = async (item) => {
    try {
      setIsLoading(true);
      const data = await takePicture();
      console.log(data.uri);
      const filePath = data.uri;
      const newFilePath = RNFS.ExternalDirectoryPath + '/MyTest.jpg';
      RNFS.moveFile(filePath, newFilePath)
        .then(() => {
          console.log('IMAGE MOVED', filePath, '..to..', newFilePath);
          CameraRoll.save(newFilePath,{type:'photo'})
          .then((result)=>{
            console.log("Image Saved to gallery");
            navigation.navigate('Home');
            console.log(result);
            setIsLoading(false);
            Alert.alert(
              'Image Saved',
              'The image has been saved to your gallery. Would you like to open your gallery?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
                },
                { text: 'Open Gallery', onPress: () => {navigation.navigate('EncodeGallery')} }
              ]
            );
          })
          .catch(error=>{
            console.log("Error saving the image");
            console.log(error);
            setIsLoading(false);
          })
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false);
        })
    }
    catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.body}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={styles.preview}>
        <TouchableOpacity style={styles.capture} onPress={() => { captureHandle() }}>
        <View style={styles.captureButton} />
        </TouchableOpacity>
      </RNCamera>
      {isLoading && <ActivityIndicator size="large" style={styles.activityIndicator} />}
    </View>
  )
}

export default Camera

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  capture: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0)',
  }
})