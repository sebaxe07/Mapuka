import React, { useState } from "react";
import { View, Text } from "react-native";
import { useAppSelector, useAppDispatch } from "../contexts/hooks";
import { supabase } from "../utils/supabase";
import Toast from "react-native-toast-message";
import Button from "../components/Button";
import { setUserData } from "../contexts/slices/userDataSlice";

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userData);
  const [loading, setLoading] = useState(false);

  const handleResetMap = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ discovered_area: null }) // Reset the discovered area
      .eq("profile_id", userData?.profile_id);

    setLoading(false);

    if (error) {
      console.error("Error resetting map:", error.message);
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: "Could not reset map area. Try again later.",
      });
      return;
    }

    dispatch(setUserData({ ...userData, discovered_area: 0 }));

    Toast.show({
      type: "success",
      text1: "Map Reset",
      text2: "The discovered area has been reset successfully.",
    });
  };

  return (
    <View className="bg-bgMain px-5 pb-10 h-full">
      <View className="flex w-full my-16 justify-center items-start">
        {/* Header */}
        <Text className="text-textWhite text-2xl font-senMedium mb-1 ml-10">
          Settings
        </Text>
      </View>
      <View className="h-3/4 gap-6 px-6">
        <Text className="text-textInput font-senMedium text-xl">
          Reset the discovered area of the Map
        </Text>
        <Button
          testID="reset-map"
          label={loading ? "Resetting..." : "Reset"}
          onPress={handleResetMap}
          disabled={loading}
        />
      </View>
    </View>
  );
};

export default Settings;
