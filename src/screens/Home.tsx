import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import * as Icons from "../../assets/icons/home";
import FloatingNavbar from "../components/FloatingNavbar";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import SearchBar from "../components/SearchBar";
import Map from "./MapFog";
import { MotiView, MotiTransitionProp } from "moti";
import Compass from "../components/Compass";
import MaskedView from "@react-native-masked-view/masked-view";
import NavbarBase from "../../assets/images/navbarbase.svg";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Home: React.FC = () => {
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [triggerAction, setTriggerAction] = useState("");
  const [bearing, setBearing] = useState(0);

  const handleSearch = () => {
    setSearchText(text);
  };

  return (
    <View className="flex-1">
      {/* Full-screen Map */}
      <Map
        searchText={searchText}
        triggerAction={triggerAction}
        setTriggerAction={setTriggerAction}
        onBearingChange={setBearing}
      />

      {/* Search Bar */}
      <View className="absolute inset-0 justify-center items-center   w-full">
        <View className=" w-full h-full px-6  py-16 flex-1 justify-between ">
          {/* TopSection */}
          <View className=" gap-6 ">
            <SearchBar
              value={text}
              onChangeText={(value) => setText(value)}
              placeholder="Search for a location"
              onPress={handleSearch}
            />

            {/* Top Right Buttons */}
            <View className="items-end">
              <TouchableOpacity className="bg-buttonPurple  rounded-full items-center justify-center size-14">
                <Icons.Layers color="var(--color-text-white)" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Section */}
          <View className=" gap-10 ">
            {/* Bottom Right Buttons */}

            <View className=" gap-4 items-end">
              <TouchableOpacity
                className="bg-buttonAqua  rounded-full items-center justify-center size-14"
                onPress={() => setTriggerAction("gps")}
              >
                <Icons.Focus color="white" />
              </TouchableOpacity>

              <Compass
                bearing={bearing}
                onPress={() => setTriggerAction("north")}
              />
            </View>

            {/* Bottom Floating Menu */}
            <FloatingNavbar />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
