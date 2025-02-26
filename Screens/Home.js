import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';



const Home = () => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);

    useEffect(() => {
        getImages();
    }, []);

    const getImages = async () => {
        try {
            const { edges } = await CameraRoll.getPhotos({
                first: 20,
                assetType: 'Photos',
                groupName: 'Pictures',
            });
            setImages(edges);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderImage = ({ item }) => (
        <Image source={{ uri: item.node.image.uri }} style={styles.image} />
    );


    return (
        <View style={styles.container}>
            <View style={styles.Encrypting}>
                <View style={styles.ButtonAlign}>
                    <TouchableOpacity style={styles.Buttons} onPress={() => navigation.navigate('Camera')}>
                        <Text style={styles.ButtonsText}>Open Camera</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.ButtonAlign}>
                    <TouchableOpacity style={styles.Buttons} onPress={() => navigation.navigate('EncodeGallery')}>
                        <Text style={styles.ButtonsText}>Open Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View >
            <View style={styles.ButtonMessage}>
                <Text style={styles.ButtonMessage}>Previously Encoded Image</Text>
            </View>
            {
                isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                ) : (
                    <View style={styles.imagesContainer}>
                        <FlatList
                            horizontal
                            data={images}
                            renderItem={renderImage}
                            keyExtractor={(item) => item.node.image.uri}
                        />
                    </View>
                )
            }
        </View >
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3DEBA'
    },
    Encrypting: {
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    ButtonAlign: {
        padding: 70,
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
    ButtonsText: {
        fontSize: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagesContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        borderColor: 'black',
        borderWidth: 10,
        margin: 15,
    },
    image: {
        width: 300,
        height: 500,
        margin:10,
        resizeMode: 'center',
    },
    ButtonMessage: {
        alignItems:'center',
        justifyContent:'center',
        fontSize:20,
        fontStyle: 'italic',
        fontWeight: '600',
        color:'#4D455D'
    },
})