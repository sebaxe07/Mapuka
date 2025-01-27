import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import LeaderBox from "../components/LeaderBox";

interface DetailsProps {}

const Leaderboard: React.FC<DetailsProps> = ({}) => {
  const navigation = useNavigation();

  // Initial static metadata
  type Metadata = {
    user: string;
    distance: string;
    layout: "vertical" | "horizontal";
  };

  const [achievementMetadata, setAchievementMetadata] = useState<
    Record<number, Metadata>
  >({
    1: {
      user: "Christian",
      distance: "50",
      layout: "horizontal",
    },
    2: {
      user: "Sebastian",
      distance: "30",
      layout: "vertical",
    },
    3: {
      user: "Carlos",
      distance: "25",
      layout: "vertical",
    },
    4: {
      user: "Marcela",
      distance: "15",
      layout: "vertical",
    },
    5: {
      user: "Nats",
      distance: "13",
      layout: "vertical",
    },
    6: {
      user: "Sophia",
      distance: "5",
      layout: "vertical",
    },
  });

  const debugFlexbox = false;

  return (
    <View className="bg-bgMain px-5 pb-10  h-full">
      <View className="flex w-full my-16 justify-center items-center ">
        {/* Header */}
        <Text className="text-textWhite text-4xl font-senMedium mb-1 ml-10">
          Leaderboard
        </Text>
      </View>
      <View
        className={`flex-4 h-3/4  gap-3 ${debugFlexbox ? "bg-buttonDarkRed" : ""}`}
      >
        <View
          className={`flex-col flex-[66%] h-[30%] w-full rounded-3xl justify-around gap-3 ${debugFlexbox ? "bg-buttonPurple" : ""}`}
        >
          <View className="justify-center flex-1 items-center">
            <LeaderBox
              top="1"
              user={achievementMetadata[1].user}
              distance={achievementMetadata[1].distance}
              layout={achievementMetadata[1].layout}
            />
          </View>

          <View className="flex-row flex-1 justify-center gap-3">
            <View className="justify-center items-center flex-[55%]">
              <LeaderBox
                top="2"
                user={achievementMetadata[2].user}
                distance={achievementMetadata[2].distance}
                layout={achievementMetadata[2].layout}
              />
            </View>
            <View className="justify-center items-center flex-[45%]">
              <LeaderBox
                top="3"
                user={achievementMetadata[3].user}
                distance={achievementMetadata[3].distance}
                layout={achievementMetadata[3].layout}
              />
            </View>
          </View>
        </View>

        <View
          className={`flex-row flex-[33%] rounded-3xl justify-between items-center gap-3 ${debugFlexbox ? "bg-buttonBlue" : ""}`}
        >
          <View className="justify-center flex-1 items-center">
            <LeaderBox
              top="4"
              user={achievementMetadata[4].user}
              distance={achievementMetadata[4].distance}
              layout={achievementMetadata[4].layout}
            />
          </View>
          <View className="justify-center flex-1 items-center">
            <LeaderBox
              top="5"
              user={achievementMetadata[5].user}
              distance={achievementMetadata[5].distance}
              layout={achievementMetadata[5].layout}
            />
          </View>
          <View className="justify-center flex-1 items-center">
            <LeaderBox
              top="6"
              user={achievementMetadata[6].user}
              distance={achievementMetadata[6].distance}
              layout={achievementMetadata[6].layout}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Leaderboard;
