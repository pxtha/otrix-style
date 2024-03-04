import { checkoutProcess, decrementQuantity, incrementQuantity, removeFromCart } from '@actions';
import { GET_PRODUCTS } from '@apis/queries';
import { useQuery } from '@apollo/client';
import {
    CartView,
    OtrixContainer,
    OtrixContent, OtrixDivider,
    OtrixHeader
} from '@component';
import { ProductsMapping } from "@component/items/ProductsMapping";
import { Colors, GlobalStyles } from '@helpers';
import Fonts from "@helpers/Fonts";
import { Button } from 'native-base';
import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import AwesomeAlert from 'react-native-awesome-alerts';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

function CheckoutScreen(props) {
    const { strings, cartData } = props;

    const [showConfirmModal, setConfirmModal] = React.useState(false)

    const { data: productList, loading } = useQuery(GET_PRODUCTS, {
        variables: {
            page: 1,
            perPage: 100,
        }
    });

    const onDeleteItem = (id) => {
        props.removeFromCart(id);
    }

    const decrement = (id) => {
        props.decrementQuantity(id);
    }

    const increment = (id) => {
        props.incrementQuantity(id);
    }

    const cardlistArr = useMemo(() => {
        if (!productList || !cartData) return []
        return cartData.map((item) => {
            const findedProduct = ProductsMapping(productList).find(product => product.id === item.id)
            return { ...findedProduct, quantity: item.quantity }
        })
    }, [productList, cartData])


    const sumAmount = useMemo(() => {
        if (!cardlistArr) return 0;
        return cardlistArr.reduce((acc, current) => {
            return acc + (current.quantity * current.price)
        }, 0)
    }, [cardlistArr])

    const navToCheckout = () => {
        props.checkoutProcess(cardlistArr);
        if (props.USER_AUTH) {
            props.navigation.navigate("CheckoutScreen", { totalAmt: '$' + sumAmount })
        }
        else {
            setConfirmModal(true)
        }
    }

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={GlobalStyles.headingTxt}>  {strings.cart.title}</Text>
                </View>
            </OtrixHeader>

            {/* Content Start from here */}
            <OtrixContent >
                {/* Cart Component Start from here */}
                <CartView navigation={props.navigation} products={cardlistArr} deleteItem={onDeleteItem} decrementItem={decrement} incrementItem={increment} />
                {
                    !loading && !cardlistArr.length && <View style={styles.noRecord}>
                        <Text style={styles.emptyTxt}>Cart is empty!</Text>
                        <Button
                            size="lg"
                            variant="solid"
                            bg={Colors().themeColor}
                            style={[GlobalStyles.button, { marginHorizontal: wp('2%'), marginBottom: hp('2.5%'), marginTop: hp('1%') }]}
                            onPress={() => props.navigation.navigate('HomeScreen')}
                        >
                            <Text style={GlobalStyles.buttonText}><Icon name={"md-cart-sharp"} color={Colors().white} style={{ fontSize: wp('4.5%') }} />  Shop Now</Text>
                        </Button>
                    </View>
                }
            </OtrixContent>
            {!loading && cardlistArr.length > 0 && <View style={styles.checkoutView}>
                <View style={GlobalStyles.horizontalLine}></View>
                <OtrixDivider size={'sm'} />
                <View style={styles.totalView}>
                    <Text style={styles.leftTxt}>{strings.cart.total}</Text>
                    <Text style={[styles.rightTxt, { color: Colors().link_color, fontSize: wp('5.5%') }]}>{'$' + sumAmount}</Text>
                </View>
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={[GlobalStyles.button, { marginHorizontal: wp('5%'), marginBottom: hp('2.5%'), marginTop: hp('1%') }]}
                    onPress={() => navToCheckout()}

                >
                    <Text style={GlobalStyles.buttonText}>{strings.cart.checkout}</Text>
                </Button>
            </View>
            }
            <AwesomeAlert
                show={showConfirmModal}
                showProgress={false}
                title={strings.cart.confirm}
                message={strings.cart.are_you_sure}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText={strings.cart.login_now}
                confirmText={strings.cart.yes_continue}
                confirmButtonColor={Colors().themeColor}
                cancelButtonColor={Colors().green_text}
                onCancelPressed={() => {
                    setConfirmModal(false);
                    props.navigation.push('LoginScreen');
                }}
                onConfirmPressed={() => {
                    setConfirmModal(false)
                    props.navigation.navigate("CheckoutScreen", { totalAmt: '$' + sumAmount })
                }}
            />
        </OtrixContainer >
    )
}

function mapStateToProps(state) {
    return {
        cartData: state.cart.cartData,
        strings: state.mainScreenInit.strings,
        USER_AUTH: state.auth.USER_AUTH,
    }
}


export default connect(mapStateToProps, { removeFromCart, decrementQuantity, incrementQuantity, checkoutProcess })(CheckoutScreen);

const styles = StyleSheet.create({

    checkoutView: {
        backgroundColor: Colors().light_white,
        height: hp('15%'),
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        borderTopLeftRadius: wp('2%'),
        borderTopRightRadius: wp('2%'),
    },
    couponInput: {
        marginHorizontal: wp('5%'),
        marginVertical: hp('1.5%')
    },
    inputStyle: {
        borderColor: Colors().black,
        backgroundColor: Colors().light_white
    },
    applyTxt: {
        color: Colors().link_color,
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('4%'),
    },
    applyView: { marginHorizontal: wp('2%'), justifyContent: 'center', alignItems: 'center', padding: 5 },
    totalView: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: wp('6%'),
    },
    leftTxt: {
        color: Colors().secondry_text_color,
        fontFamily: Fonts.Font_Bold,
        flex: 0.50,
        fontSize: wp('3.8%'),
        textAlign: 'left'
    },
    rightTxt: {
        color: Colors().text_color,
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('4.5%'),
        flex: 0.50,
        textAlign: 'right'
    },
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
    },

}); 