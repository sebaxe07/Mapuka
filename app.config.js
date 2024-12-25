export default ({ config }) => {
  return {
    ...config,
    name: process.env.APP_NAME || "Mapuka",
    slug: "Mapuka",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.sebaxe07.Mapuka",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.RNMapboxMapsDownloadToken,
        },
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission: "Show current location on map.",
        },
      ],
      [
        "expo-dev-launcher",
        {
          launchMode: "most-recent",
        },
      ],
    ],

    extra: {
      eas: {
        projectId: "7cf31845-f039-4b8a-bf90-99939987969e",
      },
    },
  };
};
