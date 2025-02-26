import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity,ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import ImageResizer from 'react-native-image-resizer';

const EncodeGallery = () => {

  const navigation = useNavigation();
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPhotos()
  }, [page]);

  const loadPhotos = () => {
    setLoading(true);
    CameraRoll.getPhotos({ first: 50, after: photos.length.toString(), assetType: 'Photos' })
      .then((response) => {
        console.log(response.edges);
        setPhotos(photos.concat(response.edges));
        setLoading(false); 
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const renderPhotos = ({ item }) => {
    console.log("items:  " + item.node.image.uri);

    // const compressImage = async (uri) => {
    //   const resizedImageUri = await ImageResizer.createResizedImage(
    //     uri,
    //     1200, // new width
    //     700, // new height
    //     'PNG',// format
    //     100, // quality
    //     0, // rotation
    //     null // output path (null for temporary file)
    //   );
    //   return resizedImageUri.uri;
    // };

    return (
      <TouchableOpacity onPress={() => {
        navigation.navigate('Encode', { imagePath: item.node.image.uri });
        // compressImage(item.node.image.uri).then(uri => {
        //   navigation.navigate('Encode', { imagePath: uri });
        // });
      }}>
        <Image source={{ uri: item.node.image.uri }} style={styles.image} />
      </TouchableOpacity>
    )
  };

  const handleEndReached = () => {
    console.log("End reached, loading more photos");
    setPage(page + 1); // increment page number
    loadPhotos(); // load more photos
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
        data={photos}
        numColumns={3}
        renderItem={renderPhotos}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.imageContainer}
      />
       {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  )
}

export default EncodeGallery

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F6F9'
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',

    textAlign: 'center',
  },
  image: {
    width: 140,
    height: 140,
    marginVertical:5,
    marginHorizontal:5,
  },
  imageContainer: {
    justifyContent: 'space-evenly',
  },
})