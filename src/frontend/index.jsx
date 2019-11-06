import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { store } from './store'
import App from './components/App';
import AppController from './controllers/App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);

new AppController().run();
