import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import { View, Text, Image } from "react-native";
import ProfileDefault from "../../assets/icons/profile/profile_default.svg";
import Crown from "../../assets/icons/leaderboard/crown.svg";

interface ProfilePicProps {
  avatarUrl: string;
  size?: number;
  crown?: boolean;
  border?: string;
}

const ProfilePic: React.FC<ProfilePicProps> = ({
  avatarUrl,
  size = 50,
  crown = false,
  border = "border-4",
}) => {
  return (
    <>
      <View
        className={`${border} rounded-full border-boxMenu bg-textInput aspect-square items-center justify-center`}
      >
        <MaskedView
          maskElement={
            <View className="size-full items-center justify-center rounded-full  aspect-square bg-green-400" />
          }
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              accessibilityLabel="Avatar"
              style={[{ height: size, width: size }]}
            />
          ) : (
            <ProfileDefault width={size} height={size} />
          )}
        </MaskedView>
      </View>
      {crown && (
        <Crown
          style={{ position: "absolute", top: -28, right: -14 }}
          width={60}
          height={60}
        />
      )}
    </>
  );
};

export default ProfilePic;
