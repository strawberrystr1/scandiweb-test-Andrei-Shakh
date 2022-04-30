import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../../assets/icons/a-logo.png';
import './style.scss';
import { ICategoriesCurrenciesResponse, IHeaderProps, IHeaderState } from '../../../interfaces';
import { useQuery, gql } from '@apollo/client';
import CartPopup from '../../CartPopup';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { changeCurrency, toggleCartOpen } from '../../../redux/stateSlices/cartSlice';
import ReactDOM from 'react-dom';
import { GET_CATEGORIES_AND_CURRENCIES } from '../../../utils/constants/queries';

class Header extends Component<IHeaderProps, IHeaderState> {
  constructor(props: IHeaderProps) {
    super(props);

    this.state = {
      links: [],
      currencies: [],
      currencyOpen: false,
    };

    this.changeCurrency = this.changeCurrency.bind(this);
    this.closeCart = this.closeCart.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;
    client
      .query({
        query: GET_CATEGORIES_AND_CURRENCIES,
      })
      .then((res: ICategoriesCurrenciesResponse) => {
        const links = res.data.categories.map((item) => item.name);
        this.setState({ links, currencies: res.data.currencies });
      });
  }

  changeCurrency(e: React.MouseEvent<HTMLElement>) {
    this.props.changeCurrency((e.target as HTMLElement).dataset.value!);
    this.setState({ currencyOpen: false });
  }

  closeCart(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('cart-popup-wrap__overlay')) this.props.toggleCartOpen(false);
  }

  render() {
    return (
      <header className="header">
        <nav className="header__nav">
          {this.state.links.map((link, i) => (
            <NavLink className="header__nav_link" to={link} key={i}>
              {link}
            </NavLink>
          ))}
        </nav>
        <Link to="/cart">
          <img src={logo} alt="logo" />
        </Link>
        <div className="header__action">
          <button
            onClick={() => {
              this.setState((prev) => ({ currencyOpen: !prev.currencyOpen }));
              this.props.toggleCartOpen(false);
            }}
            className={`select-button ${this.state.currencyOpen ? 'open' : 'close'}`}
          >{`${this.props.currency}`}</button>
          {this.state.currencyOpen && (
            <ul className="custom-select">
              {this.state.currencies.map((item, i) => (
                <li key={i} data-value={item.symbol} onClick={this.changeCurrency}>
                  {`${item.symbol} ${item.label}`}
                </li>
              ))}
            </ul>
          )}
          <div className="header__cart">
            <button
              className="header__cart_button"
              onClick={() => {
                this.props.toggleCartOpen(!this.props.cartOpen);
                this.setState((prev) => ({ currencyOpen: false }));
              }}
            ></button>
            {this.props.count! > 0 && (
              <span className="header__cart_badge">{this.props.count}</span>
            )}
          </div>
        </div>

        {this.props.cartOpen &&
          ReactDOM.createPortal(
            <div className="cart-popup-wrap__overlay" onClick={this.closeCart}>
              <CartPopup client={this.props.client} />
            </div>,
            document.getElementById('root')!
          )}
      </header>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  count: state.cart.products.length,
  currency: state.cart.currency,
  cartOpen: state.cart.cartOpen,
});

const mapDispatchToProps = { changeCurrency, toggleCartOpen };

export default connect(mapStateToProps, mapDispatchToProps)(Header);
