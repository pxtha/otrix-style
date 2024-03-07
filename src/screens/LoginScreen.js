import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from "react-native";
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixSocialContainer, OtrixAlert, OtrixSideNav
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors, isValidEmail, isValidpassword } from '@helpers'
import { logfunction } from "@helpers/FunctionHelper";
import Fonts from "../helpers/Fonts";
import { _roundDimensions } from '@helpers/util'
import { bindActionCreators } from 'redux';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { doLogin } from '@actions';
import getApi from "@apis/getApi";

import Icon from 'react-native-vector-icons/Ionicons';
import FBSDK, { LoginManager } from 'react-native-fbsdk';
const { AccessToken, GraphRequest, GraphRequestManager } = FBSDK;
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,//
} from '@react-native-google-signin/google-signin';

function LoginScreen(props) {

    const [formData, setData] = React.useState({ email: null, password: null, submited: false, loading: false, type: null, message: null, navTo: 'HomeScreen' });
    const [state, setDatapassword] = React.useState({ secureEntry: true });
    const [errors, setErrors] = React.useState({});
    const { email, password, submited, loading, message, type, navTo } = formData;


    const validate = () => {

        setData({ ...formData, submited: true })

        if (email == null) {
            logfunction("FIeld ", 'Email is required')
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return false;
        }
        else if (!isValidEmail(email).success) {
            logfunction("FIeld ", isValidEmail(email).message)
            setErrors({
                ...errors,
                invalidEmail: isValidEmail(email).message
            });
            return false;
        }
        else if (!isValidpassword(password).success) {
            logfunction("FIeld ", isValidpassword(password).message)
            setErrors({
                ...errors,
                password: isValidpassword(password).message
            });
            return false;
        }
        return true;

    }


    const login = () => {
        if (validate()) {
            setData({
                ...formData,
                loading: true
            });

            try {
                setData({
                    ...formData,
                    loading: false
                });

                props.doLogin({ email: email, password: password });
                // props.navigation.push("MainScreen")
            } catch (error) {
                logfunction("Error", error)
                setData({
                    ...formData,
                    loading: false
                });
            }
        }
    }

    //facebook login 🧔🏻
    const _fbAuth = () => {
        // Attempt a login using the Facebook login dialog asking for default permissions and email.
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            (result) => {
                if (result.isCancelled) {
                } else {
                    const responseInfoCallback = async (error, result) => {
                        if (error) {
                            Toast.show('Error fetching data: ' + error.toString(), {
                                duration: 3000,
                                position: Toast.positions.CENTER,
                                shadow: true,
                                animation: true,
                                hideOnPress: true,
                                delay: 0,
                            })
                        } else {
                            logfunction("Facebook response ", result)
                            let email = result.email ? result.email : result.id;
                            let image = result.picture ? result.picture.data.url : '';
                            let sendData = new FormData();
                            sendData.append("email", email)
                            sendData.append("password", result.id)
                            sendData.append("creation", 'F')
                            setData({
                                ...formData,
                                loading: true
                            });

                            //login to our server 🧛🏻‍♀️
                            try {
                                getApi.postData(
                                    'user/socialLogin',
                                    sendData,
                                ).then((response => {
                                    logfunction("Social RESPONSE ", response)
                                    if (response.status == 1) {
                                        logfunction("RESPONSE ", 'Success')
                                        setData({
                                            ...formData,
                                            email: null,
                                            password: null,
                                            loading: false
                                        });
                                        props.doLogin(response, navTo);
                                    }
                                    else {
                                        //navigation part  😎
                                        if (response.new == 1) {
                                            props.navigation.navigate("SocialRegisterScreen", { s_email: email, s_socialID: result.id, s_image: image, s_firstName: result.first_name ? result.first_name : '', s_lastName: result.last_name ? result.last_name : '', s_creation: 'F' });
                                        }
                                        else {
                                            setData({
                                                ...formData,
                                                type: 'error',
                                                message: response.message,
                                                loading: false
                                            });
                                            setTimeout(() => {
                                                setData({
                                                    ...formData,
                                                    message: null,
                                                    loading: false
                                                })
                                            }, 3000);
                                        }

                                    }
                                }));
                            } catch (error) {
                                logfunction("Error", error)
                                setData({
                                    ...formData,
                                    loading: false
                                });
                            }

                        }
                    }
                    // Create a graph request asking for user email and names with a callback to handle the response.
                    const infoRequest = new GraphRequest('/me', {
                        parameters: {
                            fields: {
                                string: 'email,name,first_name,last_name,picture,gender',
                            }
                        }
                    },
                        responseInfoCallback
                    );
                    // Start the graph request.
                    new GraphRequestManager().addRequest(infoRequest).start()
                }
            },
            function (error) {
                alert('Login fail with error: ' + error);
            }
        );
    }


    //google sigin
    const _googleAuth = async () => {
        try {
            const userInfo = await GoogleSignin.signIn();
            logfunction("Google response ", userInfo)

            if (userInfo.idToken != '') {

                let email = userInfo.user.email;
                let image = userInfo.user.photo ? userInfo.user.photo : '';
                let sendData = new FormData();
                sendData.append("email", email)
                sendData.append("password", userInfo.user.id)
                sendData.append("creation", 'G')
                setData({
                    ...formData,
                    loading: true
                });

                //login to our server 🧛🏻‍♀️
                try {
                    getApi.postData(
                        'user/socialLogin',
                        sendData,
                    ).then((response => {
                        logfunction("Social RESPONSE ", response)
                        if (response.status == 1) {
                            logfunction("RESPONSE ", 'Success')
                            setData({
                                ...formData,
                                email: null,
                                password: null,
                                loading: false
                            });
                            props.doLogin(response, navTo);
                        }
                        else {
                            //navigation part  😎
                            if (response.new == 1) {
                                props.navigation.navigate("SocialRegisterScreen", { s_email: email, s_socialID: userInfo.user.id, s_image: image, s_firstName: userInfo.user.name, s_lastName: '', s_creation: 'G' });
                            }
                            else {
                                setData({
                                    ...formData,
                                    type: 'error',
                                    message: response.message,
                                    loading: false
                                });
                                setTimeout(() => {
                                    setData({
                                        ...formData,
                                        message: null,
                                        loading: false
                                    })
                                }, 3000);
                            }

                        }
                    }));
                } catch (error) {
                    logfunction("Error", error)
                    setData({
                        ...formData,
                        loading: false
                    });
                }

                //  this.setState({
                // socialName: userInfo.user.name,
                // socialEmail: userInfo.user.email,
                // creation_mode: 'G',
                // social_link: userInfo.user.photo,
                //  });
                // const data = new FormData()
                // data.append("email", userInfo.user.name)
                // data.append("name", userInfo.user.email)
                // data.append("fcm_key", this.state.fcmToken)
                // this.props.socialLogin(data, this.state.returnTo, this.state.stringReturn);
            }
        } catch (error) {
            logfunction("Errors ", error)
        }
    }

    const { strings } = props;

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
                        }}>{strings.login.welcome}</Text>
                        <Text style={{
                            fontSize: wp('4%'),
                            fontFamily: Fonts.Font_Reguler,
                            color: Colors().dark_gray,
                            textAlign: 'left',
                            marginTop: hp('0.1%'),
                            lineHeight: hp('4%')
                        }}>Welcome Back to Cmc ecommerce </Text>

                    </View>
                }

                {/* Login Form Start from here */}
                <View style={styles.innerContainer}>

                    <>
                        <OtrixDivider size={'lg'} />
                        <OtrixDivider size={'lg'} />

                        <FormControl isRequired style={{ backgroundColor: Colors().white }} isInvalid={submited && 'email' in errors || 'invalidEmail' in errors}>
                            <Input variant="outline" placeholder="Email Address (email address example:email@mail.com)" style={[GlobalStyles.textInputStyle]}
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
                        <FormControl isRequired style={{ backgroundColor: Colors().white }} isInvalid={submited && 'password' in errors}>
                            <Input variant="outline" placeholder="Password (example:123456)" style={[GlobalStyles.textInputStyle]}
                                onChangeText={(value) => { setData({ ...formData, submited: false, password: value }), delete errors.password }}
                                secureTextEntry={state.secureEntry}
                                value={password}
                                InputRightElement={
                                    <TouchableOpacity onPress={() => setDatapassword({ ...state, secureEntry: !state.secureEntry })} style={[{ marginRight: wp('3%'), padding: 3 }]}>
                                        <Icon name={state.secureEntry == true ? "eye" : "eye-off"} size={18} color={Colors().secondry_text_color} />
                                    </TouchableOpacity>
                                }
                            />
                            <FormControl.ErrorMessage
                                leftIcon={<InfoOutlineIcon size="xs" />}
                            >
                                {errors.password}
                            </FormControl.ErrorMessage>
                        </FormControl>


                    </>
                    <TouchableOpacity onPress={() => props.navigation.navigate('ForgotPasswordScreen')}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <OtrixDivider size={'md'} />
                    <Button
                        size="md"
                        variant="solid"
                        isLoading={loading}
                        bg={Colors().themeColor}
                        style={[GlobalStyles.button, { marginHorizontal: wp('5%') }]}
                        onPress={() => login()}
                    >
                        <Text style={GlobalStyles.buttonText}>{"Login Now"}</Text>
                    </Button>

                    <OtrixDivider size={'md'} />

                    <View style={styles.registerView}>
                        <Text style={styles.registerTxt}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('RegisterScreen')}>
                            <Text style={styles.signupTxt}> Sign Up </Text>
                        </TouchableOpacity>
                    </View>
                    <OtrixDivider size={'md'} />

                    {/* Social Container Component */}
                    {/* <OtrixSocialContainer facebookLogin={_fbAuth} googleLogin={_googleAuth} /> */}

                    <OtrixDivider size={'md'} />
                </View>
            </OtrixContent>
            {
                message != null && <OtrixAlert type={type} message={message} />
            }


        </OtrixContainer >
    )

}

function mapStateToProps(state) {
    return {
        strings: state.mainScreenInit.strings,
    }
}

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        doLogin
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
    forgotPassword: {
        fontSize: wp('3%'),
        textAlign: 'right',
        fontFamily: Fonts.Font_Reguler,
        color: Colors().link_color,
        padding: 5
    },
    registerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputLabel: {
        fontSize: wp('4%'),
        marginBottom: hp('1%'),
        textAlign: 'left',
        fontFamily: Fonts.Font_Semibold,
        color: '#0D2A42'
    },
    signupTxt: {
        fontSize: wp('3.5%'),
        textAlign: 'right',
        fontFamily: Fonts.Font_Semibold,
        color: '#29abe2'
    },
    bgimage: {
        height: hp('100%'),
    },
    innerContainer: {
        flex: 1,
        padding: wp('5%'),
        marginTop: hp('5%'),
        backgroundColor: Colors().white,
        borderTopLeftRadius: wp('12%'),
        borderTopRightRadius: wp('12%'),
        height: hp('100%')
    },
    login: {
        fontSize: wp('6%'),
        fontFamily: Fonts.Font_Bold,
        color: Colors().text_color,
        textAlign: 'center',
        marginVertical: hp('2%'),
        textDecorationLine: 'underline',
        lineHeight: hp('5%')
    },
    otpFieldsWrapStyle: {
        marginTop: hp('2%'),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: wp('2%'),
    },
    textFieldWrapStyle: {
        height: 50.0,
        width: 50.0,
        borderRadius: 25,
        borderColor: Colors().light_white,
        borderWidth: 0.50,
        marginHorizontal: wp('1%'),
        backgroundColor: Colors().white,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2.0,
        alignSelf: 'stretch',

    },
    otpFieldsWrapStyle: {
        marginTop: hp('2%'),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: wp('2%'),
    },
    txtinput: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Semibold,
        textAlign: 'center'
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: Colors().black_text
    },
    underlineStyleHighLighted: {
        borderColor: Colors().themeColor,
    },
    otpTitle: {
        fontSize: Platform.isPad === true ? wp('3.5%') : wp('4.5%'),
        fontFamily: Fonts.Font_Semibold,
        color: Colors().black_text,
        textAlign: 'center',
    }
});