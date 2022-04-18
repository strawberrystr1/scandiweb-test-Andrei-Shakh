import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import { ICartStorageItem, IReduceAmountPayload, IStorageState } from '../../interfaces';

const initialState: IStorageState = {
  products: [],
  currency: '$',
  cartOpen: false,
};

export const counterSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartStorageItem>) => {
      const checkAttributes = (item: WritableDraft<ICartStorageItem>) => {
        if (!item.attributes.length) return true;
        const keys = item.attributes.map((item) => Object.keys(item)).flat(1);
        const isEaqual = item.attributes.every((item, i) => {
          return action.payload.attributes[i][keys[i]] === item[keys[i]];
        });
        if (isEaqual) {
          return true;
        }
        return false;
      };

      const ind = state.products.findIndex(
        (item) => item.id === action.payload.id && checkAttributes(item)
      );

      if (ind >= 0 && checkAttributes(state.products[ind])) {
        const productToReplace = { ...state.products[ind] };
        productToReplace.amount = state.products[ind].amount + action.payload.amount;
        const newProducts = state.products.filter((item, i) => i !== ind);
        const newState = {
          ...state,
          products: [...newProducts, productToReplace],
        };
        return newState;
      }
      return { ...state, products: [...state.products, action.payload] };
    },
    reduceAmount: (state, action: PayloadAction<IReduceAmountPayload>) => {
      const copiedState = [...state.products];
      if (action.payload.delete) {
        copiedState.splice(action.payload.ind, 1);
      } else {
        copiedState.splice(action.payload.ind, 1, action.payload.data);
      }
      return { ...state, products: copiedState };
    },
    changeCurrency: (state, action) => {
      state.currency = action.payload;
    },
    toggleCartOpen: (state) => {
      state.cartOpen = !state.cartOpen;
    },
  },
});

export const { addToCart, reduceAmount, changeCurrency, toggleCartOpen } = counterSlice.actions;

export default counterSlice.reducer;
