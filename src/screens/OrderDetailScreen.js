import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    Modal,
    StyleSheet, ScrollView,
    Image
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtirxBackButton, OtrixAlert
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, FormControl, Button, TextArea, Select, CheckIcon, InfoOutlineIcon } from "native-base"
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { proceedCheckout } from '@actions';
import Stars from 'react-native-stars';
import Fonts from "@helpers/Fonts";
import { close } from '@common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Timeline from 'react-native-timeline-flatlist';

function OrderDetailScreen(props) {
    const { orderData } = props.route.params;
    const { strings } = props;
    const [state, setState] = React.useState({ rateReview: false, loading: false, name: null, star: 0, submited: false, cancelSubmited: false, productID: null, message: null, type: 'error', cancelOrder: false, orderID: null, cancelMessage: null });
    const { rateReview, name, star, message, loading, submited, productID, type, cancelOrder, orderID, cancelMessage, cancelSubmited } = state;
    const [errors, setErrors] = React.useState({});
    const [showMessage, setShowLoading] = React.useState(false)
    var timelineData = [
        { time: '09:00', title: 'Order Placed', description: 'Order has been Placed' },
        { time: '10:45', title: 'Order Procced', description: 'Order has been Procced' },
        { time: '12:00', title: 'Order Shipped', description: 'Order has been Shipped' },
        { time: '14:00', title: 'Order Delivered', description: 'Order has been Delivered' },
        { time: '16:30', title: 'Order Completed', description: 'Order has been Completed' }
    ];

    const cancelValidate = () => {
        if (cancelMessage == null) {
            setErrors({
                ...errors,
                cancelMessage: 'Cancel reason is required'
            });
            return false;
        }

        return true;
    }

    const validate = () => {
        if (star == 0) {
            setErrors({
                ...errors,
                star: 'Star is required',
            });
            return false;
        }
        else if (name == null) {
            setErrors({
                ...errors,
                name: 'Name is required',
            });
            return false;
        }

        return true;
    }

    const submit = () => {
        setState({
            ...state, loading: true, rateReview: false,
            submited: true
        })
        if (validate()) {
            setState({
                ...state,
                text: null,
                star: 0,
                rateReview: false,
                loading: false,
                message: 'Review updated!',
                type: 'success'
            });
            setShowLoading(true)
            setTimeout(() => {
                setShowLoading(false)
            }, 3000);
        }
    }

    const submitCancelOrder = () => {
        setState({
            ...state,
            cancelSubmited: true
        })
        if (cancelValidate()) {
            setState({
                ...state,
                cancelOrder: false,
                message: "Order Successfully Canceled",
                type: 'success'
            });
            setShowLoading(true)
            setTimeout(() => {
                setShowLoading(false)
                props.navigation.goBack()
            }, 3000);
        }
    }

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={GlobalStyles.headingTxt}> {strings.order_details.title}  </Text>
                </View>
            </OtrixHeader>

            {/* Orders Content start from here */}

            <OtrixContent style={styles.addressContent}>
                <View style={styles.addressBox} showsHorizontalScrollIndicator={false} vertical={true}>

                    <OtrixDivider size={"md"} />
                    <Text style={styles.deliveryTitle}>{strings.order_details.view_order_detail}</Text>
                    <OtrixDivider size={"sm"} />
                    <View style={styles.cartContent} >
                        <View style={styles.detailBox} >
                            <View style={styles.detailRow}>
                                <View style={styles.leftView}>
                                    <Text style={styles.leftTxt}>{strings.order_details.order_date}</Text>
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.rightTxt}>{orderData.orderDate}</Text>
                                </View>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.leftView}>
                                    <Text style={styles.leftTxt}>{strings.order_details.order}</Text>
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.rightTxt}>#{orderData.orderid}</Text>
                                </View>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.leftView}>
                                    <Text style={[styles.leftTxt]}>{strings.order_details.order_total}</Text>
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.rightTxt}>{orderData.price}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <OtrixDivider size={"md"} />
                    <Timeline
                        data={timelineData}
                        circleSize={20}
                        circleColor='rgb(45,156,219)'
                        lineColor='rgb(45,156,219)'
                        timeContainerStyle={{ marginTop: 5 }}
                        timeStyle={{ textAlign: 'center', backgroundColor: Colors().themeColor, color: Colors().white, padding: 5, borderRadius: 13 }}
                        descriptionStyle={{ color: 'gray' }}
                        options={{
                            style: { paddingTop: 5 },
                            removeClippedSubviews: false
                        }}
                        innerCircle={'dot'}
                    />

                    <OtrixDivider size={"md"} />
                    <Text style={styles.deliveryTitle}>{strings.order_details.order_product_list}</Text>
                    <OtrixDivider size={"sm"} />

                    <View style={styles.cartContent} >
                        <View style={styles.cartBox} >
                            <View style={styles.imageView}>
                                <Image source={orderData.image} style={styles.image}
                                ></Image>
                            </View>
                            <View style={styles.infromationView}>
                                <View >
                                    <Text style={styles.name}>{orderData.name}</Text>
                                </View>
                                <Text style={styles.orderDate}>{strings.order_details.quantity}: {orderData.orderQty}</Text>
                                <Text style={styles.orderDate}>{strings.orders.order_status}: <Text style={styles.orderStatuss}>{orderData.orderStatus}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.priceView}>
                            <Text style={styles.price}>{orderData.price}</Text>
                        </View>

                    </View>
                    <TouchableOpacity onPress={() => setState({ ...state, productID: 1, rateReview: true })} style={styles.bottomButton}>
                        <Text style={styles.bottomLeftTxt}> {strings.order_details.rate_this_product} </Text>
                        <Icon name="arrow-forward-ios" color={Colors().themeColor} ></Icon>
                    </TouchableOpacity>
                    <OtrixDivider size={"md"} />

                    <OtrixDivider size={"md"} />
                    <Text style={styles.deliveryTitle}>{strings.order_details.shipping_address}</Text>
                    <OtrixDivider size={"sm"} />
                    <View style={styles.cartContent} >
                        <TouchableOpacity style={[styles.deliveryBox]}    >
                            <Text style={styles.addressTxt} numberOfLines={1}>{orderData.deliveryAddress.name}     </Text>
                            <Text style={styles.addressTxt} numberOfLines={2}>{orderData.deliveryAddress.address1}    </Text>
                            <Text style={styles.addressTxt} numberOfLines={2}>{orderData.deliveryAddress.address2}, {orderData.deliveryAddress.city}</Text>
                            <Text style={styles.addressTxt} numberOfLines={1}>{orderData.deliveryAddress.postcode}, {orderData.deliveryAddress.country}</Text>
                        </TouchableOpacity>
                    </View>


                    <OtrixDivider size={"md"} />
                    <Text style={styles.deliveryTitle}>{strings.order_details.order_summary}</Text>
                    <OtrixDivider size={"sm"} />
                    <View style={styles.cartContent} >
                        <View style={[styles.detailBox, { height: hp('16%') }]} >
                            <View style={styles.detailRow}>
                                <View style={styles.leftView}>
                                    <Text style={styles.leftTxt}>{strings.order_details.items_count}</Text>
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.rightTxt}>{orderData.price}</Text>
                                </View>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.leftView}>
                                    <Text style={styles.leftTxt}>{strings.order_details.tax}</Text>
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.rightTxt}>{orderData.tax}</Text>
                                </View>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.leftView}>
                                    <Text style={styles.leftTxt}>{strings.order_details.discount}</Text>
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.rightTxt}>{orderData.discount}</Text>
                                </View>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.leftView}>
                                    <Text style={[styles.leftTxt, { color: Colors().link_color, fontSize: wp('4.5%') }]}>{strings.order_details.order_total}</Text>
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={[styles.rightTxt, , { color: Colors().link_color, fontSize: wp('4.5%') }]}>{orderData.grand_total}</Text>
                                </View>
                            </View>
                        </View>
                    </View>



                </View>


            </OtrixContent>
            <Button
                size="md"
                variant="solid"
                bg={Colors().themeColor}
                style={[GlobalStyles.button, {}]}
                onPress={() => setState({ ...state, cancelOrder: true })}
            >
                <Text style={GlobalStyles.buttonText}>{strings.order_details.cancel_order}</Text>

            </Button>
            <Modal visible={cancelOrder} transparent={true}>
                <View>
                    {Platform.OS === 'ios' &&
                        <View style={{ height: hp('5%') }}></View>
                    }
                    <View style={styles.modelView}>

                        {/* Model header */}
                        <View style={styles.contentView}>
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setState({
                                ...state,
                                cancelOrder: false
                            })}>
                                <Image source={close} style={styles.button} />
                            </TouchableOpacity>
                            <Text style={styles.rateTitle}>{strings.order_details.cancel_order_text}!</Text>

                            <OtrixDivider size={'md'} />
                            <FormControl isRequired isInvalid={cancelSubmited && 'cancelMessage' in errors}>
                                <Input variant="outline"
                                    value={cancelMessage}
                                    placeholder={strings.order_details.cancel_text} style={GlobalStyles.textInputStyle}
                                    onChangeText={(value) => { setState({ ...state, cancelSubmited: false, cancelMessage: value }), delete errors.cancelMessage }}
                                />
                                <FormControl.ErrorMessage
                                    leftIcon={<InfoOutlineIcon size="xs" />}
                                >
                                    {errors.cancelMessage}
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <Button
                                size="md"
                                variant="solid"
                                bg={Colors().themeColor}
                                style={[GlobalStyles.button, { marginHorizontal: wp('4%'), top: hp('4.5%') }]}
                                onPress={() => submitCancelOrder()}
                            >
                                <Text style={GlobalStyles.buttonText}>{strings.order_details.submit}</Text>
                            </Button>
                        </View>


                    </View>

                </View>
            </Modal>


            <Modal visible={rateReview} transparent={true}>
                <View>
                    {Platform.OS === 'ios' &&
                        <View style={{ height: hp('5%') }}></View>
                    }
                    <View style={styles.modelView}>

                        {/* Model header */}
                        <View style={styles.contentView}>
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setState({
                                ...state,
                                rateReview: false
                            })}>
                                <Image source={close} style={styles.button} />
                            </TouchableOpacity>
                            <Text style={styles.rateTitle}>{strings.order_details.rate_product_now}!</Text>
                            <FormControl isRequired isInvalid={submited && 'star' in errors}>

                                <Stars
                                    default={0}
                                    count={5}
                                    half={true}
                                    starSize={60}
                                    fullStar={<FontAwesomeIcon name={'star'} size={wp('3.5%')} style={[styles.myStarStyle]} />}
                                    emptyStar={<FontAwesomeIcon name={'star-o'} size={wp('3.5%')} style={[styles.myStarStyle, styles.myEmptyStarStyle]} />}
                                    halfStar={<FontAwesomeIcon name={'star-half-empty'} size={wp('3.5%')} style={[styles.myStarStyle]} />}
                                    update={(val) => {
                                        setState({
                                            ...state,
                                            submited: false,
                                            star: val
                                        })
                                    }}
                                />
                                {
                                    submited && 'star' in errors && <FormControl.ErrorMessage
                                        leftIcon={<InfoOutlineIcon size="xs" />}
                                    >
                                        {errors.star}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>

                            <OtrixDivider size={'md'} />
                            <FormControl isRequired isInvalid={submited && 'name' in errors}>
                                <Input variant="outline"
                                    value={name}
                                    placeholder={strings.order_details.rate_text} style={GlobalStyles.textInputStyle}
                                    onChangeText={(value) => { setState({ ...state, submited: false, name: value }), delete errors.name }}
                                />
                                <FormControl.ErrorMessage
                                    leftIcon={<InfoOutlineIcon size="xs" />}
                                >
                                    {errors.name}
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <Button
                                size="md"
                                variant="solid"
                                bg={Colors().themeColor}
                                style={[GlobalStyles.button, { marginHorizontal: wp('4%'), top: hp('4.5%') }]}
                                onPress={() => submit()}
                            >
                                <Text style={GlobalStyles.buttonText}>{strings.order_details.submit}</Text>
                            </Button>
                        </View>


                    </View>

                </View>
            </Modal>
            {
                showMessage == true && <OtrixAlert type={type} message={message} />
            }
        </OtrixContainer >

    )
}

function mapStateToProps(state) {
    return {
        cartData: state.cart.cartData,
        strings: state.mainScreenInit.strings,

    }
}


export default connect(mapStateToProps, { proceedCheckout })(OrderDetailScreen);

const styles = StyleSheet.create({

    deliveryTitle: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.8%'),
        color: Colors().text_color,
        marginLeft: wp('2%')
    },
    addressBox: {
        flex: 1,
        height: 'auto',
        borderRadius: wp('2%'),
    },
    deliveryBox: {
        marginHorizontal: wp('1.5%'),
        width: wp('88%'),
        marginVertical: hp('0.5%'),
        height: hp('14.5%'),
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
        flexDirection: 'row',
    },

    cartContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors().white,
        justifyContent: 'center',
        borderRadius: wp('2%'),
    },
    cartBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('11%'),
        width: wp('90%'),
        flex: 0.85,
    },
    detailBox: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    imageView: {
        flex: 0.30,
        backgroundColor: Colors().light_white,
        margin: wp('1%'),
        height: hp('8%'),
        borderRadius: wp('1.5%')
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: undefined,
        aspectRatio: 1,
        width: wp('15.5%')
    },
    infromationView: {
        flex: 0.70,
        marginBottom: hp('1.4%'),
        marginLeft: wp('1%'),
        marginTop: hp('1%'),
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    name: {
        textAlign: 'center',
        color: Colors().text_color,
        fontSize: wp('3.8%'),
        fontFamily: Fonts.Font_Bold,
    },
    orderDate: {
        textAlign: 'center',
        color: Colors().secondry_text_color,
        lineHeight: hp('3%'),
        fontSize: wp('3.5%'),
        fontFamily: Fonts.Font_Regular,
    },
    orderStatuss: {
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('3.5%'),
        color: Colors().text_color
    },
    priceView: {
        flex: 0.15,
        marginTop: hp('1%'),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginRight: wp('2%')
    },
    price: {
        color: Colors().link_color,
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold
    },
    leftView: {
        flex: 0.30,
        marginLeft: wp('3%'),
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    rightView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 0.70
    },
    leftTxt: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('3.5%'),
        color: Colors().secondry_text_color
    },
    rightTxt: {
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('4%'),
        color: Colors().text_color
    },
    detailRow: {
        flexDirection: 'row',
        marginVertical: hp('0.4%')
    },
    modelView: {
        height: hp('100%'),
        width: wp('100%'),
        alignSelf: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(52,52,52,0.8)',
    },
    contentView: {
        marginHorizontal: wp('10%'),
        backgroundColor: Colors().white,
        padding: wp('5%')
    },
    rateTitle: {
        textAlign: 'center',
        fontFamily: Fonts.Font_Semibold,
        fontSize: wp('4.5%'),
        color: Colors().black,
        marginVertical: hp('1.5%')
    },
    myStarStyle: {
        color: '#ffd12d',
        backgroundColor: 'transparent',
        marginHorizontal: 1,
        textShadowRadius: 1,
    },
    myEmptyStarStyle: {
        color: 'gray',
    },
    button: {
        height: _roundDimensions()._height * 0.016,
        width: _roundDimensions()._height * 0.016,
    },
    bottomButton: {
        borderTopColor: Colors().light_white,
        borderTopWidth: 1,
        height: hp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors().white,
        flexDirection: 'row',
        borderRadius: wp('2%'),
        width: wp('90%'),
        marginBottom: hp('0%')
    },
});