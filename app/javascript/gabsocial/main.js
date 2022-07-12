'use strict';

import * as registerPushNotifications from './actions/push_notifications';
import { default as GabSocial, store } from './containers/gabsocial';
import ReactDOM from 'react-dom';
import ready from './ready';

function main() {
  ready(() => {
    const mountNode = document.getElementById('gabsocial');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    ReactDOM.render(<GabSocial {...props} />, mountNode);
    if (process.env.NODE_ENV === 'production') {
      // Avoid offline in dev mode because it's harder to debug
      require('offline-plugin/runtime').install();
      store.dispatch(registerPushNotifications.register());
    }
  });
}

export default main;
