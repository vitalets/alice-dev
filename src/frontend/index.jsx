import * as Sentry from '@sentry/browser';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { store } from './store'
import App from './components/App';
import AppController from './controllers/App';

Sentry.init({dsn: 'https://ef09734ff94541ec9c3ba5b577fdee57@sentry.io/1810772'});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);

new AppController().run();
