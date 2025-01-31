import React, { useEffect, useState } from "react";
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
import { Note, setNotes } from "../contexts/slices/userDataSlice";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { supabase } from "../utils/supabase";
import * as NoteBg from "../../assets/images/bookmarks/index";
import AlertModal from "../components/AlertModal";

const NoteDetails: React.FC = ({ route }: any) => {
  const Backgrounds = [
    NoteBg.Style1,
    NoteBg.Style2,
    NoteBg.Style3,
    NoteBg.Style4,
    NoteBg.Style5,
    NoteBg.Style6,
  ];

  const [loading, setLoading] = useState(false);
  const [isAlertSaveVisible, setIsAlertSaveVisible] = useState(false);
  const [isAlertCancelVisible, setIsAlerCancelVisible] = useState(false);

  const [isAlertDeleteVisible, setIsAlertDeleteVisible] = useState(false);

  const { itemId } = route.params;
  const notesData = useAppSelector((state) => state.userData.notes);
  const note = notesData.find((note) => note.note_id === itemId);

  const [isEditing, setIsEditing] = useState(false);
  const [editableNote, setEditableNote] = useState<Note | undefined>(note);
  const [isModalVisible, setIsModalVisible] = useState(false); // For the image picker modal

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  if (!note) {
    return (
      <View className="flex-1 bg-bgMain h-full px-5 justify-center items-center">
        <Text className="text-textWhite text-xl">Note not found.</Text>
      </View>
    );
  }

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

  // Update note in database
  const updateNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .update({
        title: editableNote?.title,
        content: editableNote?.content,
        address: editableNote?.address,
      })
      .eq("note_id", note.note_id);

    if (error) {
      console.error("Error saving edited note: ", error.message);
      return;
    }
  };

  // Handle Save
  const handleSave = async () => {
    try {
      // Update database first
      await updateNote();

      // Update Redux state directly (global context)
      const updatedNotes = notesData.map((n) =>
        n.note_id === itemId ? { ...n, ...editableNote } : n
      );
      dispatch(setNotes(updatedNotes));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("note_id", note.note_id);

    if (error) {
      console.error("Error deleting note: ", error.message);
      return;
    }
  };

  // Handle Navigation to Coordinates
  const onPress = (longitude: number, latitude: number) => {
    try {
      navigation.navigate("Home", {
        externalCoordinates: { longitude, latitude },
      } as any);
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
                  setEditableNote(
                    (prev) =>
                      ({
                        ...prev,
                        image: index,
                      }) as any
                  );
                  setIsModalVisible(false);
                }}
                className="mr-4 w-24 h-24 rounded-lg items-center justify-center"
                style={
                  editableNote?.image === index
                    ? {
                        borderWidth: 2,
                        borderColor: colors.accentRed,
                        borderRadius: 20,
                      }
                    : {}
                }
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
                  setIsAlerCancelVisible(true);
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Edit />
                <Text className="text-textInput text-xl font-senRegular ">
                  {isEditing ? "Cancel" : "Edit"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Delete Note */}
          <View className="justify-center items-center ">
            <TouchableOpacity
              onPress={() => {
                setIsAlertDeleteVisible(true);
              }}
            >
              <Trash />
            </TouchableOpacity>
          </View>
        </View>

        {/* Note Details */}
        <View className="flex-1 h-[80%] justify-around rounded-3xl bg-boxMenu px-6 py-4">
          <View>
            {/* Date */}
            <Text className="text-textBody text-base mb-1">
              {formatDate(note.created_at)}
            </Text>

            {/* Title */}
            {isEditing ? (
              <TextInput
                value={editableNote?.title || ""}
                onChangeText={(text) =>
                  setEditableNote({ ...editableNote, title: text } as any)
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
                    setEditableNote({ ...editableNote, address: text } as any)
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
                  setEditableNote({ ...editableNote, content: text } as any)
                }
                multiline
                className="text-textBody text-base border-b border-textBody"
              />
            ) : (
              <Text className="text-textBody text-base">{note.content}</Text>
            )}
          </View>

          {/* Go to Note Button/Save */}
          <View className="flex-row justify-center w-full">
            {isEditing ? (
              <TouchableOpacity
                className="bg-buttonAccentRed rounded-3xl items-center justify-center w-1/2 px-5 py-3"
                onPress={() => setIsAlertSaveVisible(true)}
              >
                <Text className="text-textWhite text-sm font-senSemiBold">
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-buttonAccentRed rounded-3xl items-center justify-center w-1/2 px-5 py-3"
                onPress={() =>
                  onPress(note.coordinates[0], note.coordinates[1])
                }
              >
                <Text className="text-textWhite text-sm font-senSemiBold">
                  Go to Note
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Render Modal */}
      {renderImagePickerModal()}

      {/* Save Confirmation Modal */}
      <AlertModal
        isVisible={isAlertSaveVisible}
        onBackdropPress={() => setIsAlertSaveVisible(false)}
        message="Want to save the changes?"
        onCancel={() => setIsAlertSaveVisible(false)}
        onConfirm={() => {
          handleSave();
          setIsAlertSaveVisible(false);
        }}
        confirmText="Yes"
        cancelText="Cancel"
        loading={loading}
      />

      {/* Cancel Confirmation Modal */}
      <AlertModal
        isVisible={isAlertCancelVisible}
        onBackdropPress={() => setIsAlerCancelVisible(false)}
        message={`Want to cancel the changes?\nAll unsaved changes will be lost.`}
        onCancel={() => setIsAlerCancelVisible(false)}
        onConfirm={() => {
          setEditableNote(note); // Restore original note
          setIsEditing(false);
          setIsAlerCancelVisible(false);
        }}
        confirmText="Yes"
        cancelText="Cancel"
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        isVisible={isAlertDeleteVisible}
        onBackdropPress={() => setIsAlertDeleteVisible(false)}
        message={`Are you sure you want to delete this note?\nThis action cannot be undone.`}
        onCancel={() => setIsAlertDeleteVisible(false)}
        onConfirm={async () => {
          try {
            // Delete from database first
            await deleteNote();

            // Update Redux state directly (global state)
            const filteredNotes = notesData.filter((n) => n.note_id !== itemId);
            dispatch(setNotes(filteredNotes));

            // Navigate back only after state updates
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting note:", error);
          }
        }}
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
      />
    </View>
  );
};

export default NoteDetails;
