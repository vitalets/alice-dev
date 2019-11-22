import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

export default class Editor extends React.Component {
  componentDidMount () {
    const options = {
      mode: 'code',
      search: false,
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
      colorPicker: false,
      onChange: () => this.handleChange(),
    };

    this.jsoneditor = new JSONEditor(this.container, options);
    this.jsoneditor.set(this.props.json);
    this.jsoneditor.focus();
  }

  handleChange() {
    let json;
    try {
      json = this.jsoneditor.get();
    } catch (e) {
      // invalid json
    }
    if (json) {
      this.props.onChange(json);
    }
  }

  componentWillUnmount() {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

  componentDidUpdate() {
    // do nothing in didUpdate
  }

  render() {
    return (
      <div id="fixed-response-editor" className="jsoneditor-react-container" ref={elem => this.container = elem} />
    );
  }
}
