import React, { useMemo } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { GlobalStyles, Colors } from '@helpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import Fonts from '@helpers/Fonts';
import { categoryMapping } from '@component/items/CategoryMapping';
import { GET_CATEGORIES } from '@apis/queries';
import { useQuery } from "@apollo/client";

function HomeCategoryView(props) {
    loadImage = false;
    const { data } = useQuery(GET_CATEGORIES);

    const categories = useMemo(() => {
        if (!data) return [];
        return categoryMapping(data.categories.data)
    }, [data])

    return (
        <View>
            <View style={styles.catHeading} >
                <Text style={GlobalStyles.boxHeading}>{props.strings.homepage.label_category}</Text>
                <TouchableOpacity style={{ flex: 0.50 }} onPress={() => props.navigation.navigate('CategoryScreen')}>
                    <Text style={GlobalStyles.viewAll}>{props.strings.homepage.viewall}</Text>
                </TouchableOpacity>
            </View>
            <OtrixDivider size={'sm'} />
            <FlatList
                style={{ padding: wp('1%') }}
                data={categories}
                contentContainerStyle={{ paddingRight: wp('3%') }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onEndReachedThreshold={0.7}
                keyExtractor={(contact, index) => String(index)}
                renderItem={({ item, index }) =>
                    <TouchableOpacity style={styles.catBox} key={item.id} onPress={() => props.navigation.navigate('ProductListScreen', { title: item.name })}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.imageView}
                            ></Image>
                        </View>
                        <Text numberOfLines={2} style={styles.catName}>{item.name}</Text>
                    </TouchableOpacity>
                }>
            </FlatList>
        </View>

    )
}

export default HomeCategoryView;

const styles = StyleSheet.create({
    catHeading: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: hp('1%')
    },
    catBox: {
        height: hp('12.5%'),
        width: wp('15%'),
        marginHorizontal: wp('1%'),
        borderRadius: 5,
    },
    imageContainer: {
        backgroundColor: Colors().light_white,
        height: hp('7.5%'),
    },
    imageView: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: hp('7.5%'),
        width: wp('15%'),
        borderRadius: 5
    },
    catName: {
        fontSize: wp('3%'),
        fontFamily: Fonts.Font_Reguler,
        textAlign: 'center',
        color: Colors().text_color
    }

});