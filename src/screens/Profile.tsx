import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Icons from "../../assets/icons/profile/index";
import { signOut } from "../utils/UserManagement";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { clearUserData } from "../contexts/slices/userDataSlice";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../colors";
import BackArrow from "../components/BackArrow";

const Profile: React.FC = () => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => console.log("User logged out") },
    ]);
  };

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const logOut = async () => {
    console.log("User logged out");
    signOut();
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
  }, [userData]);

  return (
    <View className="flex-1 bg-bgMain px-5 py-5 pt-10 justify-around w-full ">
      {/* Main Content */}
      <View className="flex-row h-2/5 w-full  justify-between">
        {/* User Info Card */}
        <View className="flex-[0.55] bg-boxContainer rounded-3xl p-3 mr-3   ">
          <View className="flex-1 items-center justify-center">
            <Icons.UserIcon color={colors.lightText} />
            <View className="mt-3 items-center gap-3">
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
          onPress={logOut}
        >
          <Icons.LogOut color={colors.lightText} />
          <Text className="text-textInput text-base ml-2 font-senRegular">
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
