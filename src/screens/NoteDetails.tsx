import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import Settings from "../../assets/icons/bookmarks/settings.svg";
import Place from "../../assets/icons/bookmarks/place.svg";
import Edit from "../../assets/icons/profile/edit_clean.svg";
import Trash from "../../assets/icons/bookmarks/trash.svg";
import { colors } from "../../colors";
import { useNavigation } from "@react-navigation/native";
import { Note } from "../contexts/slices/userDataSlice";
import * as NoteBg from "../../assets/images/bookmarks/index";

const NoteDetails: React.FC = ({ route }: any) => {
  const { itemId } = route.params;

  const [notesData, setNotesData] = useState<Note[]>([
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
  ]);

  const Backgrounds = [
    NoteBg.Style1,
    NoteBg.Style2,
    NoteBg.Style3,
    NoteBg.Style4,
    NoteBg.Style5,
    NoteBg.Style6,
  ];

  const note = notesData.find((note) => note.note_id === itemId);

  const [isEditing, setIsEditing] = useState(false);
  const [editableNote, setEditableNote] = useState<Note | undefined>(note);
  const [isModalVisible, setIsModalVisible] = useState(false); // For the image picker modal

  const navigation = useNavigation();

  if (!note) {
    return (
      <View className="flex-1 bg-bgMain h-full px-5 justify-center items-center">
        <Text className="text-textWhite text-xl">Note not found.</Text>
      </View>
    );
  }

  // Handle Save
  const handleSave = () => {
    setNotesData((prev) =>
      prev.map((n) => (n.note_id === itemId ? { ...n, ...editableNote } : n))
    );
    setIsEditing(false);
  };

  // Handle Delete Note
  const handleDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setNotesData((prev) => prev.filter((n) => n.note_id !== itemId));
          navigation.goBack(); // Go back to the previous screen
        },
      },
    ]);
  };

  // Handle Navigation to Coordinates
  const onPress = (latitude: number, longitude: number) => {
    try {
      navigation.navigate("Home", {
        externalCoordinates: { latitude, longitude },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Render SVG Image Picker Modal
  const renderImagePickerModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View className="flex-1 justify-end w-full h-full">
        <View
          className="bg-boxContainer px-6 py-8"
          style={{
            borderTopLeftRadius: 20, // Rounded top-left corner
            borderTopRightRadius: 20, // Rounded top-right corner
          }}
        >
          <Text className="text-textWhite text-lg font-senSemiBold mb-4">
            Change Note Background
          </Text>
          <FlatList
            data={Backgrounds}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item: Background, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setEditableNote((prev) => ({
                    ...prev,
                    image: index,
                  }));
                  setIsModalVisible(false);
                }}
                className="mr-4 w-24 h-24 rounded-lg items-center justify-center"
              >
                <Background width={85} height={85} />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            className="bg-buttonAccentRed rounded-3xl items-center justify-center w-1/2 mt-6 px-5 py-3 self-center"
            onPress={() => setIsModalVisible(false)}
          >
            <Text className="text-textWhite text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
        <View className="flex-row w-full justify-between px-6 items-center">
          <View className="flex-row gap-5">
            {/* Image Picker */}
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Settings />
            </TouchableOpacity>
            {/* Edit / Save Button */}
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Edit />
                <Text className="text-textInput text-xl font-senRegular ">
                  {isEditing ? "Save" : "Edit"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Delete Note */}
          <View className="justify-center items-center ">
            <TouchableOpacity onPress={handleDelete}>
              <Trash />
            </TouchableOpacity>
          </View>
        </View>

        {/* Note Details */}
        <View className="flex-1 h-[80%] justify-around rounded-3xl bg-boxMenu px-6 py-4">
          <View>
            <Text className="text-textBody text-base mb-1">
              {note.created_at}
            </Text>
            {/* Title */}
            {isEditing ? (
              <TextInput
                value={editableNote?.title || ""}
                onChangeText={(text) =>
                  setEditableNote(
                    (prev) =>
                      ({
                        ...prev,
                        title: text,
                      }) as Note
                  )
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
                  value={editableNote?.address || ""}
                  onChangeText={(text) =>
                    setEditableNote(
                      (prev) =>
                        ({
                          ...prev,
                          address: text,
                        }) as Note
                    )
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
                value={editableNote?.content || ""}
                onChangeText={(text) =>
                  setEditableNote(
                    (prev) =>
                      ({
                        ...prev,
                        content: text,
                      }) as Note
                  )
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

      {/* Render Modal */}
      {renderImagePickerModal()}
    </View>
  );
};

export default NoteDetails;
