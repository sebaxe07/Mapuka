import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import Divider from "./utils/Divider";
import Button from "./Button";

interface CustomModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  message: string;
  onCancel: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText: string;
  loading?: boolean;
}

const AlertModal: React.FC<CustomModalProps> = ({
  isVisible,
  onBackdropPress,
  message,
  onCancel,
  onConfirm,
  confirmText = "",
  cancelText,
  loading = false,
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View className="h-1/5 w-full items-center justify-evenly rounded-2xl bg-boxContainer">
        <Text className="my-3 font-senMedium text-xl text-textInput text-center">
          {message}
        </Text>
        <Divider />
        {onConfirm ? (
          <View className="w-full flex-row items-center justify-between px-6 ">
            <Button
              special={true}
              label={cancelText}
              width={"w-80"}
              onPress={onCancel}
            />
            <Button
              label={confirmText}
              width={"w-80"}
              onPress={onConfirm}
              disabled={loading}
            />
          </View>
        ) : (
          <View className="w-full flex-row items-center justify-center px-6">
            <Button
              label={cancelText}
              width={"w-80"}
              onPress={onCancel}
              disabled={loading}
            />
          </View>
        )}
        {loading && (
          <ActivityIndicator size="small" color="bg-buttonAccentRed" />
        )}
      </View>
    </Modal>
  );
};

export default AlertModal;
