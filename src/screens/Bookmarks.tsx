import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  PanResponder,
} from "react-native";
import NoteBox from "../components/NoteBox";
import SpotBox from "../components/SpotBox";
import BackArrow from "../components/BackArrow";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";
import { colors } from "../../colors";
import { Note, Spot } from "../contexts/slices/userDataSlice";

const BookmarksScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("notes");

  const notesData: Note[] = [
    {
      note_id: "1",
      created_at: "14-04-2024",
      coordinates: [37.7749, -122.4194],
      address: "San Francisco, CA",
      title: "Golden Gate Park",
      content: "A beautiful park in the heart of San Francisco",
      image: 1,
    },
    {
      note_id: "2",
      created_at: "09-06-2023",
      coordinates: [40.7831, -73.9712],
      address: "Skyline Boulevard, NY",
      title: "Rooftop Cafe",
      content: "A nice place to have a coffee",
      image: 2,
    },
    {
      note_id: "3",
      created_at: "27-09-2024",
      coordinates: [46.7296, -94.6859],
      address: "Lakeview Crescent, MN",
      title: "Crystal Lake Dock",
      content: "A dock with a beautiful view",
      image: 3,
    },
    {
      note_id: "4",
      created_at: "19-03-2025",
      coordinates: [30.2672, -97.7431],
      address: "Downtown Square, TX",
      title: "Vintage Market Plaza",
      content: "A plaza with a lot of vintage stuff",
      image: 4,
    },
    {
      note_id: "5",
      created_at: "31-08-2024",
      coordinates: [44.0521, -121.3153],
      address: "Cascade Hills, OR",
      title: "Secluded Waterfall",
      content: "A hidden waterfall in the hills",
      image: 5,
    },
    {
      note_id: "6",
      created_at: "02-05-2023",
      coordinates: [25.7617, -80.1918],
      address: "Creative District, FL",
      title: "Urban Art Alley",
      content: "A street full of urban art",
      image: 0,
    },
  ];
  const spotsData: Spot[] = [
    {
      spot_id: "1",
      created_at: "14-04-2024",
      coordinates: [37.7749, -122.4194],
      address: "San Francisco, CA",
      title: "Golden Gate Park",
    },
    {
      spot_id: "2",
      created_at: "09-06-2023",
      coordinates: [40.7831, -73.9712],
      address: "Skyline Boulevard, NY",
      title: "Rooftop Cafe",
    },
    {
      spot_id: "3",
      created_at: "27-09-2024",
      coordinates: [46.7296, -94.6859],
      address: "Lakeview Crescent, MN",
      title: "Crystal Lake Dock",
    },
    {
      spot_id: "4",
      created_at: "19-03-2025",
      coordinates: [30.2672, -97.7431],
      address: "Downtown Square, TX",
      title: "Vintage Market Plaza",
    },
    {
      spot_id: "5",
      created_at: "31-08-2024",
      coordinates: [44.0521, -121.3153],
      address: "Cascade Hills, OR",
      title: "Secluded Waterfall",
    },
    {
      spot_id: "6",
      created_at: "02-05-2023",
      coordinates: [25.7617, -80.1918],
      address: "Creative District, FL",
      title: "Urban Art Alley",
    },
  ];

  const tabs = [
    { key: "notes", label: "Notes" },
    { key: "spots", label: "Spots" },
  ];

  const [activeWidth, setActiveWidth] = useState(0);
  const [inactiveWidth, setInactiveWidth] = useState(0);
  const [tabsWidth, setTabsWidth] = useState(0);

  useEffect(() => {
    setActiveWidth(tabsWidth * 0.6 - 5);
    setInactiveWidth(tabsWidth * 0.4 - 5);
  }, [tabsWidth]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          // Swiped right
          setActiveTab("notes");
        } else if (gestureState.dx < 0) {
          // Swiped left
          setActiveTab("spots");
        }
      },
    })
  ).current;
  return (
    <View className="flex-1 bg-bgMain px-5 py-5 pt-20">
      {/* Header */}
      <Text className="text-textWhite text-4xl font-senMedium mb-1 ml-10">
        Your
      </Text>
      <Text className="text-textWhite text-4xl font-senMedium mb-5 ml-10">
        Bookmarks
      </Text>

      {/* Tabs */}
      <View
        className="flex-row justify-between  mb-5   "
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setTabsWidth(width);
        }}
      >
        <MotiPressable
          onPress={() => setActiveTab("notes")}
          animate={useMemo(
            () =>
              ({ hovered, pressed }) => {
                "worklet";

                return {
                  opacity: hovered || pressed ? 0.5 : 1,
                  width: activeTab === "notes" ? activeWidth : inactiveWidth,
                  backgroundColor:
                    activeTab === "notes" ? colors.accentRed : colors.box,
                };
              },
            [activeTab, activeWidth, inactiveWidth]
          )}
          transition={{ type: "timing", duration: 500 } as any}
          style={{
            height: 50,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            className={`${activeTab === "notes" ? "text-boxMenu" : "text-textBody"}  font-senBold`}
          >
            Notes
          </Text>
        </MotiPressable>
        <MotiPressable
          onPress={() => setActiveTab("spots")}
          animate={useMemo(
            () =>
              ({ hovered, pressed }) => {
                "worklet";

                return {
                  opacity: hovered || pressed ? 0.5 : 1,
                  width: activeTab === "spots" ? activeWidth : inactiveWidth,
                  backgroundColor:
                    activeTab === "spots" ? colors.orange : colors.box,
                };
              },
            [activeTab, activeWidth, inactiveWidth]
          )}
          transition={{ type: "timing", duration: 500 } as any}
          style={{
            height: 50,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            className={`${activeTab === "spots" ? "text-boxMenu" : "text-textBody"}  font-senBold`}
          >
            Spots
          </Text>
        </MotiPressable>
      </View>

      <View className="flex-1 h-1/2">
        <MotiView
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            //zIndex: activeTab === "notes" ? 1 : 0,
          }}
          animate={{
            opacity: activeTab === "notes" ? 1 : 1,
            translateX:
              activeTab === "notes" ? 0 : -Dimensions.get("window").width,
          }}
          transition={{ type: "timing", duration: 500 } as any}
        >
          <FlatList
            data={notesData}
            keyExtractor={(item) => item.note_id}
            renderItem={({ item }) => (
              <NoteBox
                title={item.title}
                date={item.created_at}
                address={item.address}
                styleVariant={item.image}
                onPress={() => console.log("Open Note")}
              />
            )}
          />
        </MotiView>

        <MotiView
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            //zIndex: activeTab === "spots" ? 1 : 0,
          }}
          animate={{
            opacity: activeTab === "spots" ? 1 : 1,
            translateX:
              activeTab === "spots" ? 0 : Dimensions.get("window").width,
          }}
          transition={{ type: "timing", duration: 500 } as any}
        >
          <FlatList
            data={spotsData}
            keyExtractor={(item) => item.spot_id}
            renderItem={({ item }) => (
              <SpotBox
                image={require("../../assets/images/bookmarks/spotDefault.svg")}
                title={item.title}
                date={item.created_at}
                address={item.address}
                onPress={() => console.log("View Spot")}
              />
            )}
          />
        </MotiView>
      </View>

      {/* Content */}
      {/*       <ScrollView showsVerticalScrollIndicator={false}>
        <MotiView animate={{ opacity: activeTab === "notes" ? 1 : 0 }}>
          {notesData.map((note) => (
            <NoteBox
              key={note.id}
              title={note.title}
              date={note.date}
              address={note.address}
              styleVariant={note.styleVariant}
              onPress={() => console.log("Open Note")}
            />
          ))}
        </MotiView>
        <MotiView animate={{ opacity: activeTab === "spots" ? 1 : 0 }}>
          {spotsData.map((spot) => (
            <SpotBox
              key={spot.id}
              image={spot.image}
              title={spot.title}
              date={spot.date}
              address={spot.address}
              onPress={() => console.log("View Spot")}
            />
          ))}
        </MotiView>
      </ScrollView> */}
    </View>
  );
};

export default BookmarksScreen;
