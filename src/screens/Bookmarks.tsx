import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  PanResponder,
  ActivityIndicator,
  Alert,
} from "react-native";
import NoteBox from "../components/NoteBox";
import SpotBox from "../components/SpotBox";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";
import { colors } from "../../colors";
import { Note, Spot } from "../contexts/slices/userDataSlice";
import { useAppSelector } from "../contexts/hooks";

const BookmarksScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(true);

  const spotsData = useAppSelector((state) => state.userData.spots);
  const notesData = useAppSelector((state) => state.userData.notes);

  const navigation = useNavigation();

  const tabs = [
    { key: "notes", label: "Notes" },
    { key: "spots", label: "Spots" },
  ];

  const goToDetails = (type: "note" | "spot", itemId: string) => {
    console.log("Navigating pressed");
    if (type === "note") {
      navigation.navigate("NoteDetails", { itemId } as any);
    } else {
      // Replace `notesData` with `spotsData` when accessing spots
      const spot = spotsData.find((spot) => spot.spot_id === itemId) ?? {
        spot_id: "2",
        created_at: "2022-01-02T00:00:00Z",
        coordinates: [],
        address: "Address 2",
        title: "Spot 2",
      };

      const { coordinates } = spot;

      if (coordinates.length < 2) {
        console.error("Coordinates not available for spot:", itemId);
        return;
      }

      try {
        navigation.navigate("Home", {
          externalCoordinates: {
            longitude: coordinates[0],
            latitude: coordinates[1],
          },
        } as any);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  const [activeWidth, setActiveWidth] = useState(0);
  const [inactiveWidth, setInactiveWidth] = useState(0);
  const [tabsWidth, setTabsWidth] = useState(0);

  useEffect(() => {
    setActiveWidth(tabsWidth * 0.6 - 5);
    setInactiveWidth(tabsWidth * 0.4 - 5);
  }, [tabsWidth]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
          testID="notes-tab"
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
          testID="spots-tab"
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

      {/* Content */}

      <View className="flex-1 h-1/2">
        {loading ? (
          <ActivityIndicator
            testID="loading-indicator"
            size="large"
            color={colors.accentRed}
          />
        ) : (
          <>
            <MotiView
              {...panResponder.panHandlers}
              testID="notes-panel"
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
              {notesData.length === 0 ? (
                <Text className="text-textBody text-center mt-10 font-senRegular">
                  No notes found, create your first note to see it here!
                </Text>
              ) : (
                <FlatList
                  data={notesData}
                  keyExtractor={(item) => item.note_id}
                  renderItem={({ item }) => (
                    <NoteBox
                      title={item.title}
                      date={formatDate(item.created_at)}
                      address={item.address}
                      styleVariant={item.image}
                      onPress={() => goToDetails("note", item.note_id)}
                    />
                  )}
                />
              )}
            </MotiView>

            <MotiView
              {...panResponder.panHandlers}
              testID="spots-panel"
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
              {spotsData.length === 0 ? (
                <Text className="text-textBody text-center mt-10 font-senRegular">
                  No spots found, create your first spot to see it here!
                </Text>
              ) : (
                <FlatList
                  data={spotsData}
                  keyExtractor={(item) => item.spot_id}
                  renderItem={({ item }) => (
                    <SpotBox
                      spot_id={item.spot_id}
                      image={require("../../assets/images/bookmarks/spotDefault.svg")}
                      title={item.title}
                      date={formatDate(item.created_at)}
                      address={item.address}
                      onPress={() => goToDetails("spot", item.spot_id)}
                    />
                  )}
                />
              )}
            </MotiView>
          </>
        )}
      </View>
    </View>
  );
};

export default BookmarksScreen;
