import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ContentBox from "../components/ContentBox";

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
    <View className="bg-bgMain px-5 py-2 pt-24">
      <View className="flex w-full my-16 justify-center items-center">
        {/* Header */}
        <Text className="text-textWhite text-4xl font-senRegular mb-1 ml-10">
          Leaderboard
        </Text>
      </View>
      <View
        className={`flex-4 h-full gap-6 ${debugFlexbox ? "bg-buttonDarkRed" : ""}`}
      >
        <View
          className={`flex-row h-[35%] w-full rounded-3xl justify-around gap-3 ${debugFlexbox ? "bg-buttonPurple" : ""}`}
        >
          <View
            className="flex-col justify-center "
            style={{ flex: 1, height: "100%" }}
          >
            <View className="justify-center items-center" style={{ flex: 1 }}>
              <ContentBox
                category="leaderboard"
                top="1"
                title={achievementMetadata[1].user}
                description={achievementMetadata[1].distance}
                layout={achievementMetadata[1].layout}
              />
            </View>

            <View className="flex-row justify-center gap-3" style={{ flex: 1 }}>
              <View className="justify-center items-center" style={{ flex: 1 }}>
                <ContentBox
                  category="leaderboard"
                  top="2"
                  title={achievementMetadata[2].user}
                  description={achievementMetadata[2].distance}
                  layout={achievementMetadata[2].layout}
                />
              </View>
              <View className="justify-center items-center" style={{ flex: 1 }}>
                <ContentBox
                  category="leaderboard"
                  top="3"
                  title={achievementMetadata[3].user}
                  description={achievementMetadata[3].distance}
                  layout={achievementMetadata[3].layout}
                />
              </View>
            </View>
          </View>
        </View>
        <View
          className={`flex-row flex-wrap rounded-3xl justify-between gap-3 ${debugFlexbox ? "bg-buttonBlue" : ""}`}
        >
          <View className="justify-center items-center" style={{ flex: 1 }}>
            <ContentBox
              category="leaderboard"
              top="4"
              title={achievementMetadata[4].user}
              description={achievementMetadata[4].distance}
              layout={achievementMetadata[4].layout}
            />
          </View>
          <View className="justify-center items-center" style={{ flex: 1 }}>
            <ContentBox
              category="leaderboard"
              top="5"
              title={achievementMetadata[5].user}
              description={achievementMetadata[5].distance}
              layout={achievementMetadata[5].layout}
            />
          </View>
          <View className="justify-center items-center" style={{ flex: 1 }}>
            <ContentBox
              category="leaderboard"
              top="6"
              title={achievementMetadata[6].user}
              description={achievementMetadata[6].distance}
              layout={achievementMetadata[6].layout}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Leaderboard;
