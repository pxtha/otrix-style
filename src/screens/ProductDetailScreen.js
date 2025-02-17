import { addToCart, updateToWishList } from '@actions';
import { GET_PRODUCT } from "@apis/queries";
import { useQuery } from '@apollo/client';
import { bottomCart, checkround2, close } from '@common';
import {
    OtirxBackButton,
    OtrixAlert,
    OtrixContainer, OtrixContent, OtrixDivider,
    OtrixLoader,
    RatingComponent,
    SimilarProduct, SizeContainerComponent
} from '@component';
import { filterMapping } from "@component/items/FilterMapping";
import { ProductMapping } from "@component/items/ProductsMapping";
import { SimilarProductsMapping } from "@component/items/SimilarProductsMapping";
import { Colors, GlobalStyles } from '@helpers';
import Fonts from "@helpers/Fonts";
import { _addToWishlist } from "@helpers/FunctionHelper";
import { useRoute } from '@react-navigation/native';
import { Badge, Button, ScrollView } from "native-base";
import React, { useMemo } from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SliderBox } from 'react-native-image-slider-box';
import ImageViewer from 'react-native-image-zoom-viewer';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { reviewMapping } from '../component/items/ReviewMapping';

function ProductDetailScreen(props) {
    const { cartCount, strings, wishlistData } = props;

    const { id } = useRoute().params;
    const [state, setState] = React.useState({ productCount: 1, cartCountState: cartCount, productDetail: null, fetchCart: false, selectedColor: 1, showZoom: false, zoomImages: [], });
    const { selectedColor, productCount, zoomImages, cartCountState, showZoom, fetchCart } = state;
    const [msg, setMsg] = React.useState({ message: null, type: null })
    const { message, type } = msg;

    const { data, loading } = useQuery(GET_PRODUCT, { variables: { slug: parseInt(id) } });
    const productDetail = useMemo(() => {
        if (!data || !data.productOne.single) return {};
        return ProductMapping(data.productOne.single.data)
    }, [data])

    const similarProduct = useMemo(() => {
        if (!data || !data.productOne.related) return [];
        return SimilarProductsMapping(data.productOne.related)
    }, [data])

    const colourFilter = useMemo(() => {
        if (data && data.productOne.single.data.attributes.product_variants) {
            return filterMapping(data.productOne.single.data.attributes.product_variants.data, 'color')
        }
        return [];
    }, [data])

    const sizeFilter = useMemo(() => {
        if (data && data.productOne.single.data.attributes.product_variants) {
            return filterMapping(data.productOne.single.data.attributes.product_variants.data[0]?.attributes?.sizes?.data, 'name')
        }
        return [];
    }, [data])

    const reviews = useMemo(() => {
        if (data && data.productOne.single.data.attributes.reviews) {
            return reviewMapping(data.productOne.single.data.attributes.reviews.data)
        }
        return {}
    }, [data])

    const _CartData = () => {
        setState({ ...state, fetchCart: false, cartCountState: cartCount })
        if (cartCountState < props.cartCount) {
            setMsg({ message: 'Product Successfully Added To Cart', type: 'success' });
        }
        setTimeout(() => {
            setMsg({ message: null, type: '' });
        }, 2500);
    }

    const showOutofStock = () => {
        setTimeout(() => {
            setMsg({ message: null, type: '' });
        }, 2500);
        setMsg({ message: 'Product out of stock', type: 'error', fetchCart: false });
    }

    const _addToCart = () => {
        console.log("PRODU ", productDetail.id)
        setState({ ...state, fetchCart: false })
        props.addToCart(productDetail.id, parseInt(productCount))
    }

    const _addToFav = async () => {
        console.log("CLiCK")
        let wishlistData = await _addToWishlist(id);
        props.updateToWishList(wishlistData, id)
    }
    // useEffect(() => {
    //     // let findProduct = productDetail.filter(p => p.id == id);

    //     //zoom images
    //     let zoomImages = [];
    //     // productDetail.images.length > 0 && productDetail.images.forEach(function (item) {
    //     //     zoomImages.push({
    //     //         url: item,
    //     //         props: {
    //     //             source: item
    //     //         }
    //     //     })
    //     // });

    //     let loadPage = setTimeout(() => setState({ ...state, productDetail: productDetail, zoomImages }), 100);

    //     return () => {
    //         clearTimeout(loadPage);
    //     };
    // }, [cartCountState < cartCount && _CartData()]);

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {
                loading ? <OtrixLoader /> : <>

                    {/* Product Detail View */}
                    {
                        productDetail && productDetail?.images?.length &&
                        <View style={styles.container} >
                            <SliderBox images={productDetail.images}
                                onCurrentImagePressed={index => setState({ ...state, showZoom: true })}
                                dotColor={Colors().themeColor}
                                inactiveDotColor="#90A4AE"
                                sliderBoxHeight={hp('35%')}
                                paginationBoxVerticalPadding={20}
                                autoplay={true}
                                ImageComponentStyle={{ borderRadius: 15, width: '80%', marginTop: 5, }}
                                circleLoop={true}
                                resizeMode={'cover'}
                                dotStyle={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 15,
                                    marginHorizontal: 0,
                                    padding: 0,
                                    margin: 0
                                }}
                            />
                        </View>
                    }

                    {/* Header */}
                    <View style={{ flexDirection: 'row', position: 'absolute', marginTop: hp('2%'), zIndex: 9999999 }}>
                        <TouchableOpacity style={[GlobalStyles.headerLeft, { zIndex: 999999999, flex: 0.90, alignItems: 'flex-start' }]} onPress={() => props.navigation.goBack()}>
                            <OtirxBackButton />
                        </TouchableOpacity>
                        <TouchableOpacity style={[GlobalStyles.headerRight, { zIndex: 999999999, flex: 0.10, backgroundColor: 'transparent', alignItems: 'center', alignSelf: 'flex-end' }]} onPress={() => props.navigation.navigate('CartScreen')}>
                            <Image source={bottomCart} style={styles.menuImage} />
                            {
                                cartCount > 0 && <Badge style={[GlobalStyles.badge, {
                                    left: wp('4.4%'),
                                    top: - hp('1.4%'),
                                    height: cartCount > 9 ? 28 : 24,
                                    width: cartCount > 9 ? 28 : 24,
                                    backgroundColor: Colors().white
                                }]}>
                                    <Text style={[GlobalStyles.badgeText, { color: Colors().themeColor, fontSize: cartCount > 9 ? wp('2.5%') : wp('3%'), }]}>{cartCount}</Text>
                                </Badge>
                            }
                        </TouchableOpacity>
                    </View>

                    {/* Content Start from here */}
                    <OtrixContent customStyles={styles.productDetailView}>
                        <OtrixDivider size={'lg'} />
                        <ScrollView style={styles.childView} showsVerticalScrollIndicator={false}>

                            {/* Color And Heart Icon */}
                            <View style={styles.colorView}>
                                {/* Color */}
                                {colourFilter.length > 0 ? <View style={styles.colorContainer}>
                                    <Text style={styles.containerTxt}>{strings.product_details.color}:</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: wp('1%') }}>

                                        {
                                            colourFilter.map((item, index) =>
                                                <TouchableOpacity key={index.toString()} style={[styles.box, { backgroundColor: item.name.toLowerCase() }]} onPress={() => setState({ ...state, selectedColor: index })}>
                                                    {index == selectedColor && <Image source={checkround2} style={styles.colorimageView} />}
                                                </TouchableOpacity>
                                            )
                                        }

                                        <TouchableOpacity style={{ justifyContent: 'center' }}>
                                            <Icon name="right" style={styles.arrowRight} ></Icon>
                                        </TouchableOpacity>

                                    </View>
                                </View> : <View style={styles.colorContainer}></View>}

                                {/* Heart Icon */}
                                <View style={styles.heartIconView}>
                                    {
                                        wishlistData && wishlistData.length > 0 && wishlistData.includes(productDetail.id) ? <TouchableOpacity onPress={() => _addToFav(productDetail.id)} style={[GlobalStyles.FavCircle, { left: wp('12%'), top: 0 }]} >
                                            <FontAwesomeIcon name="heart" style={GlobalStyles.FavIcon} color={Colors().white} />
                                        </TouchableOpacity> : <TouchableOpacity onPress={() => _addToFav(productDetail.id)} style={[GlobalStyles.unFavCircle, { left: wp('12%'), top: 0 }]} >
                                            <FontAwesomeIcon name="heart-o" style={[GlobalStyles.unFavIcon, { fontSize: wp('3.8%') }]} color={Colors().secondry_text_color} />
                                        </TouchableOpacity>
                                    }
                                </View>

                            </View>

                            <OtrixDivider size={'md'} />

                            {/* Name Container*/}
                            <View style={styles.subContainer}>
                                <Text style={styles.headingTxt}>{productDetail.name}</Text>
                                <Text style={[styles.stock, {
                                    color: !productDetail.out_of_stock ? '#5ddb79' : '#fe151b'
                                }]}>{!productDetail.out_of_stock ? 'In Stock' : 'Out of stock'}</Text>
                            </View>
                            <OtrixDivider size={'md'} />

                            {/* Price Container*/}
                            <View style={styles.subContainer}>
                                <Text style={styles.productPrice}>{productDetail.price}</Text>
                                <View style={styles.starView}>
                                    {/* <Stars
                                        default={reviews.rating ?? 0}
                                        count={5}
                                        half={true}
                                        starSize={45}
                                        fullStar={<FontAwesomeIcon name={'star'} size={wp('3.5%')} style={[styles.myStarStyle]} />}
                                        emptyStar={<FontAwesomeIcon name={'star-o'} size={wp('3.5%')} style={[styles.myStarStyle, styles.myEmptyStarStyle]} />}
                                        halfStar={<FontAwesomeIcon name={'star-half-empty'} size={wp('3.5%')} style={[styles.myStarStyle]} />}
                                        disabled={true}
                                    /> */}
                                    <Text style={styles.reviewTxt}>({reviews?.data?.length ?? 0} {strings.product_details.review})</Text>
                                </View>
                            </View>
                            <OtrixDivider size={'lg'} />
                            <View style={GlobalStyles.horizontalLine}></View>
                            <OtrixDivider size={'md'} />

                            {/* Sizes Container*/}
                            <SizeContainerComponent productData={sizeFilter} />

                            <OtrixDivider size={'md'} />

                            {/* Description Container*/}
                            <Text style={[styles.headingTxt, { fontSize: wp('3.8%') }]}>{strings.product_details.description}</Text>
                            <OtrixDivider size={'sm'} />
                            <Text style={styles.description}>{productDetail.description}</Text>
                            <OtrixDivider size={'md'} />
                            <View style={GlobalStyles.horizontalLine}></View>


                            {/* Rating Container*/}
                            <RatingComponent strings={strings} productData={reviews} />

                            {/* Similar Product Component */}
                            <SimilarProduct strings={strings} navigation={props.navigation} similarProduct={similarProduct} />

                        </ScrollView>
                    </OtrixContent>

                    {/* Zoom image */}
                    <Modal visible={showZoom}
                        transparent={true}>
                        <ImageViewer imageUrls={zoomImages}
                            saveToLocalByLongPress={false}
                            backgroundColor={Colors().light_white}
                            renderIndicator={
                                (currentIndex, allSize) => {
                                    return (
                                        <View style={styles.pageindexview}>
                                            <TouchableOpacity onPress={() => setState({ ...state, showZoom: false })} style={{ padding: 8 }}>
                                                <Image square source={close} style={styles.cancleIcon} />
                                            </TouchableOpacity>
                                            <Text style={styles.pageindextext}>{currentIndex} / {allSize}</Text>
                                        </View>
                                    );
                                }
                            }
                        />
                    </Modal>

                    {/* Bottom View */}
                    <View style={styles.footerView}>
                        <Button
                            size="md"
                            variant="solid"
                            bg={Colors().themeColor}
                            isLoading={fetchCart}
                            style={[GlobalStyles.button, { flex: 0.70, marginHorizontal: wp('2%') }]}
                            onPress={() => !productDetail.out_of_stock ? _addToCart() : showOutofStock()}
                        >
                            <Text style={GlobalStyles.buttonText}>{strings.product_details.add_to_cart}</Text>
                        </Button>
                        <View style={styles.countBox}>
                            <Text style={styles.countTxt}>{productCount}</Text>
                            <View style={styles.arrowContainer}>
                                <TouchableOpacity style={{ flex: 0.50 }} onPress={() => setState({ ...state, productCount: productCount + 1 })}>
                                    <MaterialIconsIcon name="keyboard-arrow-up" style={styles.plusminusArrow} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 0.50 }} onPress={() => setState({ ...state, productCount: productCount > 1 ? productCount - 1 : 1 })}>
                                    <MaterialIconsIcon name="keyboard-arrow-down" style={styles.plusminusArrow} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </>
            }
            {
                message != null && <OtrixAlert type={type} message={message} />
            }
        </OtrixContainer >
    )
}


function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings,
        cartCount: state.cart.cartCount,
        wishlistData: state.wishlist.wishlistData,
    }
}

export default connect(mapStateToProps, { addToCart, updateToWishList })(ProductDetailScreen);

const styles = StyleSheet.create({
    productDetailView: {
        backgroundColor: Colors().white,
        marginHorizontal: 0,
        borderTopRightRadius: wp('13%'),
        borderTopLeftRadius: wp('13%')
    },
    container: {
        height: hp('35%'),
        position: 'relative',
        backgroundColor: Colors().light_white,
        zIndex: 99
    },
    childView: {
        marginHorizontal: wp('5%'),
        paddingBottom: hp('1.8%')
    },
    menuImage: {
        width: wp('6%'),
        height: hp('6%'),
        resizeMode: 'contain',
        tintColor: Colors().themeColor
    },
    colorView: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1
    },
    colorContainer: {
        flex: 0.75,
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    containerTxt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Reguler,
        color: Colors().secondry_text_color
    },
    box: {
        height: hp('3.5%'),
        width: wp('8%'),
        flexDirection: 'row',
        marginHorizontal: wp('2%'),
        backgroundColor: Colors().white,
        justifyContent: 'center',
        borderRadius: 5,
        borderColor: Colors().light_gray,
        borderWidth: 1,
        alignItems: 'center'
    },
    borderBox: {
        borderColor: Colors().themeColor,
        borderWidth: 1,
    },
    colorimageView: {
        height: hp('2%'),
        width: wp('4%'),
        borderRadius: 50,
        marginHorizontal: wp('1%'),
    },
    arrowRight: {
        fontSize: wp('3.5%'), textAlign: 'center', textAlignVertical: 'center', color: Colors().text_color
    },
    heartIconView: {
        flex: 0.25,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headingTxt: {
        fontSize: wp('4.5%'),
        fontFamily: Fonts.Font_Bold,
        textAlignVertical: 'center',
        flex: 0.80
    },
    subContainer: {
        flexDirection: 'row',
    },
    stock: {
        flex: 0.20,
        fontSize: wp('3%'),
        textAlignVertical: 'center',
        fontFamily: Fonts.Font_Semibold,
        textAlign: 'right'
    },
    productPrice: {
        fontSize: wp('5.5%'),
        fontFamily: Fonts.Font_Bold,
        textAlignVertical: 'center',
        color: Colors().themeColor,
        flex: 0.80
    },
    starView: {
        flex: 0.20
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
    reviewTxt: {
        fontFamily: Fonts.Font_Reguler,
        fontSize: wp('2.5%'),
        marginTop: hp('0.3%'),
        textAlign: 'center',
        color: Colors().secondry_text_color
    },
    description: {
        fontSize: wp('3.5%'),
        fontFamily: Fonts.Font_Reguler,
        lineHeight: hp('2.4%'),
        color: Colors().secondry_text_color
    },
    footerView: {
        flexDirection: 'row',
        backgroundColor: Colors().white,
        height: hp('7.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        borderTopColor: Colors().light_gray,
        borderTopWidth: 1
    },
    countBox: {
        backgroundColor: Colors().light_white,
        flexDirection: 'row',
        flex: 0.20,
        height: hp('4.8%'),
        marginHorizontal: wp('1%'),
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0.4 },
        shadowOpacity: 0.30,
        shadowRadius: 3,
        elevation: 6,
        borderRadius: 5,
        justifyContent: 'center'
    },
    countTxt: {
        fontSize: wp('4.5%'),
        flex: 0.60,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors().text_color,
        fontFamily: Fonts.Font_Semibold

    },
    arrowContainer: {
        flex: 0.40,
        flexDirection: 'column',
    },
    plusminusArrow: {
        fontSize: wp('5.2%'),

    },
    cancleIcon: {
        marginLeft: wp('3%'),
        height: wp('6%'),
        width: wp('6%'),
        tintColor: Colors().black
    },
    pageindexview: {
        position: 'absolute',
        marginTop: wp('4.5%'),
        flexDirection: 'row'
    },
    pageindextext: {
        width: wp('15%'),
        textAlign: 'center',
        fontSize: wp('4.5%'),
        color: Colors().black_text,
        marginHorizontal: wp('34%')
    },
});