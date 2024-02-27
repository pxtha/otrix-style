import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixLoader, OtirxBackButton, CategoryView
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util'

function CategoryScreen(props) {
    const { strings } = props;

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 0.90 }]}>
                    <Text style={GlobalStyles.headingTxt}>{strings.categories.title}</Text>
                </View>
            </OtrixHeader>

            {/* Content Start from here */}
            <OtrixContent >

                {/* Category Component Start from here */}
                <CategoryView navigation={props.navigation} />

            </OtrixContent>

        </OtrixContainer >
    )
}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings
    }
}


export default connect(mapStateToProps, {})(CategoryScreen);

const styles = StyleSheet.create({

    menuImage: {
        width: wp('5%'),
        height: hp('4%'),
        tintColor: Colors().secondry_text_color,
    },


    bannerStyle: {
        resizeMode: 'contain',
        width: wp('100%'),
        height: hp('16%'),
        alignSelf: 'center'
    }
});