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
      // Option "onChangeJSON" is not applicable to modes "text" and "code".
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
    try {
      if (this.jsoneditor) {
        this.jsoneditor.destroy();
      }
    } catch(e) {
      // See: https://github.com/josdejong/jsoneditor/issues/855
    }
  }

  componentDidUpdate() {
    this.jsoneditor.update(this.props.json);
  }

  render() {
    return (
      <div id="fixed-response-editor" className="jsoneditor-react-container" ref={elem => this.container = elem} />
    );
  }
}
