import React, { Component } from 'react';
import './style.scss';
import { ICartPage, ICartPageState, IProductResponse } from '../../interfaces';
import CartCard from '../../components/CartCard';
import { gql } from '@apollo/client';
import { RootState } from '../../redux/store';
import { addToCart } from '../../redux/stateSlices/cartSlice';
import { connect } from 'react-redux';

class CartPage extends Component<ICartPage, ICartPageState> {
  constructor(props: ICartPage) {
    super(props);

    this.state = {
      data: [],
      removed: false,
    };
  }

  fetchData() {
    const { client } = this.props;
    this.props.products.forEach((product) => {
      const GET_PRODUCT_ITEM = gql`
        {
          product(id: "${product.id}") {
            name
            id
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
                label
                symbol
              }
              amount
            }
            brand
          }
        }
      `;
      client
        .query({
          query: GET_PRODUCT_ITEM,
        })
        .then((res: IProductResponse) => {
          const toState = {
            ...res.data.product,
            choosenAttributes: product.attributes,
            amount: product.amount,
          };
          this.setState({ data: [...this.state.data, toState], removed: false });
        });
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: ICartPage, prevState: ICartPageState) {
    if (prevProps.products.length !== this.props.products.length) {
      this.setState({ data: [] });
    }
    if (this.state.data.length === 0) {
      this.fetchData();
    }
  }

  render() {
    return (
      <div className="cart">
        <p className="cart__heading">CART</p>
        <div className="cart__cards-block">
          {this.state.data.length ? (
            this.state.data.map((item, i) => (
              <CartCard
                data={item}
                key={i}
                indexInStore={i}
                whenRemove={() => this.setState({ removed: true })}
              />
            ))
          ) : (
            <p className="cart__cards_empty">{`You don't have any items in the bag!`}</p>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  products: state.cart.products,
});

const mapDispatchToProps = { addToCart };

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
