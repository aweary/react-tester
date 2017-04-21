import React from 'react'
import render from '../src'

describe('updates', () => {
  it('should update props', () => {
    const componentWillReceiveProps = jest.fn()
    class Foo extends React.Component {
      constructor() {
        super()
        this.state = { render: false }
      }

      componentWillReceiveProps(nextProps) {
        this.setState({ render: true })
        componentWillReceiveProps();
      }

      render() {
        return (
          <div>
            {this.state.render && <h1>foo</h1>}
          </div>
        )
      }
    }
    const wrapper = render(<Foo foo="bar" />)
    let foo = wrapper.find(Foo).at(0)
    expect(foo.props.foo).toBe('bar')
    expect(wrapper.find('h1').length).toBe(0);
    wrapper.update({ foo: 'foo' })
    expect(componentWillReceiveProps).toHaveBeenCalledTimes(1);
    foo = wrapper.find(Foo).at(0)
    expect(foo.props.foo).toBe('foo')
    expect(wrapper.find('h1').length).toBe(1);
  })
})
