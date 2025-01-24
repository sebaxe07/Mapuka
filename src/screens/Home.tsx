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
      <SearchBar
        value={text}
        onChangeText={(value) => setText(value)}
        placeholder="Search for a location"
        onPress={handleSearch}
      />

      {/* Top Right Buttons */}
      <View className="absolute top-32 right-5 space-y-3">
        <TouchableOpacity className="bg-buttonPurple p-3 rounded-full items-center justify-center">
          <Icons.Layers color="var(--color-text-white)" />
        </TouchableOpacity>
      </View>

      {/* Bottom Floating Menu */}
      <FloatingNavbar />

      {/* Bottom Right Buttons */}

      <View className="absolute bottom-32 right-5 space-y-10">
        <TouchableOpacity
          className="bg-[#5FB5C9] p-3 rounded-full items-center justify-center"
          onPress={() => setTriggerAction("gps")}
        >
          <Icons.Focus color="white" />
        </TouchableOpacity>

        <Compass bearing={bearing} onPress={() => setTriggerAction("north")} />
        {/*      <TouchableOpacity
          className="bg-[#668DEF] p-3 rounded-full items-center justify-center"
          onPress={() => setTriggerAction("north")}
        >
          <Icons.Compass color="white" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Home;
