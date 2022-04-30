import { gql } from '@apollo/client';
import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import ProductAttributes from '../../components/ProductAttributes';
import {
  IAPolloConsumer,
  IProductResponse,
  IProductPageState,
  IProductPageProps,
} from '../../interfaces';
import './style.scss';
import parse from 'html-react-parser';
import AmountBlock from '../../components/AmountBlock';
import { connect } from 'react-redux';
import { addToCart } from '../../redux/stateSlices/cartSlice';
import { RootState } from '../../redux/store';
import { GET_PRODUCT_ITEM } from '../../utils/constants/queries';

class ProductPage extends Component<IProductPageProps, IProductPageState> {
  constructor(props: IProductPageProps) {
    super(props);

    this.state = {
      data: {
        attributes: [],
        name: '',
        gallery: [],
        prices: [],
        brand: '',
        description: '',
        id: '',
        inStock: true,
      },
      choosenPic: 0,
      attributesData: [],
      amount: 1,
    };

    this.changeAttribute = this.changeAttribute.bind(this);
  }

  getProductID() {
    const { pathname } = window.location;
    const lastDevider = pathname.lastIndexOf('/');
    return pathname.slice(lastDevider + 1);
  }

  componentDidMount() {
    const { client } = this.props;
    const id = this.getProductID();
    client
      .query({
        query: GET_PRODUCT_ITEM(id),
      })
      .then((res: IProductResponse) => {
        const newAttributesData = res.data.product.attributes.map((item) => ({
          [item.name]: item.items[0].id,
        }));
        this.setState({ data: res.data.product, attributesData: newAttributesData });
      });
  }

  changeAttribute(key: string, value: string) {
    const keys = this.state.attributesData.map((item) => Object.keys(item)).flat(1);
    const index = keys.findIndex((item) => item === key);
    const newState = [...this.state.attributesData.map((item) => ({ ...item }))];
    newState[index][key] = value;
    this.setState({
      ...this.state,
      attributesData: newState,
    });
  }

  render() {
    const { data, choosenPic } = this.state;
    const currency = data.prices.find((item) => item.currency.symbol === this.props.currency);
    const description = parse(data.description);
    return (
      <div className="product">
        <div className="product__gallery">
          {data.gallery.map((img, i) => (
            <img
              src={img}
              key={i}
              alt={data.name}
              onClick={() => this.setState({ ...this.state, choosenPic: i })}
            />
          ))}
        </div>
        <div className="product__description">
          <div className="img-wrap">
            <img src={data.gallery[choosenPic]} alt={data.name} />
          </div>
          <div className="product__description_info">
            <div>
              <p className="product__description_brand">{data.brand}</p>
              <p className="product__description_name">{data.name}</p>
            </div>
            <ProductAttributes changeAttribute={this.changeAttribute} data={data.attributes} />
            <div className="product__description_price">
              <p className="product__description_price_name">PRICE:</p>
              <p className="product__description_price_price">
                <span>{currency?.currency.symbol}</span> {currency?.amount}
              </p>
            </div>
            <AmountBlock
              id={this.state.data.id}
              className={'product'}
              amount={this.state.amount}
              changeAmount={(amount) => this.setState({ ...this.state, amount })}
            />
            <button
              className="product__add-btn"
              onClick={() => {
                const dataToAdd = {
                  id: this.state.data.id,
                  amount: this.state.amount,
                  attributes: [...this.state.attributesData],
                };
                this.props.addToCart(dataToAdd);
                this.setState({ amount: 1 });
              }}
              disabled={!this.state.data.inStock}
            >
              ADD TO CARD
            </button>
            <div className="product__description_text">{description}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  products: state.cart.products,
  currency: state.cart.currency,
});

const mapDispatchToProps = { addToCart };

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
