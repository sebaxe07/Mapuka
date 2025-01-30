import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import Divider from "./utils/Divider";
import Button from "./Button";
import { colors } from "../../colors"; // Ensure colors are properly imported

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
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
    >
      <View className="h-1/5 w-full items-center justify-evenly rounded-2xl bg-boxContainer p-4">
        <Text className="my-3 font-senMedium text-xl text-textInput text-center">
          {message}
        </Text>
        <Divider />
        <View className="w-full flex-row  justify-around items-center px-4 gap-6">
          <Button
            special={true}
            label={cancelText}
            width="flex-1"
            onPress={onCancel}
          />
          {onConfirm && (
            <Button
              label={confirmText}
              width="flex-1"
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
          <ActivityIndicator
            testID="ActivityIndicator"
            size="small"
            color="bg-buttonAccentRed"
          />
        )}
      </View>
    </Modal>
  );
};

export default AlertModal;
