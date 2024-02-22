import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { requestInit } from '@actions';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtirxBackButton, OtrixDivider
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers'
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from "../helpers/Fonts";

function EditProfileScreen(props) {
    const [state, setData] = React.useState({ first_name: 'Otrixweb', last_name: "User", email: "otrixweb@mail.com", phone: "9898989898", submited: false });

    const { first_name, last_name, email, phone, submited } = state;
    const { strings } = props;

    return (
        <OtrixContainer>

            {/* Header */}
            <OtrixHeader customStyles={{ backgroundColor: Colors().light_white }}>
                <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity>
                <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
                    <Text style={[GlobalStyles.headingTxt, { lineHeight: hp('5%') }]}>  {strings.account.label_edit_profile}</Text>
                </View>
            </OtrixHeader>
            <OtrixDivider size={'md'} />
            {/* Content Start from here */}
            <OtrixContent>

                {/* Profile  Start from here */}
                <FormControl isRequired isInvalid={submited && first_name == '' ? true : false}>
                    <Input variant="outline"
                        value={first_name}
                        placeholder={strings.commoninput.placeholder_first_name} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => setData({ ...state, first_name: value })}
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        First Name is required
                    </FormControl.ErrorMessage>
                </FormControl>

                <OtrixDivider size={'md'} />
                <FormControl >
                    <Input variant="outline"
                        value={last_name}
                        placeholder={strings.commoninput.placeholder_last_name} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => setData({ ...state, last_name: value })}
                    />
                </FormControl>
                <OtrixDivider size={'md'} />

                <FormControl isRequired isInvalid={submited && email == '' ? true : false}>
                    <Input variant="outline"
                        value={email}
                        keyboardType="email-address"
                        placeholder={strings.commoninput.placeholder_email} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => setData({ ...state, email: value })}
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        Email is required
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'md'} />

                <FormControl isRequired isInvalid={submited && phone == '' ? true : false}>
                    <Input variant="outline"
                        value={phone}
                        keyboardType="number-pad"
                        placeholder={strings.commoninput.placeholder_phone} style={GlobalStyles.textInputStyle}
                        onChangeText={(value) => setData({ ...state, phone: value })}
                    />
                    <FormControl.ErrorMessage
                        leftIcon={<InfoOutlineIcon size="xs" />}
                    >
                        Mobile Number is required
                    </FormControl.ErrorMessage>
                </FormControl>
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    onPress={() => props.navigation.navigate('MainScreen')}
                >
                    <Text style={GlobalStyles.buttonText}>{strings.reset_password.button_reset}</Text>
                </Button>
                <OtrixDivider size={'md'} />



            </OtrixContent>

        </OtrixContainer >
    )

}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings
    }
}

export default connect(mapStateToProps, { requestInit })(EditProfileScreen);

const styles = StyleSheet.create({


});