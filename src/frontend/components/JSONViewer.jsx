import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

export default class JSONViewer extends React.Component {
  componentDidMount () {
    const options = {
      mode: 'view',
      search: false,
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
      colorPicker: false
    };

    this.jsoneditor = new JSONEditor(this.container, options);
    this.jsoneditor.set(this.props.json);
    this.jsoneditor.expandAll();
  }

  componentWillUnmount () {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

  componentDidUpdate() {
    this.jsoneditor.update(this.props.json);
  }

  render() {
    return (
      <div className="jsoneditor-react-container" ref={elem => this.container = elem} />
    );
  }
}
