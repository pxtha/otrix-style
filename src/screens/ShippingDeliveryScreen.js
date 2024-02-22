import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    StyleSheet,
} from "react-native";
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent, OtrixLoader
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";
// import getApi from "@apis/getApi";
// import { logfunction } from "@helpers/FunctionHelper";
import RenderHtml from 'react-native-render-html';

function ShippingDeliveryScreen(props) {

    const [state, setState] = React.useState({ content: [], loading: true, heading: null });
    const { content, heading, loading } = state;



    // const { width } = useWindowDimensions();
    // const tagsStyles = {
    //     p: {
    //         color: Colors().black,
    //         fontFamily: Fonts.Font_Reguler,
    //         fontSize: wp('3.5%'),
    //         lineHeight: hp('2.4%'),
    //     }
    // };

    return (
        <OtrixContainer customStyles={{ backgroundColor: Colors().light_white }}>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={GlobalStyles.headingTxt}>Shipping & Delivery Policy</Text>
                </View>
            </OtrixHeader>

            {/* Orders Content start from here */}
            <OtrixContent>
                <View style={styles.box}>
                    <Text style={styles.txt}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Text>
                    <Text style={styles.txt}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Text>
                    <Text style={styles.txt}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Text>
                </View>
                <OtrixDivider size={'md'} />
            </OtrixContent>


        </OtrixContainer >

    )
}

function mapStateToProps(state) {
    return {

    }
}


export default connect(mapStateToProps, {})(ShippingDeliveryScreen);

const styles = StyleSheet.create({

    box: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp('1.5%'),
        backgroundColor: Colors().white,
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        borderRadius: wp('2%'),
        borderWidth: 0.5,
        borderColor: Colors().custom_gray
    },
    txt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().text_color,
        textAlign: 'left'
    }

});