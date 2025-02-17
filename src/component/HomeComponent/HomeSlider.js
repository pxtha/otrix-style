import React, { useMemo } from 'react';
import { View, StyleSheet, Image, Dimensions, I18nManager } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: screenWidth } = Dimensions.get('window')
import Carousel from 'react-native-reanimated-carousel';
const width = Dimensions.get('window').width;

function Slider(props) {
    const images = useMemo(() => {
        if (!props.images) return [];
        return props.images.map((v, index) => ({ image: v, id: index }))
    }, [props])

    const viewCount = 5;

    let snapDirection = 'left';

    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                style={{
                    width: '100%',
                    height: 180,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                width={width}
                height={width / 2}
                pagingEnabled={true}
                snapEnabled={true}
                mode={"horizontal-stack"}
                autoPlay={true}
                autoPlayReverse={I18nManager.isRTL == true ? true : false}
                modeConfig={{
                    snapDirection,
                    stackInterval: 2000,
                }}
                customConfig={() => ({ type: 'positive', viewCount })}
                data={images}
                scrollAnimationDuration={2000}
                renderItem={({ item, index }) => (
                    <View
                        key={item.id}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Image source={{ uri: item.image }} resizeMode="contain" style={{ height: hp('100%'), width: '100%' }} />
                    </View>
                )}
            />


        </View>


    )
}

export default HomeSlider = React.memo(Slider);

const styles = StyleSheet.create({
    item: {
        width: screenWidth - 55,
        height: screenWidth - 220,
        right: wp('3.5%'),
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
        marginHorizontal: wp('1.5%')

    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    }
})
