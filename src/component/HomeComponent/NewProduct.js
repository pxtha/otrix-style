import { Colors, GlobalStyles } from '@helpers';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import ProductView from '../ProductCompnent/ProductView';
import { ProductsMapping } from '../items/ProductsMapping';

function NewProduct(props) {
    const { wishlistArr } = props;

    const navigateToDetailPage = (data) => {
        props.navigation.navigate('ProductDetailScreen', { id: data.id })
    }

    const addToWishlist = async (id) => {
        props.addToWishlist(id);
        // logfunction(" wishlist Data ", wishlistData)
    }


    const renderCard = item => {
        return (
            <View style={styles.productBox} key={item.id}>
                <ProductView strings={props.strings} data={item} key={item.id} navToDetail={navigateToDetailPage} addToWishlist={addToWishlist} wishlistArray={wishlistArr} />
            </View>
        );
    };

    return (
        <>
            <View style={styles.catHeading}>
                <Text style={GlobalStyles.boxHeading}>{props.strings.homepage.label_new_product}s</Text>
                <TouchableOpacity style={{ flex: 0.50 }} onPress={() => props.navigation.navigate('ProductListScreen', { title: 'New Products' })}>
                    <Text style={GlobalStyles.viewAll}>{props.strings.homepage.viewall}</Text>
                </TouchableOpacity>
            </View>
            <OtrixDivider size={'sm'} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {ProductsMapping(props.newProducts).map((item, index) => {
                    return renderCard(item);
                })}
            </View>
        </>
    )
}

export default memo(NewProduct);

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