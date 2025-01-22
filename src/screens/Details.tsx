import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Alert } from "react-native";
import { supabase } from "../utils/supabase";
import { Input } from "react-native-elements";

interface DetailsProps {}

const Details: React.FC<DetailsProps> = ({}) => {
  const navigation = useNavigation();

  const [users, setUsers] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setIsAuthenticated(!!session);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState<any | null>(null);

  async function signInWithEmail() {
    //setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      /*  Alert.alert(error.message) */
      if (error.message === "Invalid login credentials") {
        //setModalVisible(true)
      }
      console.error("Error sign message", error.message);
      console.error("Error sign error", error);

      ////setLoading(false)

      return;
    }
    console.log(JSON.stringify(data, null, 2));

    // Fetch user profile data from the 'profiles' table
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id_rel", data.user.id)
        .single();

      if (error) {
        console.error("Error fetching profiles:", error.message);
        return;
      }
      console.log("profiles", profiles);

      console.log("Setting data");
      setUsers(profiles);
      setUser(profiles);
    } catch (error) {
      console.error("Error fetching todos:", (error as any).message);
    }
    //setLoading(false)
  }

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");

  const updateName = async () => {
    console.log("user", user.profile_id);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: name,
      })
      .eq("profile_id", user.profile_id);

    if (error) {
      console.error("Error updating name:", error.message);
      return;
    }

    console.log("data", data);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }

    console.log("Logged out");
  };

  const SignUpUser = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          lastname: lastname,
        },
      },
    });

    if (error) {
      Alert.alert(error.message);
      return;
    }

    if (data) {
      signInWithEmail();
      console.log("User created");
      console.log(data);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>

      <Button onPress={() => navigation.goBack()}>Go back</Button>
      {isAuthenticated ? (
        <>
          <Button onPress={signOut}>Logout</Button>
          <Input placeholder="name" value={name} onChangeText={setName} />
          <Button onPress={updateName}>Update Name</Button>
          <Text>Todo List</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.profile_id.toString()}
            renderItem={({ item }) => (
              <Text key={item.profile_id}>{item.profile_id}</Text>
            )}
          />
        </>
      ) : (
        <>
          <Input placeholder="email" value={email} onChangeText={setEmail} />
          <Input
            placeholder="password"
            value={password}
            onChangeText={setPassword}
          />
          <Button onPress={signInWithEmail}>Login</Button>

          <Input placeholder="name" value={name} onChangeText={setName}></Input>
          <Input
            placeholder="lastname"
            value={lastname}
            onChangeText={setLastname}
          ></Input>
          <Button onPress={SignUpUser}>Sign Up</Button>
        </>
      )}
    </View>
  );
};

export default Details;
