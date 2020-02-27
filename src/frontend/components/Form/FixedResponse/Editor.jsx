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
    const json = this.tryGetCurrentJson();
    if (json) {
      this.props.onChange(json);
    }
  }

  componentWillUnmount() {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

  shouldComponentUpdate(nextProps) {
    // не обновляем контент в редакторе, если изменение прилетело от себя же,
    // т.к. это приводит к ошибкам: https://github.com/josdejong/jsoneditor/issues/913
    return JSON.stringify(nextProps.json) !== JSON.stringify(this.tryGetCurrentJson());
  }

  componentDidUpdate() {
    this.jsoneditor.update(this.props.json);
  }

  render() {
    return (
      <div id="fixed-response-editor" style={{height: 300}} className="jsoneditor-react-container" ref={elem => this.container = elem} />
    );
  }

  tryGetCurrentJson() {
    try {
      return this.jsoneditor.get();
    } catch (e) {
      // invalid json
    }
  }
}
