import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import NoteBox from "../components/NoteBox";
import SpotBox from "../components/SpotBox";

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
    },
    {
      id: 2,
      title: "Rooftop Cafe",
      date: "09-06-2023",
      address: "Skyline Boulevard, NY",
    },
    {
      id: 3,
      image: require("../../assets/images/bookmarks/spotDefault.svg"),
      title: "Crystal Lake Dock",
      date: "27-09-2024",
      address: "Lakeview Crescent, MN",
    },
    {
      id: 4,
      title: "Vintage Market Plaza",
      date: "19-03-2025",
      address: "Downtown Square, TX",
    },
    {
      id: 5,
      image: require("../../assets/images/bookmarks/spotDefault.svg"),
      title: "Secluded Waterfall",
      date: "31-08-2024",
      address: "Cascade Hills, OR",
    },
    {
      id: 6,
      title: "Urban Art Alley",
      date: "02-05-2023",
      address: "Creative District, FL",
    },
  ];

  const tabs = [
    { key: "notes", label: "Notes" },
    { key: "spots", label: "Spots" },
  ];

  return (
    <View className="flex-1 bg-bgMain px-5 py-5 pt-24">
      {/* Header */}
      <Text className="text-textWhite text-4xl font-senRegular mb-1 ml-10">
        Your
      </Text>
      <Text className="text-textWhite text-4xl font-senRegular mb-5 ml-10">
        Bookmarks
      </Text>

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
              onPress={() => console.log("Open Note")}
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
              onPress={() => console.log("View Spot")}
            />
          ))}
      </ScrollView>
    </View>
  );
};

export default BookmarksScreen;
