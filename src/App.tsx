import { ApolloConsumer } from '@apollo/client';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.scss';
import Header from './components/layouts/Header';
import CartPage from './pages/cart_page';
import Main from './pages/main_page';
import ProductPage from './pages/product_page';

export default class App extends React.Component {
  render() {
    return (
      <div className="content-wrapper">
        <ApolloConsumer>{(client) => <Header client={client} />}</ApolloConsumer>
        <Routes>
          <Route path="/" element={<Navigate to="all" />} />
          <Route
            path="/item/:id"
            element={<ApolloConsumer>{(client) => <ProductPage client={client} />}</ApolloConsumer>}
          />
          <Route
            path="/all"
            element={
              <ApolloConsumer>{(client) => <Main category="all" client={client} />}</ApolloConsumer>
            }
          />
          <Route
            path="/cart"
            element={<ApolloConsumer>{(client) => <CartPage client={client} />}</ApolloConsumer>}
          />
          <Route
            path="/clothes"
            element={
              <ApolloConsumer>
                {(client) => <Main category="clothes" client={client} />}
              </ApolloConsumer>
            }
          />
          <Route
            path="/tech"
            element={
              <ApolloConsumer>
                {(client) => <Main category="tech" client={client} />}
              </ApolloConsumer>
            }
          />
        </Routes>
      </div>
    );
  }
}
