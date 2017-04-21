import React from 'react'
import render from '../src'

describe('.hasClass()', () => {
  it('should find return if the item has the className', () => {
    const Foo = () => (
      <div>
        <button className="button disabled">foo</button>
        <button className="button disabled">bar</button>
      </div>
    )
    const wrapper = render(<Foo />)
    const buttons = wrapper.findByClass('button')
    expect(buttons.hasClass('disabled')).toBe(true)
  })
})
