import { createAppSlice } from "@/lib/utils/createAppSlice";
import { IOrder } from "@/models/order.model";
import { getOrders } from "@/services/dashboard.service";
import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

interface OrderState {
  loading: boolean;
  success: boolean;
  message: string;
  orders: IOrder[];
}

interface IOrderResponse {
  data: IOrder[];
  message: string;
  status: string;
}

const ordersSlice = createAppSlice({
  name: "orders",
  initialState: {
    loading: false,
    success: false,
    message: "",
    orders: [],
  } as OrderState,
  reducers: (create) => ({
    fetchOrders: create.asyncThunk(
      async () => {
        const res = await getOrders();
        const data = (await res.json()) as IOrderResponse;
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
          state.orders = action.payload.data || [];
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

export const { fetchOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
