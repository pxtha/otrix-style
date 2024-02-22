import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { connect } from 'react-redux';
import { Input, Button } from 'native-base';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, CartView
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { removeFromCart, decrementQuantity, incrementQuantity } from '@actions';
import ProductListDummy from '@component/items/ProductListDummy';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from "@helpers/Fonts";
import AwesomeAlert from 'react-native-awesome-alerts';

function CheckoutScreen(props) {
    const [state, setState] = React.useState({ loading: true, cartArr: [], cartProducts: [], sumAmount: 0, isApplied: false, validCode: false, couponCode: null, noRecord: false });
    const [showConfirmModal, setConfirmModal] = React.useState(false)

    const applyCouponCode = () => {
        const { couponCode } = state;
        if (couponCode != null) {
            if (couponCode == 'otrixweb') {
                setState({ ...state, isApplied: true, validCode: true })
            }
            else {
                setState({ ...state, isApplied: true, validCode: false })
            }
        }
        else {
            setState({ ...state, isApplied: true, validCode: false })
        }
    }

    const onDeleteItem = (id) => {
        props.removeFromCart(id);
    }

    const decrement = (id) => {
        props.decrementQuantity(id);
    }

    const increment = (id) => {
        props.incrementQuantity(id);
    }

    const calculateCart = async () => {
        let cartProducts = props.cartData;
        let cartItems = [];
        let sumAmount = 0;
        // let cartProducts = await AsyncStorage.getItem("CART_DATA");
        console.log("CART ", cartProducts)
        //find and create array
        cartProducts && cartProducts.length > 0 && cartProducts.forEach(function (item, index) {
            let findedProduct = ProductListDummy.filter(product => product.id == item.product_id);
            cartItems.push({
                quantity: item.quantity,
                name: findedProduct[0].name,
                price: findedProduct[0].price,
                image: findedProduct[0].image,
                id: findedProduct[0].id
            });
            let amt = parseInt(findedProduct[0].price.replace('$', ''));
            sumAmount += amt * item.quantity;
        });
        setState({ ...state, noRecord: cartProducts.length > 0 ? false : true, loading: false, cartProducts: cartItems, sumAmount: sumAmount, });
    }

    const navToCheckout = () => {
        if (props.USER_AUTH) {
            props.navigation.navigate("CheckoutScreen", { totalAmt: validCode ? '$' + parseFloat(sumAmount - 50) : '$' + sumAmount })
        }
        else {
            setConfirmModal(true)
        }
    }

    useEffect(() => {
        // const unsubscribe = props.navigation.addListener('focus', () => {
        //     calculateCart();
        // });
        calculateCart();

        // Return the function to unsubscribe from the event so it gets removed on unmount
        //  return unsubscribe;
    }, [props.cartData]);

    const { cartProducts, sumAmount, couponCode, loading, isApplied, validCode, noRecord } = state;
    const { strings } = props;

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
                {
                    !noRecord && !loading && <CartView navigation={props.navigation} products={cartProducts} deleteItem={onDeleteItem} decrementItem={decrement} incrementItem={increment} />
                }
                {
                    !loading && noRecord && <View style={styles.noRecord}>
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
            {!noRecord && !loading && <View style={styles.checkoutView}>
                <View style={styles.couponInput}>
                    <Input variant="outline" placeholder="Coupon Code (use otrixweb)" style={[GlobalStyles.textInputStyle, styles.inputStyle]}
                        onChangeText={(couponCode) => setState({ ...state, couponCode })}
                        InputRightElement={
                            <View style={{ flexDirection: 'row', marginRight: wp('3%'), justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    isApplied ?
                                        validCode ? <Icon name={"checkmark-circle"} size={18} color={'#3ad35c'} />
                                            : <Icon name={"ios-close-circle"} size={18} color={'red'} />
                                        : null
                                }
                                <TouchableOpacity style={styles.applyView} onPress={() => applyCouponCode()}>
                                    <Text style={styles.applyTxt}>{strings.cart.apply}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </View>
                <View style={GlobalStyles.horizontalLine}></View>
                <OtrixDivider size={'sm'} />
                <View style={styles.totalView}>
                    <Text style={styles.leftTxt}>{strings.cart.sub_total}</Text>
                    <Text style={styles.rightTxt}>${sumAmount}</Text>
                </View>
                <View style={styles.totalView}>
                    <Text style={styles.leftTxt}>Discount</Text>
                    <Text style={styles.rightTxt}>$0</Text>
                </View>
                {
                    validCode && <View style={styles.totalView}>
                        <Text style={styles.leftTxt}>{strings.cart.coupon} ({couponCode})</Text>
                        <Text style={styles.rightTxt}>-$50</Text>
                    </View>
                }
                <View style={styles.totalView}>
                    <Text style={styles.leftTxt}>{strings.cart.total}</Text>
                    <Text style={[styles.rightTxt, { color: Colors().link_color, fontSize: wp('5.5%') }]}>{validCode ? '$' + parseFloat(sumAmount - 50) : '$' + sumAmount}</Text>
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
                    props.navigation.navigate("CheckoutScreen", { totalAmt: validCode ? '$' + parseFloat(sumAmount - 50) : '$' + sumAmount })
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


export default connect(mapStateToProps, { removeFromCart, decrementQuantity, incrementQuantity })(CheckoutScreen);

const styles = StyleSheet.create({

    checkoutView: {
        backgroundColor: Colors().light_white,
        height: hp('32%'),
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
    }
}); 