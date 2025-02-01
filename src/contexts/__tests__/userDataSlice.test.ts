import userDataReducer, {
  setSession,
  setAuth,
  setProfileId,
  setEmail,
  setName,
  setLastname,
  setDiscoveredArea,
  setDiscoveredPolygon,
  setAchievements,
  setPic,
  setNotes,
  setUserData,
  setSpots,
  clearUserData,
  UserDataState,
  Spot,
  Note,
  Photo,
  Achievement,
} from "../slices/userDataSlice";
import * as ImagePicker from "expo-image-picker";
import { Feature, GeoJsonProperties, Polygon, MultiPolygon } from "geojson";
import { Session } from "@supabase/supabase-js";

describe("userDataSlice", () => {
  const initialState: UserDataState = {
    session: null,
    auth: null,
    profile_id: "",
    email: "",
    name: "",
    lastname: "",
    discovered_area: 0,
    discovered_polygon: null,
    achievements: [],
    created_at: "",
    pic: null,
    notes: [],
    spots: [],
  };

  it("should handle initial state", () => {
    expect(userDataReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  it("should handle setSession", () => {
    const newSession: Session = {
      access_token: "token",
      token_type: "bearer",
      user: { id: "user-id" },
    } as Session;
    const actual = userDataReducer(initialState, setSession(newSession));
    expect(actual.session).toEqual(newSession);
  });

  it("should handle setAuth", () => {
    const actual = userDataReducer(initialState, setAuth(true));
    expect(actual.auth).toEqual(true);
  });

  it("should handle setProfileId", () => {
    const actual = userDataReducer(initialState, setProfileId("profile-id"));
    expect(actual.profile_id).toEqual("profile-id");
  });

  it("should handle setEmail", () => {
    const actual = userDataReducer(initialState, setEmail("test@example.com"));
    expect(actual.email).toEqual("test@example.com");
  });

  it("should handle setName", () => {
    const actual = userDataReducer(initialState, setName("John"));
    expect(actual.name).toEqual("John");
  });

  it("should handle setLastname", () => {
    const actual = userDataReducer(initialState, setLastname("Doe"));
    expect(actual.lastname).toEqual("Doe");
  });

  it("should handle setDiscoveredArea", () => {
    const actual = userDataReducer(initialState, setDiscoveredArea(100));
    expect(actual.discovered_area).toEqual(100);
  });

  it("should handle setDiscoveredPolygon", () => {
    const newPolygon: Feature<Polygon, GeoJsonProperties> = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      },
      properties: {},
    };
    const actual = userDataReducer(
      initialState,
      setDiscoveredPolygon(newPolygon)
    );
    expect(actual.discovered_polygon).toEqual(newPolygon);
  });

  it("should handle setAchievements", () => {
    const newAchievements: Achievement[] = [
      { id: 1, unlocked: true },
      { id: 2, unlocked: false },
    ];
    const actual = userDataReducer(
      initialState,
      setAchievements(newAchievements)
    );
    expect(actual.achievements).toEqual(newAchievements);
  });

  it("should handle setPic", () => {
    const newPic: Photo = {
      pictureUrl: "http://example.com/pic.jpg",
      arrayBuffer: "",
      path: "path/to/pic",
      image: {} as ImagePicker.ImagePickerAsset,
    };
    const actual = userDataReducer(initialState, setPic(newPic));
    expect(actual.pic).toEqual(newPic);
  });

  it("should handle setNotes", () => {
    const newNotes: Note[] = [
      {
        note_id: "1",
        created_at: "2023-01-01",
        coordinates: [0, 0],
        address: "123 Main St",
        title: "Note 1",
        content: "Content 1",
        image: 1,
      },
      {
        note_id: "2",
        created_at: "2023-01-02",
        coordinates: [1, 1],
        address: "456 Elm St",
        title: "Note 2",
        content: "Content 2",
        image: 2,
      },
    ];
    const actual = userDataReducer(initialState, setNotes(newNotes));
    expect(actual.notes).toEqual(newNotes);
  });

  it("should handle setUserData", () => {
    const newUserData: UserDataState = {
      session: {
        access_token: "token",
        token_type: "bearer",
        user: { id: "user-id" },
      } as Session,
      auth: true,
      profile_id: "profile-id",
      email: "test@example.com",
      name: "John",
      lastname: "Doe",
      discovered_area: 100,
      discovered_polygon: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [0, 0],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
        properties: {},
      },
      achievements: [
        { id: 1, unlocked: true },
        { id: 2, unlocked: false },
      ],
      created_at: "2023-01-01",
      pic: {
        pictureUrl: "http://example.com/pic.jpg",
        arrayBuffer: "",
        path: "path/to/pic",
        image: {} as ImagePicker.ImagePickerAsset,
      },
      notes: [
        {
          note_id: "1",
          created_at: "2023-01-01",
          coordinates: [0, 0],
          address: "123 Main St",
          title: "Note 1",
          content: "Content 1",
          image: 1,
        },
      ],
      spots: [
        {
          spot_id: "1",
          created_at: "2023-01-01",
          coordinates: [0, 0],
          address: "123 Main St",
          title: "Spot 1",
        },
      ],
    };
    const actual = userDataReducer(initialState, setUserData(newUserData));
    expect(actual).toEqual(newUserData);
  });

  it("should handle setSpots", () => {
    const newSpots: Spot[] = [
      {
        spot_id: "1",
        created_at: "2023-01-01",
        coordinates: [0, 0],
        address: "123 Main St",
        title: "Spot 1",
      },
      {
        spot_id: "2",
        created_at: "2023-01-02",
        coordinates: [1, 1],
        address: "456 Elm St",
        title: "Spot 2",
      },
    ];

    const actual = userDataReducer(initialState, setSpots(newSpots));
    expect(actual.spots).toEqual(newSpots);
  });

  it("should handle clearUserData", () => {
    const populatedState: UserDataState = {
      ...initialState,
      spots: [
        {
          spot_id: "1",
          created_at: "2023-01-01",
          coordinates: [0, 0],
          address: "123 Main St",
          title: "Spot 1",
        },
      ],
    };

    const actual = userDataReducer(populatedState, clearUserData());
    expect(actual.spots).toEqual([]);
  });
});
