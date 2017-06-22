import React from 'react'
import renderTest from '../src'
import renderDom from '../src/dom'

const renderers = [
  { name: 'TestRenderer', render: renderTest },
  { name: 'DomRenderer', render: renderDom },
]

describe('.find()', () => {
  renderers.forEach(({ name, render }) => {
    describe(name, () => {
      it('should find a single host node', () => {
        class Foo extends React.Component {
          constructor() {
            super()
            this.state = {
              render: true,
            }
          }

          render() {
            return (
              <div>
                {this.state.render && <h1>Foo</h1>}
                <h2>bar</h2>
              </div>
            )
          }
        }
        const wrapper = render(<Foo />)
        expect(wrapper.find('h1').length).toBe(1)
      })

      it('should find multiple host nodes', () => {
        class Foo extends React.Component {
          render() {
            return (
              <div>
                <span>foo</span>
                <span>bar</span>
                {false && <span>this shouldnt render</span>}
                <div>
                  <main>
                    span
                    <div>
                      <span>baz</span>
                    </div>
                    span
                  </main>
                </div>
              </div>
            )
          }
        }
        const wrapper = render(<Foo />)
        expect(wrapper.find('span').length).toBe(3)
      })

      it('should find a single composite node', () => {
        const Foo = () => <div>foo</div>
        const App = () => (
          <div>
            <span id="foo">foo</span>
            <div className="foo">
              <Foo />
            </div>
          </div>
        )
        const wrapper = render(<App />)
        expect(wrapper.find(Foo).length).toBe(1)
        expect(wrapper.find('Foo').length).toBe(1)
      })

      it('should find multiple composite nodes', () => {
        const Foo = () => <div>foo</div>
        const App = () => (
          <div>
            <Foo />
            <span id="foo">foo</span>
            <Foo />
            <div className="foo">
              <Foo />
              <Foo />
            </div>
          </div>
        )
        const wrapper = render(<App />)
        expect(wrapper.find(Foo).length).toBe(4)
        expect(wrapper.find('Foo').length).toBe(4)
      })

      it('should let you chain find() calls', () => {
        const Foo = () => (
          <div>
            <ol>
              <li>foo</li>
            </ol>
            <ul>
              <li>bar</li>
              <li>baz</li>
            </ul>
          </div>
        )
        const wrapper = render(<Foo />)
        const unordered = wrapper.find('ul').find('li')
        const ordered = wrapper.find('ol').find('li')
        const nonexistant = wrapper.find('ol').find('h1').find('l1')
        expect(unordered.length).toBe(2)
        expect(ordered.length).toBe(1)
        expect(nonexistant.length).toBe(0)
      })
    })
  })
})
