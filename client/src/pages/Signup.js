import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Form from '../Form';

class Signup extends Component {
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
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, password })
    });
    const json = await res.json();
    if(json.success) {
      this.setState({ message: 'Sign up successful! Redirecting to login page...' });
      setTimeout(() => this.setState({ success: true }), 1500);
    } else this.setState({ message: json.Error });
  }
  
  render() {
    return (
      <div className="form-container">
        {this.state.success ? <Redirect to="/login" push={true} />: ''}
        <h2>Sign Up</h2>
        <Form handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
        <p>Password must have a minimum 8 characters and have numbers and uppercase and lowercase letters.</p>
        <Link to="/login">Log In</Link>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Signup;