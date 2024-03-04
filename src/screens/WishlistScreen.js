import { addToWishList } from '@actions';
import { GET_PRODUCTS } from '@apis/queries';
import { useQuery } from '@apollo/client';
import {
    OtirxBackButton,
    OtrixContainer,
    OtrixContent,
    OtrixHeader,
    WishlistComponent
} from '@component';
import { ProductsMapping } from "@component/items/ProductsMapping";
import { Colors, GlobalStyles } from '@helpers';
import Fonts from "@helpers/Fonts";
import { _addToWishlist } from "@helpers/FunctionHelper";
import { Button } from 'native-base';
import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

function WishlistScreen(props) {
    const { strings, wishlistData } = props;

    const { data: productList, loading } = useQuery(GET_PRODUCTS, {
        variables: {
            page: 1,
            perPage: 100,
        }
    });

    const wishlistArr = useMemo(() => {
        if (!productList || !wishlistData) return []
        return wishlistData.map((item) => {
            const findedProduct = ProductsMapping(productList).find(product => product.id === item)
            return findedProduct
        })
    }, [productList, wishlistData])

    const onDeleteItem = async (id) => {
        let wishlistData = await _addToWishlist(id);
        props.addToWishList(wishlistData);
    }

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={GlobalStyles.headingTxt}>  {strings.account.label_wishlist}</Text>
                </View>
            </OtrixHeader>

            {/* Content Start from here */}
            <OtrixContent >
                <WishlistComponent navigation={props.navigation} products={wishlistArr} deleteItem={onDeleteItem} />

                {
                    !loading && !wishlistArr.length && <View style={styles.noRecord}>
                        <Text style={styles.emptyTxt}>Wishlist is empty!</Text>
                        <Button
                            size="lg"
                            variant="solid"
                            bg={Colors().themeColor}
                            style={[GlobalStyles.button, { marginHorizontal: wp('2%'), marginBottom: hp('2.5%'), marginTop: hp('1%') }]}
                            onPress={() => props.navigation.navigate('HomeScreen')}
                        >
                            <Text style={GlobalStyles.buttonText}><Icon name={"md-heart"} color={Colors().white} style={{ fontSize: wp('4.5%') }} />  Add Now</Text>
                        </Button>
                    </View>
                }
            </OtrixContent>


        </OtrixContainer >
    )
}

function mapStateToProps(state) {
    return {
        cartData: state.cart.cartData,
        wishlistData: state.wishlist.wishlistData,
        strings: state.mainScreenInit.strings,

    }
}


export default connect(mapStateToProps, { addToWishList })(WishlistScreen);

const styles = StyleSheet.create({
    noRecord: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: hp('25%')
    },
    emptyTxt: {
        fontSize: wp('6%'),
        marginVertical: hp('1.5%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().secondry_text_color
    }
});