import React from 'react'
import render from '../src'

describe('.findByProps()', () => {
  it('should find nodes by props', () => {
    const wrapper = render(
      <div>
        <ul>
          <li className='item'>Item</li>
          <li className='item'>Item</li>
        </ul>
      </div>
    );
    expect(wrapper.findByProps({
      className: 'item'
    }).length).toBe(2);
  });
  it('should consider excluded props', () => {
    const wrapper = render(
      <div>
        <ul>
          <li className='item'>Item</li>
          <li className='item' hidden>Item</li>
          <li className='item'>Item</li>
          <li className='item' hidden>Item</li>
        </ul>
      </div>
    );
    expect(wrapper.findByProps({
      className: 'item',
      hidden: undefined
    }).length).toBe(2);
  });
})
