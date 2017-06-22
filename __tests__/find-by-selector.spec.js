import React from 'react'
import renderers from '../__utils__/renderers'

describe('.findBySelector()', () => {
  renderers.forEach(({ name, render }) => {
    describe(name, () => {
      it('should find nodes by a CSS selector', () => {
        const wrapper = render(
          <div id="container">
            <ul className="nav">
              <li className="nav__item active">
                <a data-active={true}>Home</a>
              </li>
              <li className="nav__item active">
                <a>About</a>
              </li>
              <li disabled className="nav__item">
                <a id="sign_in_link">Sign In</a>
              </li>
            </ul>
          </div>
        )
        const items = wrapper.findBySelector('ul:not(.foo) a')
        expect(items.length).toBe(3)
      })
    })
  })
})
