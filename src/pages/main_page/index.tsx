import React, { Component } from 'react';
import './style.scss';
import { gql } from '@apollo/client';
import { IMainProps, IMainState, ISIngleCategoryResponse } from '../../interfaces';
import ItemCard from '../../components/ItemCard';
import ProductAttributesItem from '../../components/ProductAttributes/components/ProductAttributesItem';
import AmountBlock from '../../components/AmountBlock';
import { connect } from 'react-redux';
import { addToCart, toggleCartOpen } from '../../redux/stateSlices/cartSlice';
import { RootState } from '../../redux/store';
import CartPopup from '../../components/CartPopup';

class Main extends Component<IMainProps, IMainState> {
  constructor(props: IMainProps) {
    super(props);

    this.state = {
      data: [],
      isOpenModal: false,
      amount: 1,
      itemId: -1,
      attributes: [],
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeAttribute = this.changeAttribute.bind(this);
  }

  fetchData() {
    const { client, category } = this.props;
    const GET_ITEMS = gql`
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
    client
      .query({
        query: GET_ITEMS,
      })
      .then((res: ISIngleCategoryResponse) => {
        this.setState({ data: res.data.category.products });
      });
  }

  componentDidUpdate(prevProps: IMainProps, prevState: IMainState) {
    if (this.props.category !== prevProps.category) this.fetchData();
    if (this.state.itemId !== prevState.itemId) {
      const item = this.state.data[this.state.itemId];
      const newAttributesData = item.attributes.map((item) => ({
        [item.name]: item.items[0].id,
      }));
      this.setState({ ...this.state, attributes: newAttributesData });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  openModal(value: string) {
    const index = this.state.data.findIndex((item) => item.id === value);
    this.setState({ ...this.state, isOpenModal: true, itemId: index });
  }

  closeModal(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      target.classList.contains('add-btn') ||
      target.classList.contains('main__overlay') ||
      target.classList.contains('close')
    )
      this.setState({ ...this.state, isOpenModal: false, amount: 1 });
  }

  changeAttribute(key: string, value: string) {
    const keys = this.state.attributes.map((item) => Object.keys(item)).flat(1);
    const index = keys.findIndex((item) => item === key);
    const newState = [...this.state.attributes.map((item) => ({ ...item }))];
    newState[index][key] = value;
    this.setState({ ...this.state, attributes: newState });
  }

  render() {
    return (
      <main className="main">
        <p className="main__heading">{`${this.props.category[0].toUpperCase()}${this.props.category.slice(
          1
        )} products`}</p>
        <div className="main__cards">
          {this.state.data.map((item) => (
            <ItemCard data={item} key={item.id} openModal={(value) => this.openModal(value)} />
          ))}
          {this.state.isOpenModal && (
            <div className="main__overlay" onClick={this.closeModal}>
              <div className="main__popup">
                <div className="main__popup_wrap">
                  <p className="main__popup_heading">Choose attributes:</p>
                  <button className="main__popup_close close" onClick={this.closeModal}>
                    &#10006;
                  </button>
                </div>
                <div className="main__popup_wrap">
                  {this.state.data[this.state.itemId].attributes.map((elem) => (
                    <ProductAttributesItem
                      key={elem.id}
                      data={elem}
                      changeAttribute={this.changeAttribute}
                    />
                  ))}
                </div>
                <AmountBlock
                  className={'popup'}
                  changeAmount={(amount) => this.setState({ ...this.state, amount })}
                  amount={this.state.amount}
                />
                <button
                  className="product__add-btn popup add-btn"
                  onClick={(e) => {
                    this.closeModal(e);
                    const dataToAdd = {
                      id: this.state.data[this.state.itemId].id,
                      amount: this.state.amount,
                      attributes: [...this.state.attributes],
                    };
                    this.props.addToCart(dataToAdd);
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  products: state.cart.products,
  cartOpen: state.cart.cartOpen,
});

const mapDispatchToProps = { addToCart, toggleCartOpen };

export default connect(mapStateToProps, mapDispatchToProps)(Main);
