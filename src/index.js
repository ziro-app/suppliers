import React from 'react'
import { render } from 'react-dom'
import { FirebaseAppProvider } from 'reactfire';
import { load as FontLoader } from 'webfontloader'
import { configFirebase } from './Firebase/index'
import { App } from './App/index'
import './index.css'

FontLoader({
    google: { families: ['Rubik:500,600', 'Work Sans:300,400,500'] }
})

render(<FirebaseAppProvider firebaseConfig={configFirebase}>
    <App />
</FirebaseAppProvider>, document.getElementById('app'));
