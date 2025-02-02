import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppSelector } from "../contexts/hooks";
import { supabase } from "../utils/supabase";
import Toast from "react-native-toast-message";

const ResetPassword: React.FC = () => {
  const userData = useAppSelector((state) => state.userData);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      userData?.email
    );

    setLoading(false);

    if (error) {
      console.error("Error sending reset email:", error.message);
      Toast.show({
        position: "bottom",
        visibilityTime: 3000,
        type: "error",
        text1: "Reset Failed",
        text2: "Failed to send reset link. Try again later.",
      });
      return;
    }

    Toast.show({
      position: "bottom",
      visibilityTime: 3000,
      type: "success",
      text1: "Reset Link Sent",
      text2: `Check your email (${userData?.email}) for reset instructions.`,
    });
  };

  return (
    <View className="bg-bgMain px-5 pb-10 h-full">
      <View className="flex w-full my-16 justify-center items-start">
        {/* Header */}
        <Text className="text-textWhite text-2xl font-senMedium mb-1 ml-10">
          Reset Password
        </Text>
      </View>

      <TouchableOpacity
        testID="reset-password"
        className={` rounded-xl px-6 py-3 self-center `}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text className="text-textInput font-senMedium text-xl">
          Press here to send a reset password link to your e-mail
        </Text>
        <Text className="text-textWhite font-senMedium text-xl mb-4">
          {userData?.email}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;
