import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ICardData } from '../../interfaces';
import { RootState } from '../../redux/store';
import './style.scss';

class ItemCard extends Component<ICardData> {
  render() {
    const { data } = this.props;
    const className = `main__cards_card ${data.inStock ? '' : 'out-of-stock'}`;
    const priceForCard = data.prices.find((item) => item.currency.symbol === this.props.currency);

    const innerCard = (
      <>
        <img src={data.gallery[0]} alt={data.id} />
        <div className="main__cards_card_wrapper">
          <p className="main__cards_card_name">{`${data.brand} ${data.name}`}</p>
          <p className="main__cards_card_price">
            <span>{priceForCard?.currency.symbol}</span> {priceForCard?.amount}
          </p>
        </div>
      </>
    );

    return (
      <div className={className}>
        {!data.inStock && <p className="main__cards_card-out">OUT OF STOCK</p>}
        {!data.inStock ? <div>{innerCard}</div> : <Link to={`/item/${data.id}`}>{innerCard}</Link>}
        <button
          className="main__cards_card_cart-btn"
          onClick={() => this.props.openModal(data.id)}
        ></button>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  currency: state.cart.currency,
});

export default connect(mapStateToProps)(ItemCard);
