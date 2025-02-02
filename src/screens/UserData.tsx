import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAppSelector, useAppDispatch } from "../contexts/hooks";
import { supabase } from "../utils/supabase";
import { setUserData } from "../contexts/slices/userDataSlice";
import Toast from "react-native-toast-message";
import Button from "../components/Button";
import AlertModal from "../components/AlertModal";

const UserData: React.FC = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userData);

  const [firstName, setFirstName] = useState(userData?.name || "");
  const [lastName, setLastName] = useState(userData?.lastname || "");
  const [newFirstName, setNewFirstName] = useState(userData?.name || "");
  const [newLastName, setNewLastName] = useState(userData?.lastname || "");

  const [loading, setLoading] = useState(false);
  const [isAlertSaveVisible, setIsAlertSaveVisible] = useState(false);
  const [isAlertCancelVisible, setIsAlerCancelVisible] = useState(false);

  const handleSave = async () => {
    if (!newFirstName.trim() || !newLastName.trim()) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "First and last name cannot be empty.",
      });
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ name: newFirstName, lastname: newLastName })
      .eq("profile_id", userData?.profile_id);

    if (error) {
      console.error("Error updating name:", error.message);
      return;
    }

    dispatch(
      setUserData({ ...userData, name: newFirstName, lastname: newLastName })
    );
    Toast.show({
      type: "success",
      text1: "Profile Updated",
      text2: "Your name has been updated successfully!",
    });
  };

  return (
    <View className="bg-bgMain px-5 pb-10 h-full">
      <Text className="text-textWhite text-3xl font-senMedium my-16 ml-10">
        Personal Information
      </Text>
      <View className="gap-3">
        {/* First Name */}
        <Text className="text-textInput font-senMedium text-xl">
          First Name
        </Text>
        <View className="flex-row w-full">
          <TextInput
            value={newFirstName}
            onChangeText={setNewFirstName}
            className="flex-1 text-boxContainer rounded-2xl bg-textInput text-2xl font-senRegular border-b border-boxContainer mb-4 px-4 py-2"
          />
        </View>

        {/* Last Name */}
        <Text className="text-textInput text-xl font-senMedium">Last Name</Text>
        <View className="flex-row w-full">
          <TextInput
            value={newLastName}
            onChangeText={setNewLastName}
            className="flex-1 text-boxContainer rounded-2xl bg-textInput text-2xl font-senRegular border-b border-boxContainer mb-4 px-4 py-2"
          />
        </View>
      </View>
      <View className="flex-row items-center justify-center gap-6 mt-4">
        <Button
          label="Discard"
          special
          onPress={() => {
            setIsAlerCancelVisible(true);
          }}
        />
        <Button label="Save" onPress={() => setIsAlertSaveVisible(true)} />
      </View>

      {/* Save Confirmation Modal */}
      <AlertModal
        isVisible={isAlertSaveVisible}
        onBackdropPress={() => setIsAlertSaveVisible(false)}
        message="Want to save the changes?"
        onCancel={() => setIsAlertSaveVisible(false)}
        onConfirm={() => {
          handleSave();
          setIsAlertSaveVisible(false);
        }}
        confirmText="Yes"
        cancelText="Cancel"
        loading={loading}
      />

      {/* Cancel Confirmation Modal */}
      <AlertModal
        isVisible={isAlertCancelVisible}
        onBackdropPress={() => setIsAlerCancelVisible(false)}
        message={`Want to discard the changes?\nAll unsaved changes will be lost.`}
        onCancel={() => setIsAlerCancelVisible(false)}
        onConfirm={() => {
          setNewFirstName(firstName);
          setNewLastName(lastName);
          setIsAlerCancelVisible(false);
        }}
        confirmText="Yes"
        cancelText="Cancel"
        loading={loading}
      />
    </View>
  );
};

export default UserData;
