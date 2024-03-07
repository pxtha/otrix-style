import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import { Colors } from '@helpers'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import Fonts from '@helpers/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/FontAwesome5';

function CartView(props) {
    let cartProduct = props.products;
    const PriceQuantity = (price, quantity) => {
        let amt = parseFloat(price.replace('$', ''));
        let qty = parseInt(quantity);
        return '$' + amt;
    }
    return (
        <>
            <OtrixDivider size={'md'} />
            {
                cartProduct.length > 0 && cartProduct.map((item) =>
                    <View style={styles.cartContent} key={item.id}>
                        <View style={styles.cartBox} >
                            <View style={styles.imageView}>
                                <Image source={{ uri: item.image }} style={styles.image}
                                ></Image>
                            </View>
                            <View style={styles.infromationView}>
                                <TouchableOpacity style={{ padding: 4 }} onPress={() => props.navigation.navigate('ProductDetailScreen', { id: item.id })}>
                                    <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
                                </TouchableOpacity>
                                <Text style={styles.price}>{PriceQuantity(item.price + "$", item.quantity)}</Text>
                                <View style={styles.plusminus}>
                                    <TouchableOpacity style={{ marginRight: wp('2.5%'), padding: 4 }} onPress={() => item.quantity != 1 && props.decrementItem(item.id)}>
                                        <Icon name="minus" style={styles.plusminusTxt} />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityTxt}>{item.quantity}</Text>
                                    <TouchableOpacity style={{ marginLeft: wp('2.5%'), padding: 4 }} onPress={() => props.incrementItem(item.id)}>
                                        <Icon name="plus" style={styles.plusminusTxt} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.deleteIcon} onPress={() => props.deleteItem(item.id)}>
                            <MatIcon name="trash" style={styles.delete} />
                        </TouchableOpacity>
                    </View>
                )
            }
        </>
    )
}

export default CartView;
const styles = StyleSheet.create({
    cartContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors().white,
        justifyContent: 'center',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        marginBottom: wp('3%'),
        borderRadius: wp('2%'),
        marginLeft: wp('1.5%'),
    },
    cartBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('14%'),
        width: wp('100%'),
        flex: 0.90,
    },
    imageView: {
        flex: 0.30,
        backgroundColor: Colors().light_white,
        marginVertical: wp('1%'),
        marginRight: wp('4%'),
        height: hp('12%'),
        borderRadius: wp('1.5%')
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: undefined,
        aspectRatio: 1,
        width: wp('21.5%')
    },
    infromationView: {
        flex: 0.90,
        marginBottom: hp('1.4%'),
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: "nowrap"
    },
    name: {
        textAlign: 'center',
        color: Colors().secondry_text_color,
        fontSize: wp('3.8%'),
        fontFamily: Fonts.Font_Bold,
    },
    price: {
        textAlign: 'center',
        color: Colors().link_color,
        lineHeight: hp('4%'),
        fontSize: wp('5%'),
        fontFamily: Fonts.Font_Bold,
    },
    plusminus: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginTop: hp('1%')
    },
    plusminusTxt: {
        fontSize: wp('3%'),
        color: Colors().secondry_text_color,
        textAlign: 'center',
    },
    quantityTxt: {
        fontSize: wp('4%'),
        color: Colors().text_color,
        marginHorizontal: wp('1%'),
        fontFamily: Fonts.Font_Bold,
        textAlign: 'center',
    },
    deleteIcon: {
        flex: 0.10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginRight: wp('2%'),
        padding: 4
    },
    delete: {
        fontSize: wp('3.6%'),
        color: Colors().secondry_text_color
    }
});