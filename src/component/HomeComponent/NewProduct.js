import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { GlobalStyles, Colors, } from '@helpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import NewProductDummy from '../items/NewProductDummy';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import ProductView from '../ProductCompnent/ProductView';
import { logfunction } from "@helpers/FunctionHelper";

function NewProduct(props) {

    const navigateToDetailPage = (data) => {
        props.navigation.navigate('ProductDetailScreen', { id: data.id })
    }

    const addToWishlist = async (id) => {
        props.addToWishlist(id);
        // logfunction(" wishlist Data ", wishlistData)
    }

    const { wishlistArr } = props;

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
                <Text style={GlobalStyles.boxHeading}>{props.strings.homepage.label_new_product}</Text>
                <TouchableOpacity style={{ flex: 0.50 }} onPress={() => props.navigation.navigate('ProductListScreen', { title: 'New Products' })}>
                    <Text style={GlobalStyles.viewAll}>{props.strings.homepage.viewall}</Text>
                </TouchableOpacity>
            </View>
            <OtrixDivider size={'sm'} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {NewProductDummy.map((item, index) => {
                    return renderCard(item);
                })}
            </View>
        </>
    )
}

export default NewProduct;

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