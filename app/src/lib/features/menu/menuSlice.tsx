import { createAppSlice } from "@/lib/utils/createAppSlice";
import { IMenu } from "@/models/menu.model";
import { getMenu } from "@/services/dashboard.service";
import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

interface MenuState {
  loading: boolean;
  success: boolean;
  message: string;
  menu: IMenu[];
}

interface IMenuResponse {
  data: IMenu[];
  message: string;
  status: string;
}

const menuSlice = createAppSlice({
  name: "menu",
  initialState: {
    loading: false,
    success: false,
    message: "",
    menu: [],
  } as MenuState,
  reducers: (create) => ({
    fetchMenu: create.asyncThunk(
      async () => {
        const res = await getMenu();
        const data = (await res.json()) as IMenuResponse;
        return data;
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.success = false;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.message = action.payload.message;
          state.menu = action.payload.data || [];
          if (action.payload.status === "error") {
            state.success = false;
          } else {
            state.success = true;
          }
        },
      },
    ),
  }),
});

export const { fetchMenu } = menuSlice.actions;

export default menuSlice.reducer;
