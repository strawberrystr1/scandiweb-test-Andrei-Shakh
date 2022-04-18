import React, { Component } from 'react';
import { IProductAttributesProps } from '../../interfaces';
import ProductAttributesItem from './components/ProductAttributesItem';
import './style.scss';

export default class ProductAttributes extends Component<IProductAttributesProps> {
  render() {
    const { data } = this.props;

    return (
      <div className="product__attributes">
        {data.map((item) => (
          <ProductAttributesItem
            key={item.id}
            data={item}
            changeAttribute={this.props.changeAttribute}
          />
        ))}
      </div>
    );
  }
}
