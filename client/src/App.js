import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Switch>
            <Route exact path='/' component={Main}></Route>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/signup' component={Signup}/>
          </Switch>
        </header>
      </div>
    );
  }
}

export default App;
