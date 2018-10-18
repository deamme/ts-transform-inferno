import { Component, render, ComponentType } from 'inferno'

interface TestProps<T> {
  Template: ComponentType<{ Data: T }>
  Data: T
}

class GenericPrinter<T> extends Component<TestProps<T>> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let content = <this.props.Template Data={this.props.Data} />
    return <div>{content}</div>
  }
}

function Test<T>(props: { Data: T }) {
  return <div>{props.Data.toString()}</div>
}

render(<GenericPrinter Template={Test} Data={'lol'} />, document.body)
