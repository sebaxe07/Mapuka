import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AchivementBox from "../components/AchivementBox";
import { Achievement } from "../contexts/slices/userDataSlice";
import { useAppSelector } from "../contexts/hooks";
import { supabase } from "../utils/supabase";

const Achievements: React.FC = () => {
  // Initial static metadata
  type Metadata = {
    title: string;
    description: string;
    layout: "vertical" | "horizontal";
    unlocked: boolean;
  };

  const [achievementMetadata, setAchievementMetadata] = useState<
    Record<number, Metadata>
  >({
    1: {
      title: "Welcome Aboard",
      description: "Log into your account for the first time.",
      layout: "horizontal",
      unlocked: false,
    },
    2: {
      title: "First Steps",
      description: "Enter your first new zone.",
      layout: "vertical",
      unlocked: false,
    },
    3: {
      title: "Sticky Notes",
      description: "Add 5 notes to different locations.",
      layout: "vertical",
      unlocked: false,
    },
    4: {
      title: "Memo Keeper",
      description: "Edit any note after saving it.",
      layout: "vertical",
      unlocked: false,
    },
    5: {
      title: "Explorer's Habit",
      description: "Visit at least one zone per day for 3 consecutive days.",
      layout: "vertical",
      unlocked: false,
    },
    6: {
      title: "Night Owl",
      description: "Open the app for the first time after 10:00 PM.",
      layout: "vertical",
      unlocked: false,
    },
    7: {
      title: "Early Bird",
      description: "Open the app for the first time before 8:00 AM.",
      layout: "horizontal",
      unlocked: false,
    },
    8: {
      title: "Note Taker",
      description: "Create your first personal note on the map.",
      layout: "vertical",
      unlocked: false,
    },
    9: {
      title: "Returning Adventurer",
      description: "Open the app 7 days in a row.",
      layout: "vertical",
      unlocked: false,
    },
  });

  const userData = useAppSelector((state) => state.userData);

  // Simulated achievement data fetched from the database
  const [achievementData, setAchievementData] = useState<Achievement[]>(
    userData.achievements
  );

  useEffect(() => {
    // Check if there are new achievements to update
    RequestAchievement();
  }, []);

  const RequestAchievement = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("achievements")
      .eq("profile_id", userData.profile_id);

    if (error) {
      console.error("Error fetching achievements:", error.message);
      return;
    }

    // Update the achievement data
    const parsedAchievements = JSON.parse(data[0].achievements);
    setAchievementData(parsedAchievements);
  };

  useEffect(() => {
    const updatedMetadata = { ...achievementMetadata };

    achievementData.forEach((achievement) => {
      if (updatedMetadata[achievement.id]) {
        updatedMetadata[achievement.id].unlocked = achievement.unlocked;
      }
    });

    setAchievementMetadata(updatedMetadata);
  }, [achievementData]);

  return (
    <View className="bg-bgMain px-5  pb-10 h-full">
      <View className="flex w-full my-16 justify-center items-center">
        {/* Header */}
        <Text className="text-textWhite text-4xl font-senMedium mb-1 ml-10">
          Achievements
        </Text>
      </View>
      <View className={`flex-4 h-3/4 gap-3 `}>
        <View className="flex-1 gap-3">
          {/* 1st Row */}
          <View
            className={`flex-row flex-1 rounded-3xl gap-3 justify-between `}
          >
            <View className="justify-center items-center flex-[60%]">
              <AchivementBox
                title={achievementMetadata[1].title}
                description={achievementMetadata[1].description}
                unlocked={achievementMetadata[1].unlocked}
                layout={achievementMetadata[1].layout}
              />
            </View>
            <View className="justify-center items-center flex-[40%]">
              <AchivementBox
                title={achievementMetadata[2].title}
                description={achievementMetadata[2].description}
                unlocked={achievementMetadata[2].unlocked}
                layout={achievementMetadata[2].layout}
              />
            </View>
          </View>

          {/* 2nd Row */}
          <View
            className={`flex-row flex-1 rounded-3xl justify-between gap-3 `}
          >
            <View className="justify-center items-center" style={{ flex: 1 }}>
              <AchivementBox
                title={achievementMetadata[3].title}
                description={achievementMetadata[3].description}
                unlocked={achievementMetadata[3].unlocked}
                layout={achievementMetadata[3].layout}
              />
            </View>
            <View className="justify-center items-center" style={{ flex: 1 }}>
              <AchivementBox
                title={achievementMetadata[4].title}
                description={achievementMetadata[4].description}
                unlocked={achievementMetadata[4].unlocked}
                layout={achievementMetadata[4].layout}
              />
            </View>
            <View className="justify-center items-center" style={{ flex: 1 }}>
              <AchivementBox
                title={achievementMetadata[5].title}
                description={achievementMetadata[5].description}
                unlocked={achievementMetadata[5].unlocked}
                layout={achievementMetadata[5].layout}
              />
            </View>
          </View>
        </View>
        {/* 3rd Row */}
        <View
          className={`flex-row flex-1 h-[35%] w-full rounded-3xl justify-around gap-3 `}
        >
          {/* Left Column */}
          <View
            className="justify-center items-center"
            style={{ flex: 0.5, height: "100%" }}
          >
            <AchivementBox
              title={achievementMetadata[6].title}
              description={achievementMetadata[6].description}
              unlocked={achievementMetadata[6].unlocked}
              layout={achievementMetadata[6].layout}
            />
          </View>

          {/* Right Column */}
          <View
            className="flex-col justify-center gap-3"
            style={{ flex: 1, height: "100%" }}
          >
            <View className="justify-center items-center" style={{ flex: 1 }}>
              <AchivementBox
                title={achievementMetadata[7].title}
                description={achievementMetadata[7].description}
                unlocked={achievementMetadata[7].unlocked}
                layout={achievementMetadata[7].layout}
              />
            </View>

            <View className="flex-row justify-center gap-3" style={{ flex: 1 }}>
              <View className="justify-center items-center" style={{ flex: 1 }}>
                <AchivementBox
                  title={achievementMetadata[8].title}
                  description={achievementMetadata[8].description}
                  unlocked={achievementMetadata[8].unlocked}
                  layout={achievementMetadata[8].layout}
                />
              </View>
              <View className="justify-center items-center" style={{ flex: 1 }}>
                <AchivementBox
                  title={achievementMetadata[9].title}
                  description={achievementMetadata[9].description}
                  unlocked={achievementMetadata[9].unlocked}
                  layout={achievementMetadata[9].layout}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Achievements;
