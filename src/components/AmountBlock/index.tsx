import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IAmountProps } from '../../interfaces';
import { changeStoreAmount, reduceAmount } from '../../redux/stateSlices/cartSlice';
import { RootState } from '../../redux/store';
import './style.scss';

class AmountBlock extends Component<IAmountProps, { amount: number }> {
  constructor(props: IAmountProps) {
    super(props);

    this.state = {
      amount: 1,
    };
  }

  componentDidMount() {
    this.setState({ amount: this.props.amount });
  }

  changeAmount(sign: string) {
    const curAmount = this.state.amount;
    if (sign === '+') {
      if (this.state.amount + 1 < 20) {
        this.setState((prev) => ({ amount: prev.amount + 1 }));
        this.props.changeAmount(curAmount + 1);
        this.props.changeStoreAmount({ id: this.props.id, sign: '+' });
      }
    } else {
      if (this.state.amount - 1 > 0) {
        this.setState((prev) => ({ amount: prev.amount - 1 }));
        this.props.changeAmount(curAmount - 1);
        this.props.changeStoreAmount({ id: this.props.id, sign: '-' });
      }
    }
  }

  render() {
    return (
      <div className={`product__description_amount ${this.props.className}`}>
        <button className="cart__card_btn minus" onClick={() => this.changeAmount('-')}>
          -
        </button>
        <span className="cart__card_amount">{this.state.amount}</span>
        <button className="cart__card_btn plus" onClick={() => this.changeAmount('+')}>
          +
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  products: state.cart.products,
});

const mapDispatchToProps = { reduceAmount, changeStoreAmount };

export default connect(mapStateToProps, mapDispatchToProps)(AmountBlock);
