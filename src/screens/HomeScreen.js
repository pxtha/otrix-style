import { addToWishList } from '@actions';
import { GET_HOME_DATA } from "@apis/queries";
import { useQuery } from "@apollo/client";
import { avatarImg, avatarImg2, heart } from '@common';
import {
    BestDeal,
    HomeCategoryView,
    HomeSlider,
    NewProduct,
    OtrixContainer, OtrixContent, OtrixDivider,
    OtrixHeader,
    SearchBar,
    TrendingProduct
} from '@component';
import { bannerMapping } from "@component/items/BannerMapping.js";
import { Colors, GlobalStyles } from '@helpers';
import Fonts from "@helpers/Fonts";
import { _addToWishlist } from "@helpers/FunctionHelper";
import { _roundDimensions } from '@helpers/util';
import { HomeSkeleton } from '@skeleton';
import { Badge } from "native-base";
import React, { useEffect } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

function HomeScreen(props) {
    const { data } = useQuery(GET_HOME_DATA);

    const { deal, new_arrival, trending, banner } = data?.home?.data?.attributes || {}
    const [state, setState] = React.useState({ notificationCount: 9, loading: true });
    const { loading } = state;
    const { authStatus, wishlistData, strings, wishlistCount } = props;
    const offerBanner = bannerMapping(banner).filter(v => v !== null);
    const [bannerTop = {}, bannerMid = {}, bannerBot = {}] = offerBanner;

    const addToWish = async (id) => {
        let wishlistData = await _addToWishlist(id);
        props.addToWishList(wishlistData);
    }

    useEffect(() => {
        let loadHomePage = setTimeout(() => setState({ ...state, loading: false }), 300);
        return () => {
            clearTimeout(loadHomePage);
        };
    }, []);

    return (

        <OtrixContainer customStyles={{ backgroundColor: Colors().white }}>
            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().white }}>
                <TouchableOpacity style={styles.headerLeft} onPress={() => props.navigation.navigate('ProfileScreen')}>
                    {
                        authStatus ?


                            <View style={{
                                marginLeft: wp('2%'), alignItems: 'center',
                                elevation: 2,
                                borderWidth: 2, borderColor: Colors().white, height: hp('6%'), width: wp('13%')
                            }}>
                                <Image
                                    ml="3"
                                    size="sm"
                                    style={{ resizeMode: 'contain', height: hp('5.4%'), }}
                                    source={avatarImg}
                                />
                            </View>
                            : <Image
                                ml="3"
                                size="sm"
                                style={styles.avatarImg}
                                source={avatarImg2}
                            >
                            </Image>
                    }
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headingTxt}>Otrixweb</Text>
                </View>
                {/* <Image
                    ml="3"
                    size="sm"
                    style={styles.avatarImg}
                    source={avatarImg}
                /> */}
                {
                    !loading &&
                    <TouchableOpacity style={styles.headerRight} onPress={() => props.navigation.navigate('WishlistScreen')}>
                        <Image source={heart} style={styles.heartIcon}></Image>
                        {
                            wishlistCount > 0 &&
                            <Badge style={[GlobalStyles.badge, {
                                height: wishlistCount > 9 ? _roundDimensions()._height * 0.038 : _roundDimensions()._height * 0.032,
                                width: wishlistCount > 9 ? _roundDimensions()._height * 0.038 : _roundDimensions()._height * 0.032,
                                borderRadius: _roundDimensions()._borderRadius,
                                right: wishlistCount > 9 ? -wp('0.6%') : wp('0.2%'),
                                top: wishlistCount > 9 ? -hp('0.5%') : hp('0.1%')
                            }]}>

                                <Text style={[GlobalStyles.badgeText, styles.countText, { fontSize: wishlistCount > 9 ? wp('2.2%') : wp('3%') }]}>{wishlistCount}</Text>
                            </Badge>
                        }

                    </TouchableOpacity>
                }


            </OtrixHeader>

            {
                loading ? <HomeSkeleton /> :
                    <OtrixContent >

                        {/* SearchBar Component */}
                        <SearchBar navigation={props.navigation} strings={strings} />

                        {/* HomeCategoryView Component */}
                        <HomeCategoryView navigation={props.navigation} strings={strings} />

                        {/* HomeSlider Component */}
                        <HomeSlider images={bannerTop.top} />
                        <OtrixDivider size={'md'} />

                        {/* NewProduct Component */}
                        <NewProduct navigation={props.navigation} wishlistArr={wishlistData} addToWishlist={addToWish} strings={strings} newProducts={new_arrival} />

                        {/* Banner Image */}
                        <HomeSlider images={bannerMid.mid} />
                        <OtrixDivider size={'sm'} />

                        {/* BestDeal Component */}
                        <BestDeal strings={strings} navigation={props.navigation} wishlistArr={wishlistData} addToWishlist={addToWish} dealProducts={deal} />
                        <OtrixDivider size={'sm'} />

                        {/* Banner Image */}
                        <HomeSlider images={bannerBot.bottom} />
                        <OtrixDivider size={'sm'} />

                        {/* TrendingProduct Component */}
                        <TrendingProduct strings={strings} navigation={props.navigation} wishlistArr={wishlistData} addToWishlist={addToWish} trendingProducts={trending} />

                    </OtrixContent>
            }


        </OtrixContainer >
    )
}
function mapStateToProps(state) {
    return {
        authStatus: state.auth.authStatus,
        wishlistData: state.wishlist.wishlistData,
        wishlistCount: state.wishlist.wishlistCount,
        strings: state.mainScreenInit.strings
    }
}

export default connect(mapStateToProps, { addToWishList })(HomeScreen);

const styles = StyleSheet.create({
    headerRight: {
        flex: 0.15,
        marginRight: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIcon: {
        width: wp('6.5%'),
        height: hp('6.5%'),
        resizeMode: 'contain',
        tintColor: Colors().custom_pink,
    },
    headerCenter: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingTxt: {
        fontFamily: Fonts.Font_Bold,
        fontSize: wp('6.5%'),
        color: Colors().themeColor
    },
    headerLeft: {
        flex: 0.15,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    bannerStyle: {
        resizeMode: 'contain',
        width: wp('100%'),
        height: hp('16%'),
        alignSelf: 'center'
    },
    avatarImg: {
        height: hp('11%'),
        marginLeft: wp('2%'),
        width: wp('11%'),
        resizeMode: 'contain',

    }
});