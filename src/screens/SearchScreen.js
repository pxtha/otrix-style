import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { connect } from 'react-redux';
import { Button } from 'native-base';
import {
    OtrixContainer, SearchProductsViewComponent, OtirxBackButton, OtrixContent
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from "@helpers/Fonts";
import { updateToWishList } from '@actions';
import { _getWishlist, _addToWishlist } from "@helpers/FunctionHelper";
import MostSearchArr from '@component/items/MostSearchArr';
import SearchProductsArr from '@component/items/SearchProductsArr';
import { Input } from "native-base"

function SearchScreen(props) {
    const [state, setState] = React.useState({ searchKeyword: '', showMost: true, showSuggestions: false });

    const getData = (text) => {
        if (text.length > 2) {
            setState({
                showSuggestions: true,
                showMost: false,
                searchKeyword: text
            });
        }
        else {
            setState({
                showSuggestions: false,
                showMost: true,
                searchKeyword: text
            });
        }
    }


    const search = () => {

    }

    useEffect(() => {
    }, []);
    const { strings } = props;
    const { searchKeyword, showMost, showSuggestions } = state;
    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>
            <View style={[styles.headerView]}>
                <TouchableOpacity style={[GlobalStyles.headerLeft, { flex: 0.10, marginLeft: wp('0.5%'), marginRight: wp('1%') }]} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Icon name="search" style={styles.searchIcon} />
                    <View style={styles.verticalLine}></View>
                    <Input
                        autoFocus={true}
                        variant="outline" placeholder={strings.homepage.placeholder_search}
                        style={[styles.textInputSearchStyle]}
                        returnKeyType="search"
                        value={searchKeyword}
                        onEndEditing={() => search()}
                        onChangeText={(value) => { setState({ ...state, searchKeyword: value }), getData(value) }}
                    >
                    </Input>
                </View>
            </View>

            {
                showMost && <View style={styles.mostSearchView}>
                    <Text style={styles.title}>{strings.search.most_searchs}</Text>
                    <View style={styles.tagRow}>
                        {
                            MostSearchArr.map((item) =>
                                <TouchableOpacity style={styles.tagStyle} key={item} onPress={() => { getData(item) }
                                }>
                                    <Text style={styles.tagText}>{item}</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            }

            {
                showSuggestions && <OtrixContent>
                    <SearchProductsViewComponent navigation={props.navigation} products={SearchProductsArr} />
                </OtrixContent>
            }

        </OtrixContainer >
    )
}

function mapStateToProps(state) {
    return {
        cartData: state.cart.cartData,
        strings: state.mainScreenInit.strings

    }
}


export default connect(mapStateToProps, { updateToWishList })(SearchScreen);

const styles = StyleSheet.create({
    headerView: {
        marginVertical: hp('2%'),
        marginHorizontal: wp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    searchView: {
        height: hp('9%'),
        backgroundColor: Colors().white,
    },
    searchContainer: {
        flex: 0.90,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors().white,
        height: hp('6%'),
    },
    searchIcon: {
        flex: 0.05,
        color: Colors().secondry_text_color,
        alignSelf: 'center',
        textAlign: 'center',
    },
    verticalLine: {

        height: hp('2.5%'),
        backgroundColor: Colors().link_color,
    },
    textInputSearchStyle: {
        fontFamily: Fonts.Font_Reguler,
        backgroundColor: Colors().white,
        fontSize: wp('3.5%'),
        borderRadius: 5,
        color: Colors().secondry_text_color,
        borderWidth: 0,
        flex: 0.90,
        marginHorizontal: wp('5%'),
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
    mostSearchView: {
        backgroundColor: Colors().white,
        padding: hp('1.5%'),
        marginHorizontal: wp('4%'),
        borderRadius: wp('3%')
    },
    title: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().text_color,
        textAlign: 'left'
    },
    tagStyle: {
        justifyContent: 'center',
        padding: hp('1.5%'),
        backgroundColor: Colors().light_white,
        borderRadius: wp('5%'),
        marginHorizontal: wp('2%'),
        marginVertical: hp('0.4%')
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    tagText: {
        fontSize: wp('3.5%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().secondry_text_color
    }
});