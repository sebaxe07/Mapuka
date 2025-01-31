import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Icons from "../../assets/icons/profile/index";
import { signOut } from "../utils/UserManagement";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { clearUserData } from "../contexts/slices/userDataSlice";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../colors";
import BackArrow from "../components/backArrow";
import MaskedView from "@react-native-masked-view/masked-view";
import Edit from "../../assets/icons/edit_icon.svg";
import ProfileDefault from "../../assets/icons/profile/profile_default.svg";
import { Photo, setPic } from "../contexts/slices/userDataSlice";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from "../utils/photoManager";
import { supabase } from "../utils/supabase";
import AlertModal from "../components/AlertModal";
import Toast from "react-native-toast-message";

const Profile: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const logOut = async () => {
    console.log("User logged out");
    signOut();
    Toast.show({
      autoHide: true,
      position: "bottom",
      visibilityTime: 2000,
      type: "info",
      text1: "Succesfully logged out",
    });
    dispatch(clearUserData());
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackArrow />,
    });
  }, [navigation]);

  const userData = useAppSelector((state) => state.userData);
  const [daysExplored, setDaysExplored] = useState<number>(0);
  const [distanceExplored, setDistanceExplored] = useState<number>(0);
  const [achievementsCount, setAchievementsCount] = useState<number>(0);

  const [image, setImage] = useState<Photo | null>(null);

  useEffect(() => {
    // limite the distance to 2 decimal places
    const clampedDistance = Math.floor(userData.discovered_area * 100) / 100;
    setDistanceExplored(clampedDistance);

    // Calculate the number of days since the account was created
    const createdDate = new Date(userData.created_at);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime());
    const daysSinceCreation = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // Check that is not nan
    if (!isNaN(daysSinceCreation)) {
      setDaysExplored(daysSinceCreation);
    } else {
      setDaysExplored(0);
    }

    // Check if the user has a picture
    if (userData.pic) {
      //console.log("User has a picture", userData.pic.pictureUrl);
      setAvatarUrl(userData.pic.pictureUrl);
    }

    // Calculate the percentage of achievements unlocked
    if (userData.achievements) {
      const unlockedAchievements = userData.achievements.filter(
        (achievement) => achievement.unlocked
      );
      const achievementsPercentage =
        (unlockedAchievements.length / userData.achievements.length) * 100;

      const clampedAchievements =
        Math.floor(achievementsPercentage * 100) / 100;
      setAchievementsCount(clampedAchievements);
    }
  }, [userData]);

  async function uploadAvatar() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      console.log("path", path);
      console.log("arraybuffer", arraybuffer);
      console.log("image.mimeType", image.mimeType);
      console.log("image.uri", image.uri);
      console.log("fileExt", fileExt);
      setAvatarUrl(image.uri);

      const tempPhoto: Photo = {
        pictureUrl: image.uri,
        arrayBuffer: arrayBufferToBase64(arraybuffer),
        path: path,
        image: image,
      };
      setImage(tempPhoto);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    }
  }

  const uploadImage = async (
    userId: string,
    picturePath: string,
    arraybuffer: ArrayBuffer | undefined,
    image: ImagePicker.ImagePickerAsset | undefined
  ) => {
    const FinalPath = `${userId}/${picturePath}`;

    // Check if there is a folder for the user and get the files in it
    const { data: listdata, error } = await supabase.storage
      .from("avatars")
      .list(userData.profile_id);

    if (error) {
      console.error("Error fetching existing images:", error);
      throw error;
    } else {
      if (listdata && listdata.length > 0) {
        console.log("Existing images:", listdata);
        // Delete all the images in the folder
        for (const file of listdata) {
          const deletePath = `${userData.profile_id}/${file.name}`;
          console.log("\x1b[31m", "Deleting existing image:", deletePath);
          const { error: deleteError } = await supabase.storage
            .from("avatars")
            .remove([deletePath]);
          if (deleteError) {
            console.error("Error deleting existing image:", deleteError);
            throw deleteError;
          }
        }
      }
    }

    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .update(FinalPath, arraybuffer || new ArrayBuffer(0), {
        contentType: image?.mimeType ?? "image/jpeg",
        upsert: true,
      });
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    console.log("Uploaded image data: ", data);

    const imageUrl = await supabase.storage
      .from("avatars")
      .getPublicUrl(FinalPath);

    if (!imageUrl) {
      console.error("Error fetching signed URL for photo:", FinalPath);
      return;
    }
    if (!imageUrl.data) {
      console.error("Error fetching signed URL for photo:", FinalPath);
      return;
    }
    // Update the user's profile pic URL in the app
    setAvatarUrl(imageUrl.data.publicUrl);
    dispatch(
      setPic({
        pictureUrl: imageUrl.data.publicUrl,
        arrayBuffer: "",
        path: FinalPath,
        image: {} as ImagePicker.ImagePickerAsset,
      })
    );

    setImage(null);

    // save the image URL to the database
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ pic_url: imageUrl.data.publicUrl })
      .eq("profile_id", userData.profile_id);

    if (dbError) {
      console.error("Error updating image URL in the database:", dbError);
      throw dbError;
    }

    console.log("Uploaded image URL: ", imageUrl);
    return;
  };

  useEffect(() => {
    console.log("userdata ", userData.pic?.pictureUrl);
  }, [userData]);

  useEffect(() => {
    console.log("Image changed", image?.path);
    if (image) {
      console.log("Uploading image");
      uploadImage(
        userData.profile_id,
        image.path,
        base64ToArrayBuffer(image.arrayBuffer),
        image.image
      );
    }
  }, [image]);

  return (
    <View className="flex-1 bg-bgMain px-5 py-5 pt-10 justify-around w-full ">
      {/* Main Content */}
      <View className="flex-row h-2/5 w-full  justify-between">
        {/* User Info Card */}
        <View className="flex-[0.55] bg-boxContainer rounded-3xl p-3 mr-3   ">
          <View className="flex-1 items-center justify-center">
            <View className="flex-[0.60]  size-full items-center justify-center">
              <TouchableOpacity
                onPress={uploadAvatar}
                style={{
                  aspectRatio: 1,
                }}
              >
                <View className=" rounded-full border-4 border-textInput bg-textInput aspect-square items-center justify-center">
                  <MaskedView
                    maskElement={
                      <View className="size-full items-center justify-center rounded-full  aspect-square bg-green-400" />
                    }
                  >
                    {avatarUrl ? (
                      <Image
                        source={{ uri: avatarUrl }}
                        accessibilityLabel="Avatar"
                        style={[{ height: 120, width: 120 }]}
                      />
                    ) : (
                      <ProfileDefault width={120} height={120} />
                    )}
                  </MaskedView>
                </View>
                <Edit
                  style={{ position: "absolute", top: 0, right: 0 }}
                  width={40}
                  height={40}
                />
              </TouchableOpacity>
            </View>
            <View className=" flex-[0.40] mt-3 items-center gap-3">
              <Text className="text-boxMenu text-3xl font-senSemiBold flex-wrap">
                Hello, {userData.name}!
              </Text>
              <Text className="text-textInput text-sm font-senRegular">
                {userData.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="flex-[0.5] flex-col  justify-between shrink-1 ">
          {/* Calendar Section */}
          <View className="bg-boxContainer flex-[0.3] flex-row items-center justify-center rounded-3xl px-3 py-2 shadow-md ">
            <View className="justify-center">
              <Icons.Calendar color="var(--color-button-aqua)" width={40} />
            </View>
            <View className="flex-col items-start content-center justify-center ml-2 w-24">
              <Text className="text-buttonAqua text-lg  font-senSemiBold">
                {daysExplored} days
              </Text>
              <Text className="text-textBody text-sm font-senRegular">
                Of Exploring
              </Text>
            </View>
          </View>

          {/* Track Section */}
          <View className="bg-boxContainer flex-[0.3] flex-row items-center justify-center rounded-3xl px-3 py-2 shadow-md mt-0.5 ">
            <View className="justify-center">
              <Icons.Track color="var(--color-button-blue)" width={40} />
            </View>
            <View className="flex-col items-start content-center justify-center ml-2  w-24">
              <Text className="text-buttonBlue text-lg  font-senSemiBold">
                {distanceExplored} km
              </Text>
              <Text className="text-textBody text-sm font-senRegular">
                Explored
              </Text>
            </View>
          </View>

          {/* Achievements Section */}
          <View className="bg-boxContainer flex-[0.3] flex-row items-center justify-center rounded-3xl px-3 py-2 shadow-md mt-0.5 ">
            <View className="justify-center">
              <Icons.Achivements
                color="var(--color-button-purple)"
                width={40}
              />
            </View>
            <View className="flex-col items-start content-center justify-center ml-2  w-24">
              <Text className="text-buttonPurple text-lg  font-senSemiBold">
                {achievementsCount}%
              </Text>
              <Text className="text-textBody text-sm font-senRegular">
                Achievements
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Options Section */}
      <View className="space-y-4 mb-10 ">
        <TouchableOpacity className="flex-row items-center py-3 border-b border-textBody">
          <Icons.User color={colors.lightText} />
          <Text className="text-textInput text-base ml-4 font-senRegular">
            Your info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-3 border-b border-textBody">
          <Icons.Lock color={colors.lightText} />
          <Text className="text-textInput text-base ml-4 font-senRegular">
            Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-3 border-b border-textBody">
          <Icons.Settings color={colors.lightText} />
          <Text className="text-textInput text-base ml-4 font-senRegular">
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View className="flex-row items-start py-3 rounded-lg justify-start ">
        <TouchableOpacity
          className="flex-row items-center py-3 rounded-lg justify-center "
          onPress={() => setIsModalVisible(true)}
        >
          <Icons.LogOut color={colors.lightText} />
          <Text className="text-textInput text-base ml-2 font-senRegular">
            Log out
          </Text>
        </TouchableOpacity>
      </View>
      {/* Logout Confirmation Modal */}
      <AlertModal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        message="Are you sure you want to log out?"
        onCancel={() => setIsModalVisible(false)}
        onConfirm={logOut}
        confirmText="Yes, Log out"
        cancelText="Cancel"
        loading={loading}
      />
    </View>
  );
};

export default Profile;
