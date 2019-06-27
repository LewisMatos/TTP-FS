import React, { Component } from 'react';
import { Authenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createUser } from './graphql/mutations';
import { getUser } from './graphql/queries';
import Home from './pages/home/Home';
import './App.css';

class App extends Component {
  state = {
    authState: '',
    data: {},
  };

  handleStateChange = (authState,data) => {
    this.setState({ authState, data });
      if (authState === 'signedIn') {
        this.checkIfUserExists();
      }
  };

  checkIfUserExists = async () => {
    const { sub } = this.state.data.attributes;
    const input = { id: sub };
    try {
      const response = await API.graphql(graphqlOperation(getUser, input));
      const exists = response.data.getUser;
      if (!exists) {
        this.createUser();
      } else {
        // console.log('me:', response);
      }
    } catch (err) {
      console.log('error fetching user: ', err);
    }
  };

  createUser = async () => {
    const { attributes, username } = this.state.data;
    const input = {
      id: attributes.sub,
      name: username,
      cash: 5000,
    };
    try {
      await API.graphql(graphqlOperation(createUser, { input }));
    } catch (err) {
      console.log('Error creating user! :', err);
    }
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
            <div className="App-header">
              <div className="App-header-text"> Stock Portfolio </div>
            </div>
          )}
          <Authenticator signUpConfig={this.signUpConfig} onStateChange={this.handleStateChange} />
          {authState === 'signedIn' && <Home />}
        </section>
      </div>
    );
  }
}

export default App;
