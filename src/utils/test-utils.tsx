// FILE: src/utils/test-utils.tsx

import React, { ReactElement } from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../contexts/slices/userDataSlice";

const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { userData: userDataReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react-native";
export { renderWithProviders };
