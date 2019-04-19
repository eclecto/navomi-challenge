import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Form from '../Form';

class Login extends Component {
  constructor() {
    super();
    
    this.state = {
      user: '',
      password: '',
      message: '',
      success: false
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);    
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e, field) {
    this.setState({
      [field]: e.target.value
    });
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    let { user, password } = this.state;
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, password })
    });
    const json = await res.json();
    if(json.success) {
      this.setState({ message: 'Log in successful! Redirecting to app...' });
      setTimeout(() => this.setState({ success: true }), 1500);
    } else this.setState({ message: json.Error });
  }
  
  render() {
    return (
      <div>
        {this.state.success ? <Redirect to="/" push={true} /> : ''}
        <h2>Log In</h2>
        <Form handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
        <Link to="/signup">Sign Up</Link>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Login;