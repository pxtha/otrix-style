import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet, ScrollView,
    Modal
} from "react-native";
import { connect } from 'react-redux';
import { Button, FormControl, Input } from 'native-base';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, CheckoutView, OtirxBackButton, AddAdressComponent, EditAddressComponent, PaymentSuccessComponent
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { proceedCheckout } from '@actions';
import ProductListDummy from '@component/items/ProductListDummy';
import PaymentMethodsDummy from '@component/items/PaymentMethodsDummy';
import Icon from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from "@helpers/Fonts";
import DummyAddress from '@component/items/DummyAddress';

function CheckoutScreen(props) {
    const [state, setState] = React.useState({ loading: true, comment: null, cartArr: [], showAdd: false, cartProducts: [], sumAmount: 0, noRecord: false, addresses: DummyAddress, selctedAddress: DummyAddress[0].id, showEdit: false, editAddressData: [], step: 1, selectedPaymentMethod: 4, paymentSuccessModal: false });

    const calculateCart = () => {
        let cartProducts = props.cartData;
        let cartItems = [];
        let sumAmount = 0;

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

    const storeAddress = (addressData) => {
        let newID = "" + Math.floor(Math.random() * 10000) + 1;
        let newObj = { id: "" + newID, name: addressData.name, country: addressData.country, city: addressData.city, postcode: addressData.postcode, address1: addressData.address1, address2: addressData.address2 };
        setState({
            ...state, addresses: [newObj, ...addresses], showAdd: false
        });
    }

    const updateAddress = (addressData) => {
        let newID = "" + Math.floor(Math.random() * 10000) + 1;
        if (selctedAddress == addressData.id) {
            setState({ ...state, selctedAddress: newID });
        }
        let findIndex = addresses.findIndex((item) => item.id === editAddressData.id);
        let newObj = { id: newID, name: addressData.name, country: addressData.country, city: addressData.city, postcode: addressData.postcode, address1: addressData.address1, address2: addressData.address2 };
        addresses.splice(findIndex, 1);

        setState({
            ...state, addresses: [newObj, ...addresses], showEdit: false
        });
        if (selctedAddress == addressData.id) {
            setState({ ...state, selctedAddress: newID });
        }
    }

    const closePay = (navigateTo) => {
        setState({
            ...state,
            paymentSuccessModal: false
        });
        props.navigation.push(navigateTo);
    }

    const editAddress = (id) => {

        let findAddress = addresses.filter(item => item.id.indexOf(id) > -1);
        setState({ ...state, editAddressData: findAddress[0], showEdit: true });
    }

    const closeAddressModel = () => {
        setState({
            ...state,
            showAdd: false
        });
    }

    const closeAddressEditModel = () => {
        setState({
            ...state,
            showEdit: false
        });
    }

    const _proceedCheckout = () => {
        props.proceedCheckout();
    }

    useEffect(() => {
        calculateCart();
    }, []);

    const { cartProducts, comment, loading, noRecord, showAdd, addresses, selctedAddress, showEdit, editAddressData, step, selectedPaymentMethod, paymentSuccessModal } = state;
    const { totalAmt } = props.route.params;
    const { strings } = props;

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={GlobalStyles.headingTxt}>  {strings.cart.checkout}</Text>
                </View>
            </OtrixHeader>

            {/* Content Start from here */}
            <View style={{ marginHorizontal: wp('4%') }} >
                {/* Arrow navigation Start from here */}
                <View style={styles.indicatorView}>
                    <View style={[styles.indicator1, { marginRight: wp('4%') }]}>
                        <View style={{ position: 'relative' }}>
                            <View style={[styles.ract, { borderColor: step == 1 ? Colors().themeColor : 'transparent' }]}>

                                <Text style={[styles.indicatorText, { color: step == 1 ? Colors().themeColor : Colors().secondry_text_color }]}>{strings.checkout.address}</Text>
                            </View>
                            <View style={[styles.tri]}>
                                <View style={[styles.arrow, { borderColor: step == 1 ? Colors().themeColor : 'transparent' }]}>

                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.indicator1}>
                        <View style={{ borderColor: step == 2 ? Colors().themeColor : 'transparent' }}>
                            <View style={[styles.ract, { borderColor: step == 2 ? Colors().themeColor : 'transparent' }]}>
                                <Text style={[styles.indicatorText, { color: step == 2 ? Colors().themeColor : Colors().secondry_text_color }]}>{strings.checkout.payment}</Text>
                            </View>
                            <View style={[styles.tri]}>
                                <View style={[styles.arrow, { borderColor: step == 2 ? Colors().themeColor : 'transparent' }]}>

                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Address Content start from here */}
            {step == 1 && <>
                <OtrixDivider size={"md"} />
                <Text style={styles.deliveryTitle}>{strings.checkout.delivery_address}</Text>
                <OtrixDivider size={"sm"} />
                <View style={styles.addressContent}>
                    {/*horizontal address* */}
                    <ScrollView style={styles.addressBox} showsHorizontalScrollIndicator={false} horizontal={true}>
                        {
                            addresses.length > 0 && addresses.map((item, index) =>
                                <TouchableOpacity key={index} style={[styles.deliveryBox, {
                                    borderWidth: selctedAddress == item.id ? 1 : 0.1,
                                    borderColor: selctedAddress == item.id ? Colors().themeColor : Colors().white
                                }]}
                                    onPress={() => setState({ ...state, selctedAddress: item.id })}
                                >
                                    <Text style={styles.addressTxt} numberOfLines={1}>{item.name}     </Text>
                                    <Text style={styles.addressTxt} numberOfLines={2}>{item.address1}    </Text>
                                    <Text style={styles.addressTxt} numberOfLines={2}>{item.address2}, {item.city}</Text>
                                    <Text style={styles.addressTxt} numberOfLines={1}>{item.postcode}, {item.country}</Text>
                                    {selctedAddress == item.id &&
                                        <Text style={styles.deliveryAddressTxt}>{strings.checkout.delivery_address} <Icon name="md-checkmark-circle-sharp" color={Colors().themeColor} size={wp('4%')} style={{ textAlignVertical: 'center' }} /></Text>
                                    }
                                    <TouchableOpacity style={[styles.editView, { bottom: selctedAddress == item.id ? hp('12%') : hp('10%') }]} onPress={() => editAddress(item.id)}>
                                        <Text style={styles.edit}> <MatIcon name="pencil" color={Colors().text_color} size={wp('5%')} /></Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )
                        }

                    </ScrollView>

                    <TouchableOpacity style={styles.plusView} onPress={() => setState({ ...state, showAdd: true })}>
                        <MatIcon name="plus" color={Colors().text_color} size={wp('5%')} />
                    </TouchableOpacity>
                </View>
            </>
            }


            {
                step == 1 && <OtrixContent>
                    <OtrixDivider size={"lg"} />
                    <Text style={styles.summayTitle}>{strings.checkout.order_summary}</Text>
                    <OtrixDivider size={"sm"} />
                    <View style={GlobalStyles.horizontalLine}></View>
                    <>
                        {
                            !noRecord && !loading && <CheckoutView strings={strings} navigation={props.navigation} products={cartProducts} />
                        }
                    </>
                </OtrixContent>
            }

            {/* Add Address Screen */}
            <Modal visible={showAdd}
                transparent={true}>
                <AddAdressComponent strings={strings} closeAdd={closeAddressModel} addAdress={storeAddress} />
            </Modal>

            {/* Edit Address Screen */}
            <Modal visible={showEdit}
                transparent={true}>
                <EditAddressComponent strings={strings} closeEdit={closeAddressEditModel} editAddress={updateAddress} editData={editAddressData} />
            </Modal>


            {/******** PAYMENT SECTION *************/}
            {
                step == 2 && <OtrixContent>
                    <OtrixDivider size={"md"} />
                    <View style={styles.offerView}>
                        <Text style={styles.offerTxt}>Get 10% Off With Credit Card</Text>
                    </View>
                    <OtrixDivider size={"md"} />
                    <Text style={styles.paymentMethodTitle}>{strings.checkout.payment_methods}</Text>
                    <OtrixDivider size={"sm"} />
                    {
                        PaymentMethodsDummy.map((item, index) =>
                            <TouchableOpacity key={index}
                                onPress={() => setState({ ...state, selectedPaymentMethod: item.id })}
                                style={[styles.paymentView, { backgroundColor: selectedPaymentMethod == item.id ? Colors().themeColor : Colors().white }]}>
                                <Text style={[styles.paymentMethodTxt, { color: selectedPaymentMethod == item.id ? Colors().white : Colors().text_color }]}>{item.name}</Text>
                                {
                                    selectedPaymentMethod == item.id ?
                                        <Icon name="md-shield-checkmark" color={Colors().white} size={wp('6%')} style={{ textAlign: 'right', flex: 0.10 }} />
                                        :
                                        <Icon name="radio-button-off" color={Colors().secondry_text_color} size={wp('5%')} style={{ textAlign: 'right', flex: 0.10 }} />
                                }
                            </TouchableOpacity>
                        )
                    }
                    <OtrixDivider size={"sm"} />
                    <Text style={[styles.summayTitle, { left: wp('1.5%') }]}>{strings.checkout.order_comments}</Text>
                    <OtrixDivider size={"sm"} />
                    <FormControl isRequired >
                        <Input variant="outline" value={comment}
                            placeholder={strings.checkout.enter_order_comments} style={GlobalStyles.textAreaInputStyle}
                            onChangeText={(value) => setState({ ...state, comment: value })}
                        />
                    </FormControl>
                </OtrixContent>
            }

            <View style={styles.checkoutView}>
                <OtrixDivider size={'sm'} />
                <View style={styles.totalView}>
                    <Text style={styles.leftTxt}>{strings.cart.total} :</Text>
                    <Text style={[styles.rightTxt, { color: Colors().link_color, fontSize: wp('5.5%') }]}>{totalAmt}</Text>
                    {
                        step == 1 ?
                            <Button
                                size="md"
                                variant="solid"
                                bg={Colors().themeColor}
                                style={[GlobalStyles.button, { marginHorizontal: wp('5%'), marginBottom: hp('1%'), flex: 0.40, alignSelf: 'flex-end' }]}
                                onPress={() => setState({ ...state, step: 2 })}
                            >
                                <Text style={GlobalStyles.buttonText}>{strings.checkout.proceed}</Text>
                            </Button>
                            : <Button
                                size="md"
                                variant="solid"
                                bg={'#0ab97a'}
                                style={[GlobalStyles.button, { marginHorizontal: wp('5%'), marginBottom: hp('1%'), flex: 0.40, alignSelf: 'flex-end' }]}
                                onPress={() => { setState({ ...state, paymentSuccessModal: true }), _proceedCheckout() }}
                            >
                                <Text style={[GlobalStyles.buttonText, { fontSize: wp('4.8%') }]}>{strings.checkout.place_order}</Text>
                            </Button>
                    }

                </View>
            </View>

            {/* Payment Modal  */}
            <Modal visible={paymentSuccessModal}
                transparent={true}>
                <PaymentSuccessComponent closePaymentModal={closePay} auth={props.USER_AUTH} strings={strings} navigation={props.navigation} />
            </Modal>

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


export default connect(mapStateToProps, { proceedCheckout })(CheckoutScreen);

const styles = StyleSheet.create({
    checkoutView: {
        backgroundColor: Colors().light_white,
        height: hp('8%'),
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        borderTopLeftRadius: wp('2%'),
        borderTopRightRadius: wp('2%'),
    },
    totalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: wp('6%'),
    },
    leftTxt: {
        color: Colors().secondry_text_color,
        fontFamily: Fonts.Font_Bold,
        flex: 0.20,
        fontSize: wp('4%'),
        textAlign: 'left'
    },
    rightTxt: {
        color: Colors().text_color,
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('4%'),
        flex: 0.40,
        textAlign: 'left'
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
    indicatorView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: hp('1.5%')
    },

    indicator1: {
        marginHorizontal: wp('3%')
    },
    ract: {
        borderWidth: 1,
        padding: 4.4,
        width: wp('38%'),
        backgroundColor: Colors().white,

        alignItems: 'center'
    },
    tri: {
        position: 'absolute',
        top: hp('0.6%'),
        right: -wp('2.6%')
    },
    arrow: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        backgroundColor: Colors().white,
        borderColor: '#007299',
        width: 20,
        height: 21,
        transform: [{ rotate: '45deg' }]
    },
    indicatorText: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        textTransform: 'uppercase',
        color: Colors().secondry_text_color
    },
    deliveryTitle: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        color: Colors().text_color,
        marginLeft: wp('5%')
    },
    summayTitle: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        color: Colors().text_color,
        left: wp('5%')
    },
    addressBox: {
        marginLeft: wp('5%'),
        marginRight: wp('2.5%'),
        flex: 0.90,
        height: hp('15.5%'),
        borderRadius: wp('2%'),
    },
    deliveryBox: {
        marginHorizontal: wp('1.5%'),
        width: wp('72%'),
        height: hp('15.5%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors().white,
        padding: wp('2.5%')
    },
    addressTxt: {
        fontSize: wp('3.6%'),
        fontFamily: Fonts.Font_Reguler,
        color: Colors().text_color,
        textAlign: 'left',

    },
    deliveryAddressTxt: {
        textAlign: 'right',
        fontSize: wp('3.4%'),
        fontFamily: Fonts.Font_Reguler,
        color: Colors().link_color,
    },
    edit: {
        textAlign: 'right'
    },
    editView: { justifyContent: 'flex-start', },
    addressContent: {
        flexDirection: 'row'
    },
    summryBox: {
        height: hp('6.5%'),
        backgroundColor: Colors().white,
        flexDirection: 'row',
        marginVertical: hp('1%')
    },
    image: {
        flex: 0.25,
        height: hp('10%'),
        resizeMode: 'contain',
        width: wp('20%')
    },
    plusView: {
        flex: 0.10,
        height: hp('15%'),
        backgroundColor: Colors().white,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },

    //payment styles here
    offerView: {
        padding: hp('1.5%'),
        backgroundColor: Colors().white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    offerTxt: {
        fontSize: wp('3.8%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().link_color
    },
    paymentMethodTitle: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('4%'),
        color: Colors().text_color,
        marginLeft: wp('1%')
    },
    paymentView: {
        flexDirection: 'row',
        padding: hp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: hp('0.5%'),
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors().light_gray
    },
    paymentMethodTxt: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        textAlign: 'left',
        marginLeft: wp('2%'),
        flex: 0.90
    }
});