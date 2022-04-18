import { gql } from '@apollo/client';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ICartPopupProps, ICartPageState, IProductResponse } from '../../interfaces';
import { toggleCartOpen } from '../../redux/stateSlices/cartSlice';
import { RootState } from '../../redux/store';
import CartCard from '../CartCard';
import './style.scss';

class CartPopup extends Component<ICartPopupProps, ICartPageState> {
  constructor(props: ICartPopupProps) {
    super(props);

    this.state = {
      data: [],
      prices: [],
      removed: false,
    };

    this.changeTotal = this.changeTotal.bind(this);
  }

  fetchData() {
    const { client } = this.props;
    this.props.products.forEach((product, i) => {
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
          const currency = res.data.product.prices.find(
            (item) => item.currency.symbol === this.props.currency
          );
          this.setState((prev) => ({
            data: [...this.state.data, toState],
            prices: [...prev.prices!, [i, product.amount * currency!.amount]],
          }));
        });
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  totalPrice() {
    return this.state
      .prices!.reduce((acc, item) => {
        return acc + item[1];
      }, 0)
      .toFixed(2);
  }

  changeTotal(ind: number, amount: number) {
    const copied = [...this.state.prices!];
    copied[ind][1] = amount;
    this.setState({ prices: copied });
  }

  componentDidUpdate(prevProps: ICartPopupProps, prevState: ICartPageState) {
    if (prevProps.products.length !== this.props.products.length) {
      this.setState({ data: [] });
    }
    if (this.state.data.length === 0) {
      this.fetchData();
    }
  }

  render() {
    return (
      <div className="cart-popup-wrap">
        {this.state.data.length ? (
          <>
            <div className="cart__cards-block">
              {this.state.data.map((item, i) => (
                <CartCard
                  data={item}
                  key={i}
                  indexInStore={i}
                  className={'cart-popup'}
                  changeTotal={this.changeTotal}
                  whenRemove={() => this.setState({ prices: [] })}
                />
              ))}
            </div>
            <div className="cart-popup_total-wrap">
              <p>Total: </p>
              <p className="cart-popup_total">{`${this.props.currency} ${this.totalPrice()}`}</p>
            </div>
            <div className="cart-popup__btns">
              <Link
                onClick={() => this.props.toggleCartOpen()}
                to="/cart"
                className="cart-popup__btns_btn view"
              >
                view bag
              </Link>
              <button className="cart-popup__btns_btn check-out">check out</button>
            </div>
          </>
        ) : (
          <p className="cart-popup__empty">{`You don't have any items in the bag!`}</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  products: state.cart.products,
  currency: state.cart.currency,
});

const mapDispatchToProps = { toggleCartOpen };

export default connect(mapStateToProps, mapDispatchToProps)(CartPopup);
