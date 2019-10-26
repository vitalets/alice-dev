import ReactDOM from 'react-dom';
import App from './components/App';
import AppController from './controllers/App';

ReactDOM.render(<App />, document.querySelector('#app'));
new AppController();
