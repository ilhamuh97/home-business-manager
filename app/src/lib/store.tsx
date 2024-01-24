import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./features/order/orderSlice";
import menuSlice from "./features/menu/menuSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      orderSlice,
      menuSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
