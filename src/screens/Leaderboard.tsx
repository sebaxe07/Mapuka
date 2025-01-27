import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import LeaderBox from "../components/LeaderBox";
import { supabase } from "../utils/supabase";

interface DetailsProps {}

const Leaderboard: React.FC<DetailsProps> = ({}) => {
  const navigation = useNavigation();

  // Initial static metadata
  type Metadata = {
    top: number;
    user: string;
    distance: string;
    image: string;
    layout: "vertical" | "horizontal";
  };

  const [leaderboard, setLeaderboard] = useState<Metadata[]>([]);

  useEffect(() => {
    // Fetch leaderboard data
    RequestLeaderboard();
  }, []);

  const RequestLeaderboard = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("profile_id, name, discovered_area")
      .order("discovered_area", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching data:", error.message);
      return error;
    }

    // for each profile, fetch the image from the storage
    const DataWImage = await Promise.all(
      data.map(async (profile, index) => {
        const { data, error } = await supabase.storage
          .from("avatars")
          .list(profile.profile_id);

        if (error) {
          console.error("Error fetching image:", error.message);
          return {
            top: index + 1,
            user: profile.name,
            distance: (
              Math.floor(profile.discovered_area * 100) / 100
            ).toString(),
            layout: (index === 0 ? "horizontal" : "vertical") as
              | "horizontal"
              | "vertical",
            image: "",
          };
        }

        if (data.length === 0) {
          console.log("No image found for:", profile.name);
          return {
            top: index + 1,
            user: profile.name,
            distance: (
              Math.floor(profile.discovered_area * 100) / 100
            ).toString(),
            layout: (index === 0 ? "horizontal" : "vertical") as
              | "horizontal"
              | "vertical",
            image: "",
          };
        }

        const { data: publicUrl } = await supabase.storage
          .from("avatars")
          .getPublicUrl(`${profile.profile_id}/${data[0].name}`);

        return {
          top: index + 1,
          user: profile.name,
          distance: (
            Math.floor(profile.discovered_area * 100) / 100
          ).toString(),
          layout: (index === 0 ? "horizontal" : "vertical") as
            | "horizontal"
            | "vertical",
          image: publicUrl.publicUrl,
        };
      })
    );

    setLeaderboard(DataWImage);
  };

  useEffect(() => {
    if (leaderboard.length > 0) {
      setLoading(false);
    }
  }, [leaderboard]);

  const debugFlexbox = false;

  const [loading, setLoading] = useState(true);

  return (
    <View className="bg-bgMain px-5 pb-10  h-full">
      <View className="flex w-full my-16 justify-center items-center ">
        {/* Header */}
        <Text className="text-textWhite text-4xl font-senMedium mb-1 ml-10">
          Leaderboard
        </Text>
      </View>
      {!loading && (
        <View
          className={`flex-4 h-3/4  gap-3 ${debugFlexbox ? "bg-buttonDarkRed" : ""}`}
        >
          <View
            className={`flex-col flex-[66%] h-[30%] w-full rounded-3xl justify-around gap-3 ${debugFlexbox ? "bg-buttonPurple" : ""}`}
          >
            {leaderboard[0] && (
              <View className="justify-center flex-1 items-center">
                <LeaderBox
                  top={leaderboard[0].top.toString()}
                  user={leaderboard[0].user}
                  distance={leaderboard[0].distance}
                  layout={leaderboard[0].layout}
                  image={leaderboard[0].image}
                />
              </View>
            )}

            <View className="flex-row flex-1 justify-center gap-3">
              {leaderboard[1] && (
                <View className="justify-center items-center flex-[55%]">
                  <LeaderBox
                    top={leaderboard[1].top.toString()}
                    user={leaderboard[1].user}
                    distance={leaderboard[1].distance}
                    layout={leaderboard[1].layout}
                    image={leaderboard[1].image}
                  />
                </View>
              )}
              {leaderboard[2] && (
                <View className="justify-center items-center flex-[45%]">
                  <LeaderBox
                    top={leaderboard[2].top.toString()}
                    user={leaderboard[2].user}
                    distance={leaderboard[2].distance}
                    layout={leaderboard[2].layout}
                    image={leaderboard[2].image}
                  />
                </View>
              )}
            </View>
          </View>

          <View
            className={`flex-row flex-[33%] rounded-3xl justify-between items-center gap-3 ${debugFlexbox ? "bg-buttonBlue" : ""}`}
          >
            {leaderboard[3] && (
              <View className="justify-center flex-1 items-center">
                <LeaderBox
                  top={leaderboard[3].top.toString()}
                  user={leaderboard[3].user}
                  distance={leaderboard[3].distance}
                  layout={leaderboard[3].layout}
                  image={leaderboard[3].image}
                />
              </View>
            )}
            {leaderboard[4] && (
              <View className="justify-center flex-1 items-center">
                <LeaderBox
                  top={leaderboard[4].top.toString()}
                  user={leaderboard[4].user}
                  distance={leaderboard[4].distance}
                  layout={leaderboard[4].layout}
                  image={leaderboard[4].image}
                />
              </View>
            )}
            {leaderboard[5] && (
              <View className="justify-center flex-1 items-center">
                <LeaderBox
                  top={leaderboard[5].top.toString()}
                  user={leaderboard[5].user}
                  distance={leaderboard[5].distance}
                  layout={leaderboard[5].layout}
                  image={leaderboard[5].image}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default Leaderboard;
