import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import SettingsIco from "../../assets/icons/bookmarks/settings.svg";
import Place from "../../assets/icons/bookmarks/place.svg";
import Edit from "../../assets/icons/profile/edit_clean.svg";
import Trash from "../../assets/icons/bookmarks/trash.svg";
import { colors } from "../../colors";
import { useNavigation } from "@react-navigation/native";
import { Note, setNotes } from "../contexts/slices/userDataSlice";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { supabase } from "../utils/supabase";
import * as NoteBg from "../../assets/images/bookmarks/index";
import AlertModal from "../components/AlertModal";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import Toast from "react-native-toast-message";

const Settings: React.FC = ({ route }: any) => {
  const debugFlexbox = false;

  return (
    <View className="bg-bgMain px-5  pb-10 h-full">
      <View className="flex w-full my-16 justify-center items-start">
        {/* Header */}
        <Text className="text-textWhite text-2xl font-senMedium mb-1 ml-10">
          Settings
        </Text>
      </View>
      <View
        className={`flex-4 h-3/4 gap-3 ${debugFlexbox ? "bg-buttonDarkRed" : ""}`}
      ></View>
    </View>
  );
};

export default Settings;
