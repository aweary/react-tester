import React from 'react'
import renderers from '../__utils__/renderers'

console.log(renderers)

describe('.at()', () => {
  renderers.forEach(({ name, render }) => {
    describe(name, () => {
      it('should return the item at the provided index', () => {
        const wrapper = render(
          <ul>
            <li id="first">First</li>
            <li>Second</li>
            <li id="third">Third</li>
          </ul>
        )
        const items = wrapper.find('li')
        const first = items.at(0)
        const third = items.at(2)
        expect(first.props.id).toBe('first')
        expect(third.props.id).toBe('third')
      })
    })
  })
})
