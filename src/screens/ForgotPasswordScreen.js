import React from "react";
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider
} from '@component';
import { Input, Text, View, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { GlobalStyles, isValidEmail, Colors } from '@helpers'
import { logfunction } from "@helpers/FunctionHelper";
import getApi from "@apis/getApi";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fonts from "../helpers/Fonts";

function ForgotPasswordScreen(props) {
    const [formData, setData] = React.useState({ email: null, submited: false, loading: false, type: null, message: null });
    const [errors, setErrors] = React.useState({});
    const { email, loading, submited, message, type } = formData;
    const { strings } = props;
    const validate = () => {

        setData({ ...formData, submited: true })

        if (!isValidEmail(email).success) {
            logfunction("FIeld ", isValidEmail(email).message)
            setErrors({
                ...errors,
                invalidEmail: isValidEmail(email).message
            });
            return false;
        }

        return true;

    }

    const submit = () => {

        if (validate()) {
            setData({
                ...formData,
                loading: true
            });
            let sendData = new FormData();
            sendData.append('email', email);
            try {
                //do api stuff here
                setData({
                    ...formData,
                    loading: false
                });
                props.navigation.navigate("VerifyOTPScreen", { email: email })
            } catch (error) {
                logfunction("Error", error)
                setData({
                    ...formData,
                    loading: false
                });
            }
        }
    }

    return (

        <OtrixContainer >

            {/* Content Start from here */}
            <OtrixContent customStyles={{
                flex: 1,
                backgroundColor: Colors().offWhite,
                borderRadius: 0,
                marginHorizontal: 0,
            }}>

                {

                    <View style={{ marginHorizontal: wp('4%') }}>
                        <Text style={{
                            fontSize: wp('7%'),
                            fontFamily: Fonts.Font_Bold,
                            color: Colors().black_text,
                            textAlign: 'left',
                            marginTop: hp('5%'),
                            lineHeight: hp('5%')
                        }}>Forgot Password</Text>
                        <Text style={{
                            fontSize: wp('4%'),
                            fontFamily: Fonts.Font_Reguler,
                            color: Colors().dark_gray,
                            textAlign: 'left',
                            marginTop: hp('0.1%'),
                            lineHeight: hp('4%')
                        }}>Check your email address we send you OTP </Text>

                    </View>
                }

                {/* Login Form Start from here */}
                <View style={{
                    flex: 1,
                    padding: wp('5%'),
                    marginTop: hp('5%'),
                    backgroundColor: Colors().white,
                    borderTopLeftRadius: wp('12%'),
                    borderTopRightRadius: wp('12%'),
                    height: hp('100%')
                }}>
                    <OtrixDivider size={'lg'} />

                    {/* Forgot password form Start from here */}
                    <FormControl isRequired style={{ backgroundColor: Colors().white }} isInvalid={submited && 'email' in errors || 'invalidEmail' in errors}>
                        <Input variant="outline" placeholder={strings.commoninput.placeholder_email} style={[GlobalStyles.textInputStyle]}
                            value={email}
                            onChangeText={(value) => { setData({ ...formData, email: value }), delete errors.email, delete errors.invalidEmail }}
                        />
                        {
                            'invalidEmail' in errors == false && 'email' in errors && <FormControl.ErrorMessage
                                leftIcon={<InfoOutlineIcon size="xs" />}
                            >
                                {errors.email}
                            </FormControl.ErrorMessage>
                        }
                        {
                            'invalidEmail' in errors && <FormControl.ErrorMessage
                                leftIcon={<InfoOutlineIcon size="xs" />}
                            >
                                {errors.invalidEmail}
                            </FormControl.ErrorMessage>
                        }
                    </FormControl>
                    <OtrixDivider size={'md'} />
                    <Button
                        size="md"
                        variant="solid"
                        bg={Colors().themeColor}
                        style={GlobalStyles.button}
                        isLoading={loading}
                        onPress={() => submit()}
                    >
                        <Text style={GlobalStyles.buttonText}>Submit</Text>
                    </Button>
                    <OtrixDivider size={'md'} />
                    {
                        message != null && <OtrixAlert type={type} message={message} />
                    }
                </View>
            </OtrixContent>

        </OtrixContainer >
    )

}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings
    }
}

export default connect(mapStateToProps)(ForgotPasswordScreen);
