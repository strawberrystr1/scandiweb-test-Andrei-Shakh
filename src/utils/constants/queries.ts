import { gql } from '@apollo/client';
import { ICartStorageItem } from '../../interfaces';

export const GET_PRODUCT_ITEM = (id: string) => {
  return gql`
        {
          product(id: "${id}") {
            name
            gallery
            description
            id
            inStock
            attributes {
              name
              type
              id
              items {
                displayValue
                value
                id
              }
            }
            prices {
              currency {
                label
                symbol
              }
              amount
            }
            brand
          }
        }
      `;
};

export const GET_CATEGORIES_AND_CURRENCIES = gql`
  {
    currencies {
      label
      symbol
    }
    categories {
      name
    }
  }
`;

export const GET_ITEMS = (category: string) =>
  gql`
query {
  category(input: { title: "${category}" }) {
    products {
      id
      name
      inStock
      brand
      gallery
      attributes {
        name
        type
        id
        items {
          displayValue
          value
          id
        }
      }
      prices {
        currency {
          symbol
        }
        amount
      }
    }
  }
}
`;
