import React, { Component } from 'react';


class Form extends Component {  
  render() {
    return (
      <form className="auth-form" onSubmit={this.props.handleSubmit}>
        <label htmlFor="user">Username:</label>
        <input type="text" name="user" required onChange={e => this.props.handleChange(e, 'user')} />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          required
          pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
          onChange={e => this.props.handleChange(e, 'password')} />
        <button type="submit" name="submit">Submit</button>
      </form>
    );
  }
}

export default Form;