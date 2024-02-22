import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { GlobalStyles, Colors } from '@helpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ProductsMapping } from '../items/ProductsMapping';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import ProductView from '../ProductCompnent/ProductView';
import Fonts from '@helpers/Fonts';
import { logfunction } from "@helpers/FunctionHelper";
import { useLazyQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@apis/queries"

function TrendingProduct(props) {
    const { wishlistArr } = props;
    const [getProducts, { data }] = useLazyQuery(GET_PRODUCTS);
    const newProduct = useMemo(() => {
        return ProductsMapping(data)
    }, [data])

    const navigateToDetailPage = (data) => {
        props.navigation.navigate('ProductDetailScreen', { id: data.id })
    }

    const addToWishlist = async (id) => {
        props.addToWishlist(id);
    }

    useEffect(() => {
        getProducts({
            variables: {
                page: 1,
                perPage: 4,
            }
        });
    }, [])

    const renderCard = item => {
        return (
            <View style={styles.productBox} key={item.id.toString()}>
                <ProductView strings={props.strings} data={item} key={item.id} navToDetail={navigateToDetailPage} addToWishlist={addToWishlist} wishlistArray={wishlistArr} />
            </View>
        );
    };

    return (
        <>
            <View style={styles.catHeading}>
                <Text style={GlobalStyles.boxHeading}>{props.strings.homepage.label_tranding}</Text>
                <TouchableOpacity style={{ flex: 0.50 }} onPress={() => props.navigation.navigate('ProductListScreen', { title: 'Trending Products' })}>
                    <Text style={GlobalStyles.viewAll}>{props.strings.homepage.viewall}</Text>
                </TouchableOpacity>
            </View>
            <OtrixDivider size={'sm'} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {newProduct.map((item, index) => {
                    return renderCard(item);
                })}
            </View>
        </>
    )
}

export default TrendingProduct;

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

    catName: {
        fontSize: wp('3.3%'),
        fontFamily: Fonts.Font_Reguler,
        textAlign: 'center',
        color: Colors().text_color
    },
    productBox: {
        flexDirection: 'column',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Colors().white,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        width: '46%',
        height: 'auto',
        marginBottom: wp('3%'),
        borderRadius: wp('2%'),
        marginHorizontal: wp('1.5%'),
        paddingBottom: hp('1%'),
    },

});