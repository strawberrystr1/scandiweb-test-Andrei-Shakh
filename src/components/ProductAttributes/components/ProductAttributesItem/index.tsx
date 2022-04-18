import React, { Component } from 'react';
import { IProductAttributesItemProps, IProductAttributesItemState } from '../../../../interfaces';

export default class ProductAttributesItem extends Component<
  IProductAttributesItemProps,
  IProductAttributesItemState
> {
  constructor(props: IProductAttributesItemProps) {
    super(props);

    this.state = {
      activeIndex: 0,
    };
  }

  changeState(key: string, value: string, index: number) {
    this.setState({ activeIndex: index });
    this.props.changeAttribute(key, value);
  }

  componentDidMount() {
    const ind = this.props.data.items.findIndex(
      (item) => item.value === this.props.choosenAttribute?.[this.props.data.name]
    );
    this.setState({ activeIndex: ind < 0 ? 0 : ind });
  }

  render() {
    const { type, items, name } = this.props.data;
    return (
      <div className={`product__attributes_block ${this.props.className || ''}`}>
        <p className={`product__attributes_name ${this.props.className || ''}`}>{name}:</p>
        {type !== 'swatch' ? (
          <div className="product__attributes_wrapper">
            {items.map((elem, i) => (
              <div
                className={`product__attributes_item ${
                  i === this.state.activeIndex ? 'active' : ''
                } ${this.props.className || ''}`}
                key={i}
                onClick={() => this.changeState(name, elem.value, i)}
              >
                {elem.value}
              </div>
            ))}
          </div>
        ) : (
          <div className="product__attributes_wrapper">
            {items.map((elem, i) => (
              <div
                className={`product__attributes_item ${
                  i === this.state.activeIndex ? 'active' : ''
                } ${this.props.className || ''}`}
                key={i}
                onClick={() => this.changeState(name, elem.value, i)}
                style={{
                  background: elem.value,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
