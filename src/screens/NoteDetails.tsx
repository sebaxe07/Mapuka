import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Settings from "../../assets/icons/bookmarks/settings.svg";
import Place from "../../assets/icons/bookmarks/place.svg"; // Assuming Place is your location icon
import { colors } from "../../colors";
import { useNavigation } from "@react-navigation/native";

import { Note } from "../contexts/slices/userDataSlice";

const NoteDetails: React.FC = ({ route }: any) => {
  const { itemId } = route.params;

  const [notesData, setNotesData] = useState<Note[]>([
    {
      note_id: "1",
      created_at: "14-04-2024",
      coordinates: [9.189988, 45.463702],
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
  ]);

  const note = notesData.find((note) => note.note_id === itemId);

  const [isEditing, setIsEditing] = useState(false);
  const [editableNote, setEditableNote] = useState(note);

  const navigation = useNavigation();

  if (!note) {
    return (
      <View className="flex-1 bg-bgMain h-full px-5 justify-center items-center">
        <Text className="text-textWhite text-xl">Note not found.</Text>
      </View>
    );
  }

  const handleSave = () => {
    setNotesData((prev) =>
      prev.map((n) => (n.note_id === itemId ? { ...n, ...editableNote } : n))
    );
    setIsEditing(false); // Exit editing mode
  };

  const onPress = (longitude: number, latitude: number) => {
    try {
      navigation.navigate("Home", {
        externalCoordinates: { longitude, latitude },
      } as any);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View className="flex bg-bgMain h-full px-5">
      {/* Header */}
      <View className="flex w-full my-14 justify-center items-start">
        <Text className="text-textWhite text-4xl font-senMedium mb-1 ml-10">
          Note
        </Text>
      </View>

      {/* Content */}
      <View className="flex-4 h-3/4 gap-3">
        {/* Edit / Save Button */}
        <View className="w-full pt-6 items-end px-5">
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            <View className="flex-row items-center">
              <Settings />
              <Text className="text-textInput text-xl font-senRegular mb-1 ml-4">
                {isEditing ? "Save" : "Edit"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Note Details */}
        <View className="flex-1 h-[80%] justify-around rounded-3xl bg-boxMenu px-6 py-4">
          <View>
            {/* Date */}
            {isEditing ? (
              <TextInput
                value={editableNote?.created_at}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, created_at: text })
                }
                className="text-textBody text-base mb-1 border-b border-textBody"
              />
            ) : (
              <Text className="text-textBody text-base mb-1">
                {note.created_at}
              </Text>
            )}

            {/* Title */}
            {isEditing ? (
              <TextInput
                value={editableNote?.title}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, title: text })
                }
                className="text-boxContainer text-4xl font-senMedium mb-4 border-b border-boxContainer"
              />
            ) : (
              <Text className="text-boxContainer text-4xl font-senMedium mb-4">
                {note.title}
              </Text>
            )}

            {/* Address */}
            <View className="flex-row items-center mb-4">
              <Place
                width={16}
                height={16}
                color={colors.bodyText}
                style={{ marginRight: 8 }}
              />
              {isEditing ? (
                <TextInput
                  value={editableNote?.address}
                  onChangeText={(text) =>
                    setEditableNote({ ...editableNote, address: text })
                  }
                  className="text-textBody text-base border-b border-textBody"
                />
              ) : (
                <Text className="text-textBody text-base">{note.address}</Text>
              )}
            </View>

            {/* Content */}
            {isEditing ? (
              <TextInput
                value={editableNote?.content}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, content: text })
                }
                multiline
                className="text-textBody text-base border-b border-textBody"
              />
            ) : (
              <Text className="text-textBody text-base">{note.content}</Text>
            )}
          </View>

          {/* Go to Spot Button */}
          <View className="flex-row justify-center w-full">
            <TouchableOpacity
              className="bg-buttonAccentRed rounded-3xl items-center justify-center w-1/2 px-5 py-3"
              onPress={() => onPress(note.coordinates[0], note.coordinates[1])}
            >
              <Text className="text-textWhite text-sm font-senSemiBold">
                Go to Spot
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default NoteDetails;
