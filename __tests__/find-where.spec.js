import renderTest from '../src'
import renderers from '../__utils__/renderers'
import React from 'react'

describe('.findWhere()', () => {
  renderers.forEach(({ name, render }) => {
    describe(name, () => {
      it('should find based on the predicate', () => {
        class Foo extends React.Component {
          render() {
            return (
              <div>
                <span className="item">foo</span>
                <span className="item">bar</span>
                <span className="item">baz</span>
                <span>qux</span>
              </div>
            )
          }
        }
        const isItem = (type, { className }) => {
          return type === 'span' && className === 'item'
        }
        const wrapper = render(<Foo />)
        const items = wrapper.findWhere(isItem)
        expect(items.length).toBe(3)
      })

      it('should work with composites', () => {
        const Foo = () => <span>foo</span>
        const Bar = () => <span>bar</span>
        const App = () => (
          <div>
            <Foo baz={false} />
            <Foo baz={true} />
            <Foo baz={false} />
            <Bar baz={false} />
            <Bar baz={true} />
            <Bar baz={false} />
            <Bar baz={false} />
          </div>
        )
        const wrapper = render(<App />)
        // Finds all Foo
        const fooPredicate = type => type === Foo
        // Finds all Bar
        const barPredicate = type => type === Bar
        // Finds all Foo or Bar where props.baz is true
        const bazPredicate = (type, props) => {
          return (type === Foo || type === Bar) && props.baz === true
        }
        expect(wrapper.findWhere(fooPredicate).length).toBe(3)
        expect(wrapper.findWhere(barPredicate).length).toBe(4)
        expect(wrapper.findWhere(bazPredicate).length).toBe(2)
      })
    })
  })
})
