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
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import Toast from "react-native-toast-message";

interface NoteDetailsProps {
  route: {
    params: {
      itemId: string;
    };
  };
}

const NoteDetails: React.FC<NoteDetailsProps> = ({ route }) => {
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

  const [isAlertChangeBGVisible, setIsAlertChangeBGVisible] = useState(false);

  const { itemId } = route.params;
  const notesData = useAppSelector((state) => state.userData.notes);
  const note = notesData.find((note) => note.note_id === itemId);

  const [isEditing, setIsEditing] = useState(false);
  const [editableNote, setEditableNote] = useState<Note | undefined>(note);
  const [isModalVisible, setIsModalVisible] = useState(false); // For the image picker modal

  // This is to prevent useEffects from running on the first render
  const [hasMounted, setHasMounted] = useState(false);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // Will be true after the first render
  useEffect(() => {
    setHasMounted(true);
  }, []);

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
    if (!editableNote) return;

    const { data, error } = await supabase
      .from("notes")
      .update({
        title: editableNote?.title,
        content: editableNote?.content,
        address: editableNote?.address,
        image: editableNote?.image,
      })
      .eq("note_id", note.note_id);

    if (error) {
      console.error("Error saving edited note: ", error.message);
    }
  };

  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const validateTitle = (text: string) => {
    if (!text.trim()) {
      setTitleError("Title is required.");
    } else if (text.length > 100) {
      setTitleError("Title must be under 100 characters.");
    } else {
      setTitleError(null);
    }
    setEditableNote({ ...editableNote, title: text } as any);
  };

  const validateAddress = (text: string) => {
    if (!text.trim()) {
      setAddressError("Address cannot be empty.");
    } else if (text.length > 50) {
      setAddressError("Address must be under 50 characters.");
    } else {
      setAddressError(null);
    }
    setEditableNote({ ...editableNote, address: text } as any);
  };

  const validateContent = (text: string) => {
    if (!text.trim()) {
      setContentError("Note description is required.");
    } else if (text.length > 500) {
      setContentError("Description must be under 500 characters.");
    } else {
      setContentError(null);
    }
    setEditableNote({ ...editableNote, content: text } as any);
  };

  // Function to check if the save button should be disabled
  const isSaveDisabled = !!(
    titleError ||
    contentError ||
    addressError ||
    !editableNote?.title.trim() ||
    !editableNote?.content.trim() ||
    !editableNote?.address.trim()
  );

  // Handle Save
  const handleSave = async () => {
    try {
      // Update database first
      await updateNote();

      // Update Redux state directly (global context)
      const updatedNotes = notesData.map((n) =>
        n.note_id === itemId ? { ...n, ...editableNote } : n
      );

      console.log(
        "Entered handleSave. Note image after update: ",
        editableNote?.image
      );
      dispatch(setNotes(updatedNotes));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
    Toast.show({
      position: "bottom",
      visibilityTime: 2000,
      autoHide: true,
      type: "success",
      text1: "Note updated",
      text2: "Your changes have been saved successfully!",
    });
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
    Toast.show({
      autoHide: true,
      position: "bottom",
      visibilityTime: 2000,
      type: "info",
      text1: "Note deleted",
      text2: "Note deleted successfully!",
    });

    // Update Redux state directly (global state)
    const filteredNotes = notesData.filter((n) => n.note_id !== itemId);
    dispatch(setNotes(filteredNotes));

    // Navigate back only after state updates
    navigation.goBack();
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

  const [currentBackground, setCurrentBackground] = useState<number>(
    note.image
  ); // Stores confirmed background
  const [changedBackground, setChangedBackground] = useState<number>(
    note.image
  ); // Tracks live selection

  const closeModal = () => {
    Keyboard.dismiss();
    setChangedBackground(currentBackground); // Reset selection on cancel
    setIsModalVisible(false);
  };

  // Edit image on note when user changes the current image
  useEffect(() => {
    if (hasMounted) {
      console.log(
        "USEEFFECT1: Changing image in editable note to: ",
        currentBackground
      );
      setEditableNote({ ...editableNote, image: currentBackground } as any);
    }
  }, [currentBackground]);

  // Save image when editableNote changes that specific attribute
  useEffect(() => {
    if (hasMounted && editableNote !== null) {
      console.log(
        "USEEFFECT2: Changing image in DB and global context to: ",
        editableNote?.image
      );
      handleSave();
    }
  }, [editableNote?.image]);

  const renderImagePickerModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent
      onRequestClose={closeModal}
      onDismiss={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View className="flex-1 justify-end">
          <View className="bg-boxContainer px-6 py-8 rounded-t-2xl">
            <Text className="text-textWhite text-lg font-senSemiBold mb-4">
              Change Note Background
            </Text>

            <FlatList
              data={Backgrounds}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item: Background, index }) => {
                const isSelected = changedBackground === index;
                return (
                  <TouchableOpacity
                    testID={`Style${index}`}
                    onPress={() => setChangedBackground(index)} // Update temporary selection
                    className="mr-4 w-24 h-24 rounded-lg items-center justify-center"
                    style={
                      isSelected
                        ? {
                            borderWidth: 3,
                            borderColor: colors.accentRed,
                            borderRadius: 8,
                            height: 65,
                          }
                        : {}
                    }
                  >
                    <Background width={85} height={85} />
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              testID="cancel-save"
              className={`rounded-3xl items-center justify-center w-1/2 mt-6 px-5 py-3 self-center ${
                changedBackground === currentBackground
                  ? "bg-bgMain"
                  : "bg-buttonAccentRed"
              }`}
              onPress={() =>
                changedBackground === currentBackground
                  ? closeModal()
                  : setIsAlertChangeBGVisible(true)
              }
            >
              <Text className="text-textWhite text-center">
                {changedBackground === currentBackground ? "Cancel" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Save Confirmation Modal */}
      <AlertModal
        isVisible={isAlertChangeBGVisible}
        onBackdropPress={() => setIsAlertChangeBGVisible(false)}
        message="Change the current note background image?"
        onCancel={() => setIsAlertChangeBGVisible(false)}
        onConfirm={() => {
          setCurrentBackground(changedBackground); // Update confirmed selection

          setIsAlertChangeBGVisible(false);
          closeModal();
        }}
        confirmText="Yes"
        cancelText="No"
        loading={loading}
      />
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
            <TouchableOpacity
              testID="change-bg"
              onPress={() => setIsModalVisible(true)}
            >
              <Settings />
            </TouchableOpacity>
            {/* Edit / Save Button */}
            <TouchableOpacity
              onPress={() => {
                // Only handle the save after user is done editing
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
              testID="delete"
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
              <>
                <TextInput
                  testID="title-edit"
                  value={editableNote?.title || ""}
                  onChangeText={(text) => validateTitle(text)}
                  className="text-boxContainer text-4xl font-senMedium mb-2 border-b border-boxContainer"
                />
                {titleError ? (
                  <Text
                    testID="title-error"
                    className="text-buttonAccentRed font-senSemiBold text-sm"
                  >
                    {titleError}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text className="text-boxContainer text-4xl font-senMedium mb-4">
                {note.title}
              </Text>
            )}

            {/* Address */}
            <View className="flex-row items-center mb-2">
              <Place
                width={16}
                height={16}
                color={colors.bodyText}
                style={{ marginRight: 8 }}
              />
              {isEditing ? (
                <View className="flex-1">
                  <TextInput
                    testID="address-edit"
                    value={editableNote?.address || ""}
                    onChangeText={(text) => validateAddress(text)}
                    className="text-textBody text-base font-senRegular border-b border-textBody"
                  />
                  {addressError ? (
                    <Text
                      testID="address-error"
                      className="text-buttonAccentRed font-senSemiBold text-sm"
                    >
                      {addressError}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <Text className="text-textBody font-senRegular text-base">
                  {note.address}
                </Text>
              )}
            </View>

            {/* Content */}
            {isEditing ? (
              <>
                <TextInput
                  testID="content-edit"
                  value={editableNote?.content || ""}
                  onChangeText={(text) => validateContent(text)}
                  multiline
                  className="text-textBody text-wrap text-base font-senMedium border-b border-textBody mb-2"
                />
                {contentError ? (
                  <Text
                    testID="content-error"
                    className="text-buttonAccentRed font-senSemiBold text-sm"
                  >
                    {contentError}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text className="text-textBody font-senMedium text-base">
                {note.content}
              </Text>
            )}
          </View>

          {/* Go to Note Button/Save */}
          <View className="flex-row justify-center w-full">
            {isEditing ? (
              <TouchableOpacity
                testID="save"
                className={`bg-buttonAccentRed rounded-3xl items-center justify-center w-1/2 px-5 py-3 ${
                  isSaveDisabled ? "bg-textInput" : "bg-buttonAccentRed"
                }`}
                onPress={() => setIsAlertSaveVisible(true)}
                disabled={isSaveDisabled}
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
        message={`Are you sure you want to delete this note?`}
        onCancel={() => setIsAlertDeleteVisible(false)}
        onConfirm={async () => {
          try {
            // Delete from database first
            await deleteNote();
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
