import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Alert } from "react-native";
import { supabase } from "../utils/supabase";
import { Input } from "react-native-elements";
import { signOut, signInWithEmail, signUpUser } from "../utils/UserManagement";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { clearUserData } from "../contexts/slices/userDataSlice";

interface DetailsProps {}

const Details: React.FC<DetailsProps> = ({}) => {
  const navigation = useNavigation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userData);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");

  const logOut = async () => {
    signOut();
    dispatch(clearUserData());
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>

      <Button onPress={() => navigation.goBack()}>Go back</Button>
      {userData.auth ? (
        <>
          <Button onPress={logOut}>Logout</Button>
          <Input placeholder="name" value={name} onChangeText={setName} />
        </>
      ) : (
        <>
          <Input placeholder="email" value={email} onChangeText={setEmail} />
          <Input
            placeholder="password"
            value={password}
            onChangeText={setPassword}
          />
          <Button
            onPress={() => signInWithEmail({ email, password, dispatch })}
          >
            Login
          </Button>

          <Input placeholder="name" value={name} onChangeText={setName}></Input>
          <Input
            placeholder="lastname"
            value={lastname}
            onChangeText={setLastname}
          ></Input>
          <Button
            onPress={() =>
              signUpUser({ email, password, name, lastname, dispatch })
            }
          >
            Sign Up
          </Button>
        </>
      )}
    </View>
  );
};

export default Details;
