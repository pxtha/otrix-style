import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@helpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CategoryDummy from './items/CategoryDummy';
import OtrixDivider from './OtrixComponent/OtrixDivider';
import Fonts from '@helpers/Fonts';

function CategoryView(props) {
    return (
        <>
            <OtrixDivider size={'sm'} />
            <FlatList
                style={{ padding: wp('0.4%') }}
                data={CategoryDummy}
                scrollEnabled={false}
                contentContainerStyle={{
                    flex: 1,
                }}
                horizontal={false}
                numColumns={2}
                onEndReachedThreshold={0.7}
                showsVerticalScrollIndicator={false}
                keyExtractor={(contact, index) => String(index)}
                renderItem={({ item, index }) =>
                    <TouchableOpacity key={index} style={styles.categoryBox} onPress={() => props.navigation.navigate('ProductListScreen', { title: item.name })}>
                        <View style={styles.imageView}>
                            <Image source={item.image} style={styles.image}
                            ></Image>
                        </View>
                        <View style={styles.infromationView}>
                            <Text style={styles.categoryName}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                }>
            </FlatList>
        </>


    )
}

export default CategoryView;

const styles = StyleSheet.create({
    categoryBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('25%'),
        width: wp('43%'),
        maxWidth: wp('44%'),
        marginHorizontal: wp('1.8%'),
        flex: 0.5,
        backgroundColor: Colors().white,
        marginBottom: wp('3%'),
        borderRadius: wp('2%'),
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        flexDirection: 'column',

    },
    imageView: {
        flex: 0.90,
        backgroundColor: Colors().ligth_white,
        // backgroundColor: Colors().themeYellow,
        width: wp('36.5%'),
        borderTopStartRadius: wp('2%'),
        borderTopEndRadius: wp('2%'),
        marginTop: hp('1.4%'),
        marginBottom: hp('1%')
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: hp('18%'),
        width: wp('36.5%')
    },
    infromationView: {
        flex: 0.15,
        width: wp('36%'),
        marginBottom: hp('1.4%')
    },
    categoryName: {
        textAlign: 'center',
        fontSize: wp('4.5%'),
        fontFamily: Fonts.Font_Bold,
    }
});