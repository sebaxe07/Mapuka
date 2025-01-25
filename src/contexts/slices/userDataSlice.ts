import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Session } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import { Feature, GeoJsonProperties, Polygon, MultiPolygon } from "geojson";

// Define a type for the photo
export interface Photo {
  pictureUrl: string;
  arrayBuffer: string;
  path: string;
  image: ImagePicker.ImagePickerAsset;
}

export interface Note {
  note_id: string;
  created_at: string;
  coordinates: number[];
  title: string;
  content: string;
  image: Photo;
}
export interface Spot {
  spot_id: string;
  created_at: string;
  coordinates: number[];
  title: string;
}

// Define a type for the slice state
export interface UserDataState {
  session: Session | null;
  auth: boolean | null;
  profile_id: string;
  email: string;
  name: string;
  lastname: string;
  discovered_area: number;
  discovered_polygon: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null;
  achievements: string;
  created_at: string;
  notes: Note[];
  spots: Spot[];
}

// Define the initial state using that type
const initialState = {
  session: null,
  auth: null,
  profile_id: "",
  email: "",
  name: "",
  lastname: "",
  discovered_area: 0,
  discovered_polygon: null,
  achievements: "",
  created_at: "",
  notes: [],
  spots: [],
} as UserDataState;

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
    setAuth: (state, action: PayloadAction<boolean | null>) => {
      state.auth = action.payload;
    },
    setProfileId: (state, action: PayloadAction<string>) => {
      state.profile_id = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setLastname: (state, action: PayloadAction<string>) => {
      state.lastname = action.payload;
    },
    setDiscoveredArea: (state, action: PayloadAction<number>) => {
      state.discovered_area = action.payload;
    },
    setDiscoveredPolygon: (
      state,
      action: PayloadAction<Feature<
        Polygon | MultiPolygon,
        GeoJsonProperties
      > | null>
    ) => {
      state.discovered_polygon = action.payload;
    },
    setAchievements: (state, action: PayloadAction<string>) => {
      state.achievements = action.payload;
    },
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    setSpots: (state, action: PayloadAction<Spot[]>) => {
      state.spots = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserDataState>) => {
      state.session = action.payload.session;
      state.auth = action.payload.session ? true : false;
      state.profile_id = action.payload.profile_id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.lastname = action.payload.lastname;
      state.discovered_area = action.payload.discovered_area;
      state.discovered_polygon = action.payload.discovered_polygon;
      state.achievements = action.payload.achievements;
      state.created_at = action.payload.created_at;
      state.notes = action.payload.notes;
      state.spots = action.payload.spots;
    },
    clearUserData: (state) => {
      state.session = null;
      state.auth = null;
      state.profile_id = "";
      state.email = "";
      state.name = "";
      state.lastname = "";
      state.discovered_area = 0;
      state.discovered_polygon = null;
      state.achievements = "";
      state.notes = [];
      state.spots = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSession,
  setAuth,
  setProfileId,
  setEmail,
  setName,
  setLastname,
  setDiscoveredArea,
  setDiscoveredPolygon,
  setAchievements,
  setNotes,
  setSpots,
  setUserData,
  clearUserData,
} = userDataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserData = (state: RootState) => state.userData;

export default userDataSlice.reducer;
