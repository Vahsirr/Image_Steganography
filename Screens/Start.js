import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Carousel, { Pagination } from 'react-native-snap-carousel';

const images = [
    require('../android/app/src/main/res/assets/Images/Picture1.jpg'),
    require('../android/app/src/main/res/assets/Images/Picture2.jpg'),
    require('../android/app/src/main/res/assets/Images/Picture3.jpg'),
    require('../android/app/src/main/res/assets/Images/Picture4.jpg'),
    require('../android/app/src/main/res/assets/Images/Picture5.jpg'),
    require('../android/app/src/main/res/assets/Images/Picture6.png'),
];

const Start = () => {

    const [activeIndex, setActiveIndex] = React.useState(0);
    const [loadingEncode, setLoadingEncode] = useState(false);
    const [loadingDecode, setLoadingDecode] = useState(false);
    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.imageContainer}>
                <Image source={item} style={styles.image} />
            </View>
        );
    };

    const handleEncode = () => {
        setLoadingEncode(true);
        setTimeout(() => {
            navigation.navigate('Home');
            setLoadingEncode(false);
        }, 100);
    }

    const handleDecode = () => {
        setLoadingDecode(true);
        setTimeout(() => {
            navigation.navigate('Decode');
            setLoadingDecode(false);
        }, 100);
    }



    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.Encrypting}>
                <TouchableOpacity style={styles.Buttons} onPress={handleEncode}>
                    {loadingEncode ? (
                        <View style={styles.activityIndicator}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    ) : (
                        <Text style={styles.ButtonsText}>Encode</Text>
                    )}
                </TouchableOpacity>
                <View style={styles.MessageView}>
                    <Text style={styles.ButtonMessage}>"CLICK HERE TO ENCODE MESSAGE"'</Text>
                </View>
            </View>
            <View style={styles.Encrypting}>
                <TouchableOpacity style={styles.Buttons} onPress={handleDecode}>
                    {loadingDecode ? (
                        <View style={styles.activityIndicator}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    ) : (
                        <Text style={styles.ButtonsText}>Decode</Text>
                    )}
                </TouchableOpacity>
                <View style={styles.MessageView}>
                    <Text style={styles.ButtonMessage}>"CLICK HERE TO ENCODE MESSAGE"'</Text>
                </View>
                <View>
                </View>
            </View>
            <View style={styles.informationContainer}>
                <Text style={styles.informationText}>-Some Information About Image Steganography-</Text>
            </View>
            <View>
                <Carousel
                    data={images}
                    renderItem={_renderItem}
                    layout={'stack'}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    sliderWidth={450}
                    itemWidth={400}
                />
                <Pagination
                    dotsLength={images.length}
                    activeDotIndex={activeIndex}
                    containerStyle={styles.paginationContainer}
                    dotStyle={styles.dot}
                    inactiveDotStyle={styles.inactiveDot}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                />
            </View>
        </View >
    )
}

export default Start

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3DEBA'
    },
    Encrypting: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Buttons: {
        backgroundColor: '#443C68',
        width: 150,
        height: 150,
        borderRadius: 300,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ButtonsText: {
        fontSize: 30,
    },
    ButtonMessage: {
        fontStyle: 'italic',
        fontWeight: '600',
        color:'#4D455D'
    },
    MessageView: {
        padding: 10
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 300,
    },
    paginationContainer: {
        paddingVertical: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'blue',
    },
    inactiveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
    },
    informationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    informationText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})