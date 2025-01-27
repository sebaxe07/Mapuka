import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import NoteBox from "../components/NoteBox";
import SpotBox from "../components/SpotBox";
import { useNavigation } from "@react-navigation/native";

const BookmarksScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("notes");
  const notesData = [
    {
      id: 1,
      title: "Mystical Riverbend Spot",
      date: "12-01-2025",
      address: "Greenway Trail, 15",
      styleVariant: 5,
    },
    {
      id: 2,
      title: "Quiet Nook in the Library",
      date: "05-11-2024",
      address: "Maplewood Street, 34",
      styleVariant: 4,
    },
    {
      id: 3,
      title: "Hidden Garden Oasis",
      date: "23-08-2023",
      address: "Hilltop Avenue, 102",
      styleVariant: 3,
    },
    {
      id: 4,
      title: "Sunny Meadow Viewpoint",
      date: "17-02-2025",
      address: "Orchard Lane, 56",
      styleVariant: 2,
    },
    {
      id: 5,
      title: "Old Stone Bridge Path",
      date: "10-07-2023",
      address: "Riverside Road, 18",
      styleVariant: 0,
    },
    {
      id: 6,
      title: "Enchanted Woods Retreat",
      date: "30-03-2024",
      address: "Willow Lane, 75",
      styleVariant: 1,
    },
    {
      id: 7,
      title: "Cozy Bench Under the Stars",
      date: "21-10-2024",
      address: "Lakeview Drive, 89",
      styleVariant: 2,
    },
    {
      id: 8,
      title: "Serene Forest Clearing",
      date: "06-12-2023",
      address: "Evergreen Boulevard, 12",
      styleVariant: 3,
    },
  ];
  const spotsData = [
    {
      id: 1,
      image: require("../../assets/images/bookmarks/spotDefault.svg"),
      title: "Golden Gate Park",
      date: "14-04-2024",
      address: "San Francisco, CA",
      coordinates: { latitude: 37.7694, longitude: -122.4862 }, // Golden Gate Park
    },
    {
      id: 2,
      title: "Rooftop Cafe",
      date: "09-06-2023",
      address: "Skyline Boulevard, NY",
      coordinates: { latitude: 40.7306, longitude: -73.9352 }, // Placeholder for Skyline Boulevard, NY
    },
    {
      id: 3,
      image: require("../../assets/images/bookmarks/spotDefault.svg"),
      title: "Crystal Lake Dock",
      date: "27-09-2024",
      address: "Lakeview Crescent, MN",
      coordinates: { latitude: 46.7296, longitude: -94.6859 }, // Placeholder for Minnesota
    },
    {
      id: 4,
      title: "Vintage Market Plaza",
      date: "19-03-2025",
      address: "Downtown Square, TX",
      coordinates: { latitude: 29.7604, longitude: -95.3698 }, // Houston, TX (as an example for Downtown Square)
    },
    {
      id: 5,
      image: require("../../assets/images/bookmarks/spotDefault.svg"),
      title: "Secluded Waterfall",
      date: "31-08-2024",
      address: "Cascade Hills, OR",
      coordinates: { latitude: 44.0582, longitude: -121.3153 }, // Placeholder for Cascade Hills, OR
    },
    {
      id: 6,
      title: "Urban Art Alley",
      date: "02-05-2023",
      address: "Creative District, FL",
      coordinates: { latitude: 25.7617, longitude: -80.1918 }, // Miami, FL (as an example for Creative District)
    },
  ];

  const navigation = useNavigation();

  const tabs = [
    { key: "notes", label: "Notes" },
    { key: "spots", label: "Spots" },
  ];

  const goToDetails = (type: "note" | "spot", itemId: number) => {
    if (type === "note") {
      navigation.navigate("NoteDetails", { itemId });
    } else {
      // Replace `notesData` with `spotsData` when accessing spots
      const spot = spotsData.find((spot) => spot.id === itemId);

      if (!spot) {
        console.error("Spot not found with id:", itemId);
        return;
      }

      const { coordinates } = spot;

      if (!coordinates) {
        console.error("Coordinates not available for spot:", itemId);
        return;
      }

      try {
        navigation.navigate("Home", {
          externalCoordinates: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        });
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  return (
    <View className="flex-1 bg-bgMain h-full px-5 pb-10 ">
      {/* Header */}
      <View className="flex w-full my-14 justify-center items-start">
        <Text className="text-textWhite text-4xl font-senMedium mb-1 ml-10">
          Your
        </Text>
        <Text className="text-textWhite text-4xl font-senMedium mb-5 ml-10">
          Bookmarks
        </Text>
      </View>
      <View className={`flex-1 h-3/4 gap-3 `}>
        {/* Tabs */}
        <View className="flex-row mb-5 space-x-2">
          <TouchableOpacity
            className={`flex-1 items-center py-3 rounded-full ${activeTab === "notes" ? "bg-buttonOrange" : "bg-boxContainer"}`}
            onPress={() => setActiveTab("notes")}
          >
            <Text className="text-white font-senBold">Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center py-3 rounded-full ${activeTab === "spots" ? "bg-buttonOrange" : "bg-boxContainer"}`}
            onPress={() => setActiveTab("spots")}
          >
            <Text className="text-white font-senBold">Spots</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === "notes" &&
            notesData.map((note) => (
              <NoteBox
                key={note.id}
                title={note.title}
                date={note.date}
                address={note.address}
                styleVariant={note.styleVariant}
                onPress={() => goToDetails("note", note.id)}
              />
            ))}
          {activeTab === "spots" &&
            spotsData.map((spot) => (
              <SpotBox
                key={spot.id}
                image={spot.image}
                title={spot.title}
                date={spot.date}
                address={spot.address}
                onPress={() => goToDetails("spot", spot.id)}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default BookmarksScreen;
