import { ApolloClient } from '@apollo/client';
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from '@reduxjs/toolkit';

type CategoryName = {
  name: string;
};

export interface ICategoriesCurrenciesResponse {
  data: {
    categories: CategoryName[];
    currencies: IProductCurrency[];
  };
}

export interface ISIngleCategoryResponse {
  data: {
    category: {
      products: Pick<
        IProduct,
        'id' | 'name' | 'gallery' | 'prices' | 'brand' | 'attributes' | 'inStock'
      >[];
    };
  };
}

export interface IProductResponse {
  data: {
    product: Pick<
      IProduct,
      | 'attributes'
      | 'name'
      | 'gallery'
      | 'prices'
      | 'brand'
      | 'description'
      | 'id'
      | 'prices'
      | 'inStock'
    >;
  };
}

export interface IProductCurrency {
  label: string;
  symbol: string;
}

export interface IHeaderState {
  links: string[];
  currencies: IProductCurrency[];
  currencyOpen: boolean;
}

export interface IAPolloConsumer {
  client: ApolloClient<object>;
}

export interface ICartPage extends IAPolloConsumer {
  products: ICartStorageItem[];
}

export interface IProductPageProps extends IAPolloConsumer {
  addToCart: ActionCreatorWithPayload<any, string>;
  products: ICartStorageItem[];
  currency: string;
}

export interface IMainProps extends IAPolloConsumer {
  category: string;
  addToCart: ActionCreatorWithPayload<any, string>;
  cartOpen: boolean;
  toggleCartOpen: ActionCreatorWithPayload<boolean, string>;
  products: ICartStorageItem[];
}

export interface IProductAttribute {
  displayValue: string;
  value: string;
  id: string;
}

export interface IProductAttributeSet {
  id: string;
  name: string;
  type: string;
  items: IProductAttribute[];
}

export interface IProductPrice {
  currency: IProductCurrency;
  amount: number;
}

export interface IProduct {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  attributes: IProductAttributeSet[];
  prices: IProductPrice[];
  brand: string;
}

export type IProductDescription = Pick<
  IProduct,
  'attributes' | 'name' | 'gallery' | 'prices' | 'brand' | 'description' | 'id' | 'inStock'
>;

export interface IProductPageState {
  data: IProductDescription;
  choosenPic: number;
  attributesData: {
    [x: string]: string;
  }[];
  amount: number;
}

interface ICartProduct {
  id: string;
  name: string;
  gallery: string[];
  attributes: IProductAttributeSet[];
  prices: IProductPrice[];
  brand: string;
  choosenAttributes: {
    [x: string]: string;
  }[];
  amount: number;
}

export interface ICartPageState {
  data: ICartProduct[];
  prices?: [number, number][];
  removed: boolean;
}

export interface ICartCardProps {
  data: ICartProduct;
  currency: string;
  reduceAmount: ActionCreatorWithPayload<any, string>;
  indexInStore: number;
  className?: string;
  changeTotal?: (ind: number, amount: number) => void;
  whenRemove: () => void;
}

export interface IMainState {
  data: Pick<IProduct, 'id' | 'name' | 'gallery' | 'prices' | 'brand' | 'attributes' | 'inStock'>[];
  isOpenModal: boolean;
  itemId: number;
  attributes: {
    [x: string]: string;
  }[];
  amount: number;
}

export interface ICardData {
  data: Pick<IProduct, 'id' | 'name' | 'gallery' | 'prices' | 'brand' | 'attributes' | 'inStock'>;
  openModal: (value: string) => void;
  currency: string;
}

export interface IHeaderProps extends IAPolloConsumer {
  increment?: ActionCreatorWithoutPayload<string>;
  decrement?: ActionCreatorWithoutPayload<string>;
  count?: number;
  currency: string;
  changeCurrency: ActionCreatorWithPayload<string, string>;
  toggleCartOpen: ActionCreatorWithPayload<boolean, string>;
  cartOpen: boolean;
}

export interface IProductAttributesProps {
  data: IProductAttributeSet[];
  changeAttribute: (key: string, value: string) => void;
}

export interface IProductAttributesItemState {
  activeIndex: number;
}

export interface IProductAttributesItemProps {
  data: IProductAttributeSet;
  changeAttribute: (key: string, value: string) => void;
  choosenAttribute?: { [x: string]: string };
  className?: string;
  disabled?: boolean;
}

export interface ICartStorageItem {
  id: string;
  amount: number;
  attributes: { [x: string]: string }[];
}

export interface IStorageState {
  products: ICartStorageItem[];
  currency: string;
  cartOpen: boolean;
}

export interface IAmountProps {
  id: string;
  className: string;
  changeAmount: (amount: number, remove?: boolean) => void;
  changeStoreAmount: ActionCreatorWithPayload<IAmountPayload, string>;
  amount: number;
}

export interface ICartCardState {
  amount: number;
  attributes: {
    [x: string]: string;
  }[];
  remove: boolean;
  imageNumber: number;
}

export interface IReduceAmountPayload {
  data: ICartStorageItem;
  ind: number;
  delete?: boolean;
}

export interface IAmountPayload {
  id: string;
  sign: string;
}

export interface ICartPopupProps {
  products: ICartStorageItem[];
  client: ApolloClient<object>;
  currency: string;
  toggleCartOpen: ActionCreatorWithPayload<boolean, string>;
}
