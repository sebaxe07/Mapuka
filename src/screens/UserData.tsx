import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
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

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAlertSaveVisible, setIsAlertSaveVisible] = useState(false);
  const [isAlertCancelVisible, setIsAlerCancelVisible] = useState(false);

  const validateFirstName = (text: string) => {
    if (!text.trim()) {
    } else if (text.length < 2) {
      setFirstNameError("First name must be at least 2 characters.");
    } else {
      setFirstNameError(null);
    }
    setNewFirstName(text);
  };

  const validateLastName = (text: string) => {
    if (!text.trim()) {
    } else if (text.length < 2) {
      setLastNameError("Last name must be at least 2 characters.");
    } else {
      setLastNameError(null);
    }
    setNewLastName(text);
  };

  const handleSave = async () => {
    if (
      firstNameError ||
      lastNameError ||
      !newFirstName.trim() ||
      !newLastName.trim()
    ) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please fix errors before saving.",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: newFirstName.trim(), lastname: newLastName.trim() })
      .eq("profile_id", userData?.profile_id);

    setLoading(false);

    if (error) {
      console.error("Error updating name:", error.message);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "An error occurred. Please try again.",
      });
      return;
    }

    dispatch(
      setUserData({
        ...userData,
        name: newFirstName.trim(),
        lastname: newLastName.trim(),
      })
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
            onChangeText={validateFirstName}
            className="flex-1 text-boxContainer rounded-2xl bg-textInput text-2xl font-senRegular border-b border-boxContainer px-4 py-2"
          />
        </View>
        {firstNameError && (
          <Text className="text-buttonAccentRed font-senSemiBold text-sm mt-1">
            {firstNameError}
          </Text>
        )}

        {/* Last Name */}
        <Text className="text-textInput text-xl font-senMedium">Last Name</Text>
        <View className="flex-row w-full">
          <TextInput
            value={newLastName}
            onChangeText={validateLastName}
            className="flex-1 text-boxContainer rounded-2xl bg-textInput text-2xl font-senRegular border-b border-boxContainer px-4 py-2"
          />
        </View>
        {lastNameError && (
          <Text className="text-buttonAccentRed font-senSemiBold text-sm mt-1">
            {lastNameError}
          </Text>
        )}
      </View>

      <View className="flex-row items-center justify-center gap-6 mt-4">
        <Button
          label="Discard"
          special
          onPress={() => setIsAlerCancelVisible(true)}
        />
        <Button
          label="Save"
          onPress={() => setIsAlertSaveVisible(true)}
          disabled={
            !!firstNameError ||
            !!lastNameError ||
            !newFirstName.trim() ||
            !newLastName.trim()
          }
        />
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
