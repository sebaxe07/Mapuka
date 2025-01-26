import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Settings from "../../assets/icons/bookmarks/settings.svg";
import Place from "../../assets/icons/bookmarks/place.svg"; // Assuming Place is your location icon
import { colors } from "../../colors";

const NoteDetails: React.FC = ({ route }: any) => {
  const { itemId } = route.params;

  const notesData = [
    {
      id: 1,
      title: "Mystical Riverbend Spot",
      date: "12-01-2025",
      address: "Greenway Trail, 15",
      coordinates: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco, CA
      content:
        "Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla. Aliquam porttitor in est eget dapibus. Ut ac mi ac urna condimentum molestie vel non ex. Vestibulum dictum purus vulputate diam congue luctus vel ac eros. Vivamus convallis pretium diam, eu volutpat justo cursus id. Suspendisse fermentum venenatis eros nec interdum. Aliquam at pretium erat. Aliquam facilisis consectetur purus, a susc. elementum mauris, ut ornare elit euismod in. Proin et massa nisi. Suspendisse ipsum augue, viverra iaculis tincidunt laoreet, feugiat vulputate massa. ",
    },
    {
      id: 2,
      title: "Quiet Nook in the Library",
      date: "05-11-2024",
      address: "Maplewood Street, 34",
      coordinates: { latitude: 40.7128, longitude: -74.006 }, // New York, NY
      content:
        "Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla. Aliquam porttitor in est eget dapibus. Ut ac mi ac urna condimentum molestie vel non ex. Vestibulum dictum purus vulputate diam congue luctus vel ac eros. Vivamus convallis pretium diam, eu volutpat justo cursus id. Suspendisse fermentum venenatis eros nec interdum. Aliquam at pretium erat. Aliquam facilisis consectetur purus, a susc. elementum mauris, ut ornare elit euismod in. Proin et massa nisi. Suspendisse ipsum augue, viverra iaculis tincidunt laoreet, feugiat vulputate massa. ",
    },
    {
      id: 3,
      title: "Hidden Garden Oasis",
      date: "23-08-2023",
      address: "Hilltop Avenue, 102",
      coordinates: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles, CA
      content:
        "Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla. Aliquam porttitor in est eget dapibus. Ut ac mi ac urna condimentum molestie vel non ex. Vestibulum dictum purus vulputate diam congue luctus vel ac eros. Vivamus convallis pretium diam, eu volutpat justo cursus id. Suspendisse fermentum venenatis eros nec interdum. Aliquam at pretium erat. Aliquam facilisis consectetur purus, a susc. elementum mauris, ut ornare elit euismod in. Proin et massa nisi. Suspendisse ipsum augue, viverra iaculis tincidunt laoreet, feugiat vulputate massa. ",
    },
    {
      id: 4,
      title: "Sunny Meadow Viewpoint",
      date: "17-02-2025",
      address: "Orchard Lane, 56",
      coordinates: { latitude: 36.7783, longitude: -119.4179 }, // California (Central)
      content:
        "Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla. Aliquam porttitor in est eget dapibus. Ut ac mi ac urna condimentum molestie vel non ex. Vestibulum dictum purus vulputate diam congue luctus vel ac eros. Vivamus convallis pretium diam, eu volutpat justo cursus id. Suspendisse fermentum venenatis eros nec interdum. Aliquam at pretium erat. Aliquam facilisis consectetur purus, a susc. elementum mauris, ut ornare elit euismod in. Proin et massa nisi. Suspendisse ipsum augue, viverra iaculis tincidunt laoreet, feugiat vulputate massa. ",
    },
    {
      id: 5,
      title: "Old Stone Bridge Path",
      date: "10-07-2023",
      address: "Riverside Road, 18",
      coordinates: { latitude: 51.5074, longitude: -0.1278 }, // London, UK
      content:
        "Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla. Aliquam porttitor in est eget dapibus. Ut ac mi ac urna condimentum molestie vel non ex. Vestibulum dictum purus vulputate diam congue luctus vel ac eros. Vivamus convallis pretium diam, eu volutpat justo cursus id. Suspendisse fermentum venenatis eros nec interdum. Aliquam at pretium erat. Aliquam facilisis consectetur purus, a susc. elementum mauris, ut ornare elit euismod in. Proin et massa nisi. Suspendisse ipsum augue, viverra iaculis tincidunt laoreet, feugiat vulputate massa. ",
    },
    {
      id: 6,
      title: "Enchanted Woods Retreat",
      date: "30-03-2024",
      address: "Willow Lane, 75",
      coordinates: { latitude: 48.8566, longitude: 2.3522 }, // Paris, France
      content:
        "Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla. Aliquam porttitor in est eget dapibus. Ut ac mi ac urna condimentum molestie vel non ex. Vestibulum dictum purus vulputate diam congue luctus vel ac eros. Vivamus convallis pretium diam, eu volutpat justo cursus id. Suspendisse fermentum venenatis eros nec interdum. Aliquam at pretium erat. Aliquam facilisis consectetur purus, a susc. elementum mauris, ut ornare elit euismod in. Proin et massa nisi. Suspendisse ipsum augue, viverra iaculis tincidunt laoreet, feugiat vulputate massa. ",
    },
    {
      id: 7,
      title: "Cozy Bench Under the Stars",
      date: "21-10-2024",
      address: "Lakeview Drive, 89",
      coordinates: { latitude: 47.6062, longitude: -122.3321 }, // Seattle, WA
      content:
        "Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla. Aliquam porttitor in est eget dapibus. Ut ac mi ac urna condimentum molestie vel non ex. Vestibulum dictum purus vulputate diam congue luctus vel ac eros. Vivamus convallis pretium diam, eu volutpat justo cursus id. Suspendisse fermentum venenatis eros nec interdum. Aliquam at pretium erat. Aliquam facilisis consectetur purus, a susc. elementum mauris, ut ornare elit euismod in. Proin et massa nisi. Suspendisse ipsum augue, viverra iaculis tincidunt laoreet, feugiat vulputate massa. ",
    },
    {
      id: 8,
      title: "Serene Forest Clearing",
      date: "06-12-2023",
      address: "Evergreen Boulevard, 12",
      coordinates: { latitude: 35.6895, longitude: 139.6917 }, // Tokyo, Japan
      content:
        "Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla. Aliquam porttitor in est eget dapibus. Ut ac mi ac urna condimentum molestie vel non ex. Vestibulum dictum purus vulputate diam congue luctus vel ac eros. Vivamus convallis pretium diam, eu volutpat justo cursus id. Suspendisse fermentum venenatis eros nec interdum. Aliquam at pretium erat. Aliquam facilisis consectetur purus, a susc. elementum mauris, ut ornare elit euismod in. Proin et massa nisi. Suspendisse ipsum augue, viverra iaculis tincidunt laoreet, feugiat vulputate massa. ",
    },
  ];

  const note = notesData.find((note) => note.id === itemId);

  if (!note) {
    return (
      <View className="flex-1 bg-bgMain h-full px-5 justify-center items-center">
        <Text className="text-textWhite text-xl">Note not found.</Text>
      </View>
    );
  }

  const { title, date, address, coordinates, content } = note;

  const onPress = () => {
    console.log(`Viewing spot: ${title}, located at ${address}`);
    // Add further navigation or actions based on the note's coordinates
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
        {/* Settings */}
        <View className="w-full pt-6 items-end px-5">
          <View className="flex-row items-center">
            <Settings />
            <Text className="text-textInput text-xl font-senRegular mb-1 ml-4">
              Edit
            </Text>
          </View>
        </View>

        {/* Note Details */}
        <View className="flex-1 h-[80%] justify-around rounded-3xl bg-boxMenu px-6 py-4">
          <View>
            <Text className="text-textBody text-base mb-1">{date}</Text>
            <Text className="text-boxContainer text-4xl font-senMedium mb-4">
              {title}
            </Text>
            <View className="flex-row items-center mb-4">
              <Place
                width={16}
                height={16}
                color={colors.bodyText}
                style={{ marginRight: 8 }}
              />
              <Text className="text-textBody text-base">{address}</Text>
            </View>
            <View className="flex-wrap px-6 py-4 items-center mb-4">
              <Text className="text-textBody text-base">{content}</Text>
            </View>
          </View>
          <View className="flex-row justify-center w-full">
            <TouchableOpacity
              className="bg-buttonOrange rounded-3xl items-center justify-center w-1/2 px-5 py-3"
              onPress={onPress}
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
