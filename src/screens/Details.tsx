import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Alert } from "react-native";
import { supabase } from "../utils/supabase";
import { Input } from "react-native-elements";
import { signOut, signInWithEmail, signUpUser } from "../utils/UserManagement";

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
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>

      <Button onPress={() => navigation.goBack()}>Go back</Button>
      {isAuthenticated ? (
        <>
          <Button onPress={signOut}>Logout</Button>
          <Input placeholder="name" value={name} onChangeText={setName} />

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
          <Button onPress={() => signInWithEmail({ email, password })}>
            Login
          </Button>

          <Input placeholder="name" value={name} onChangeText={setName}></Input>
          <Input
            placeholder="lastname"
            value={lastname}
            onChangeText={setLastname}
          ></Input>
          <Button
            onPress={() => signUpUser({ email, password, name, lastname })}
          >
            Sign Up
          </Button>
        </>
      )}
    </View>
  );
};

export default Details;
