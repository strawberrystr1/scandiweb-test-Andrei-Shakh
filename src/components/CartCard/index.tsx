import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ICartCardProps, ICartCardState, ICartStorageItem } from '../../interfaces';
import { reduceAmount } from '../../redux/stateSlices/cartSlice';
import { RootState } from '../../redux/store';
import AmountBlock from '../AmountBlock';
import ProductAttributesItem from '../ProductAttributes/components/ProductAttributesItem';
import './style.scss';

class CartCard extends Component<ICartCardProps, ICartCardState> {
  constructor(props: ICartCardProps) {
    super(props);

    this.state = {
      amount: 1,
      attributes: [],
      remove: false,
    };

    this.changeAttribute = this.changeAttribute.bind(this);
  }

  componentDidMount() {
    this.setState({
      attributes: this.props.data.choosenAttributes,
      amount: this.props.data.amount,
    });
  }

  changeAttribute(key: string, value: string) {
    const keys = this.state.attributes.map((item) => Object.keys(item)).flat(1);
    const index = keys.findIndex((item) => item === key);
    const newState = [...this.state.attributes.map((item) => ({ ...item }))];
    newState[index][key] = value;
    this.setState({ ...this.state, attributes: newState });
  }

  componentDidUpdate(prevProps: ICartCardProps, prevState: ICartCardState) {
    if (prevState.remove === this.state.remove) return;
    const productToReplace: ICartStorageItem = {
      id: this.props.data.id,
      amount: this.state.amount,
      attributes: this.state.attributes,
    };
    if (this.state.remove === prevState.remove)
      this.props.reduceAmount({ data: productToReplace, ind: this.props.indexInStore });
    if (this.state.remove !== prevState.remove && this.state.remove) {
      this.props.reduceAmount({
        data: productToReplace,
        ind: this.props.indexInStore,
        delete: true,
      });
      this.setState({ remove: false });
    }
  }

  render() {
    const { data } = this.props;
    const currency = data.prices.find((item) => item.currency.symbol === this.props.currency);
    return (
      <div className={`cart__card ${this.props.className || ''}`}>
        <div className={`cart__card_info-block ${this.props.className || ''}`}>
          <div>
            <p className={`product__description_brand ${this.props.className || ''}`}>
              {data.brand}
            </p>
            <p className={`product__description_name ${this.props.className || ''}`}>{data.name}</p>
          </div>
          <div className={`product__description_price ${this.props.className || ''}`}>
            <p className={`product__description_price_name ${this.props.className || ''}`}>
              PRICE:
            </p>
            <p className={`product__description_price_price ${this.props.className || ''}`}>
              <span>{currency?.currency.symbol}</span>{' '}
              {(currency!.amount * this.state.amount).toFixed(2)}
            </p>
          </div>
        </div>
        <div className={`cart__card_attributes-block ${this.props.className || ''}`}>
          {data.attributes.map((item, i) => (
            <ProductAttributesItem
              key={item.id}
              data={item}
              changeAttribute={this.changeAttribute}
              choosenAttribute={data.choosenAttributes[i]}
              className={this.props.className}
            />
          ))}
        </div>
        <div className={`cart__card_amount-block ${this.props.className || ''}`}>
          <AmountBlock
            className={this.props.className ? this.props.className : 'cart'}
            amount={
              this.state.amount >= this.props.data.amount
                ? this.state.amount
                : this.props.data.amount
            }
            changeAmount={(amount, remove = false) => {
              this.setState({ amount, remove });
              this.props.changeTotal &&
                this.props.changeTotal(this.props.indexInStore, amount * currency!.amount);
            }}
          />
          <img src={data.gallery[0]} alt={data.name} />
          <button
            className={`cart__card_delete-btn ${this.props.className || ''}`}
            onClick={() => {
              this.setState({ remove: true });
              this.props.whenRemove();
            }}
          >
            &#10006;
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  currency: state.cart.currency,
});

const mapDispatchToProps = { reduceAmount };

export default connect(mapStateToProps, mapDispatchToProps)(CartCard);
