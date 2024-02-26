import { Colors, GlobalStyles } from '@helpers';
import Fonts from '@helpers/Fonts';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import { ProductMapping } from '../items/ProductsMapping';
import DealsProductView from './DealsProductView';

function BestDeal(props) {

    const navigateToDetailPage = (data) => {
        props.navigation.navigate('ProductDetailScreen', { id: data.id })
    }

    const addToWishlist = async (id) => {
        props.addToWishlist(id);
    }

    const renderCard = item => {
        return (
            <View style={styles.productBox} key={item.id.toString()}>
                <DealsProductView strings={props.strings} data={item} key={item.id} navToDetail={navigateToDetailPage} addToWishlist={addToWishlist} wishlistArray={wishlistArr} />
            </View>
        );
    };

    const { wishlistArr } = props;

    const formatData = () => {
        return Object.entries(props.dealProducts).map(([key, value]) => {
            if (typeof value !== 'string') {
                return ProductMapping(value.data)
            }
        }).filter(data => data !== undefined)
    }

    return (
        <>
            <View style={styles.catHeading}>
                <Text style={GlobalStyles.boxHeading}>{props.strings.homepage.label_dod}</Text>
                <TouchableOpacity style={{ flex: 0.50 }} onPress={() => props.navigation.navigate('ProductListScreen', { title: 'Deals of the day' })}>
                    <Text style={GlobalStyles.viewAll}>{props.strings.homepage.viewall}</Text>
                </TouchableOpacity>
            </View>
            <OtrixDivider size={'sm'} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {formatData().map((item, index) => {
                    return renderCard(item);
                })}
            </View>
        </>


    )
}

export default memo(BestDeal);

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