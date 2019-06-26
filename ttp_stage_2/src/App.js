import React, { Component } from 'react';
import { Authenticator } from 'aws-amplify-react';
import Home from './Home';
import './App.css';

class App extends Component {
  state = {
    authState: '',
  };

  signUpConfig = {
    header: 'My Customized Sign Up',
    hideAllDefaults: true,
    defaultCountryCode: '1',
    signUpFields: [
      {
        label: 'Username',
        key: 'username',
        required: true,
        displayOrder: 1,
        type: 'string',
      },
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 2,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 3,
        type: 'password',
      },
    ],
  };

  render() {
    const { authState } = this.state;
    return (
      <div>
        <section>
          {authState !== 'signedIn' && (
            <div class="App-header">
              <div class="App-header-text"> Stock Portfolio </div>
            </div>
          )}
          <Authenticator signUpConfig={this.signUpConfig} onStateChange={authState => this.setState({ authState })}>
            {authState === 'signedIn' && <Home />}
          </Authenticator>
        </section>
      </div>
    );
  }
}

export default App;
