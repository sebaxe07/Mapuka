import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Alert,
  Touchable,
  TouchableOpacity,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import { supabase } from "../utils/supabase";
import { Input } from "react-native-elements";
import { signOut, signInWithEmail, signUpUser } from "../utils/UserManagement";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { clearUserData } from "../contexts/slices/userDataSlice";
import LogoMapuka from "../../assets/images/logoMapuka.svg";
import BgDesign from "../../assets/images/loginBG.svg";
import { AnimatePresence, MotiView } from "moti";
import InputField from "../components/InputField";
import Button from "../components/Button";
import BackArrow from "../components/backArrow";
import { HeaderBackButton } from "@react-navigation/elements";
import { Easing } from "react-native-reanimated";
import { MotiPressable } from "moti/interactions";
import { colors } from "../../colors";
import AlertModal from "../components/AlertModal";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");

  const [signUp, setSignUp] = useState(false);

  const AnimateSignUp = () => {
    console.log("Animating");
    setSignUp(!signUp);
  };

  const backAction = () => {
    // Check if the user is on the login screen
    console.log("Back actionA");
    setSignUp(false);
    // If the user is on the login screen, exit the app
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);

  useEffect(() => {
    // This will force a re-render once the state changes after animation
    setError("");
    setErrorColor("text-red-500");
    setTimeout(() => {
      // Ensure any necessary state changes or layout updates
      forceUpdate(); // Custom method for triggering re-render
    }, 800); // Delay based on animation duration
  }, [signUp]);

  const forceUpdate = React.useReducer(() => ({}), {})[1];

  const HandleLogin = async () => {
    setLoading(true);
    setErrorColor("text-red-500");
    setError("");
    const result = await signInWithEmail({ email, password, dispatch });
    console.log("Result", result);
    // Check the type of error void | AuthError | PostgrestError | null | unknown
    if (result instanceof Error) {
      // Capitalize the first letter of the error message
      setError(
        result.message.charAt(0).toUpperCase() + result.message.slice(1)
      );
      console.log("Error", result);
      setLoading(false);

      return;
    }

    // If result is undefined, the user has successfully logged in and navigate to the home
    if (result === undefined) {
      // Clear event listener for back button before navigating
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    }

    setLoading(false);
  };

  const HandleSignUp = async () => {
    setLoading(true);
    setErrorColor("text-red-500");
    setError("");
    if (email.length < 1) {
      setError("Email cannot be empty");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (name.length < 1) {
      setError("Name cannot be empty");
      setLoading(false);
      return;
    }

    if (lastname.length < 1) {
      setError("Lastname cannot be empty");
      setLoading(false);
      return;
    }

    const result = await signUpUser({
      email,
      password,
      name,
      lastname,
      dispatch,
    });

    if (result instanceof Error) {
      // Capitalize the first letter of the error message
      setError(
        result.message.charAt(0).toUpperCase() + result.message.slice(1)
      );
      console.log("Error", result);
      setLoading(false);

      return;
    }

    // If result is undefined, the user has successfully logged in and navigate to the home
    if (result === undefined) {
      // Clear event listener for back button before navigating
      setError("Account created successfull, please verify your email");
      setErrorColor("text-green-500");
      setSignUp(false);

      // Clear the fields
      setPasswordConfirm("");
      setName("");
      setLastname("");
    }

    setLoading(false);
  };

  const [errorColor, setErrorColor] = useState("text-red-500");
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  return (
    <View className="flex-1 flex-col items-center justify-end bg-bgMain">
      {signUp && (
        <TouchableOpacity className="absolute top-14 left-7  z-10">
          <BackArrow size={35} onpress={AnimateSignUp} />
        </TouchableOpacity>
      )}

      <MotiView
        animate={{ scale: signUp ? 2 : 1, translateY: signUp ? 200 : 0 }}
        transition={{ type: "timing", duration: 800 } as any}
        className="absolute top-0 left-0 right-0 bottom-0  "
      >
        <BgDesign width={screenWidth} />
      </MotiView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-150}>
        <View className=" mb-24 mx-14 ">
          <MotiView
            animate={{ translateY: signUp ? 0 : 170 }}
            transition={{ type: "timing", duration: 300 } as any}
          >
            <LogoMapuka />
            <Text className="text-white text-2xl font-senMedium mt-[1.96rem]">
              {signUp ? "Sign up " : "Welcome back!"}
            </Text>
            {error && (
              <Text className={`${errorColor} text-base font-senRegular`}>
                {error}
              </Text>
            )}
            <MotiView className=" gap-[1.22rem] mb-3 mt-5">
              <InputField
                onChangeText={setEmail}
                value={email}
                leftIcon={{ type: "font-awesome", name: "envelope" }}
                placeholder="Email"
                logo={true}
                rowWidth="w-96"
              />
              <InputField
                onChangeText={setPassword}
                value={password}
                leftIcon={{ type: "font-awesome", name: "lock" }}
                placeholder="Password"
                logo={true}
                rowWidth="w-96"
              />
              <MotiView
                animate={{
                  opacity: signUp ? 1 : 0,
                  scaleY: signUp ? 1 : 0,
                }}
                transition={{
                  opacity: { type: "timing", duration: 100 },
                  scaleY: { type: "timing", duration: 300 },
                }}
                className="gap-[1.22rem] "
              >
                <InputField
                  onChangeText={setPasswordConfirm}
                  value={passwordConfirm}
                  leftIcon={{ type: "font-awesome", name: "lock" }}
                  placeholder="Confirm Password"
                  logo={true}
                  rowWidth="w-96"
                />
                <InputField
                  onChangeText={setName}
                  value={name}
                  leftIcon={{ type: "font-awesome", name: "user" }}
                  placeholder="Name"
                  logo={true}
                  rowWidth="w-96"
                />
                <InputField
                  onChangeText={setLastname}
                  value={lastname}
                  leftIcon={{ type: "font-awesome", name: "user" }}
                  placeholder="Lastname"
                  logo={true}
                  rowWidth="w-96"
                />
              </MotiView>
            </MotiView>
          </MotiView>

          <MotiView animate={{ opacity: signUp ? 0 : 1 }}>
            <TouchableOpacity
              onPress={() => {}}
              className=" self-end right-0 w-1/3 items-center justify-center flex"
            >
              <Text className="text-textInput text-sm font-senMedium text-center">
                Forgot password
              </Text>
            </TouchableOpacity>
          </MotiView>

          <MotiView className="flex flex-row items-center justify-between mt-[3rem] ">
            <MotiView
              animate={{
                opacity: signUp ? 0 : 1,
              }}
              transition={
                { type: "timing", duration: 300, easing: Easing.linear } as any
              }
              className="w-[48%]"
            >
              <Button
                label="Sign up"
                special
                onPress={() => setSignUp(true)}
                width="w-full"
                disabled={loading}
              />
            </MotiView>
            <MotiView
              animate={{
                opacity: signUp ? 0 : 1,
              }}
              transition={
                { type: "timing", duration: 300, easing: Easing.linear } as any
              }
              className="w-[48%]"
            >
              <Button
                label="Log in"
                onPress={HandleLogin}
                width="w-full"
                disabled={loading}
              />
            </MotiView>
            <MotiView
              animate={{
                opacity: signUp ? 1 : 0,
                translateY: signUp ? 0 : 100,
              }}
              transition={{
                opacity: { type: "timing", duration: 100 },
                translateY: { type: "timing", duration: 100 },
              }}
              style={{
                position: "absolute",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Button
                label="Create account"
                onPress={HandleSignUp}
                width="w-[48%]"
                disabled={loading}
              />
            </MotiView>
          </MotiView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
