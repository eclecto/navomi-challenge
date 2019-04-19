import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Editable from 'react-contenteditable';

const columns = [ 'title', 'release', 'director', 'rating' ];

// Parse unix timestamp date into string
const parseDate = (timestamp) => new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

// Parse date into unix timestamp for saving.
const format = (movie) => {
  movie.release = new Date(movie.release).valueOf(); // Convert release to Unix timestamp
  movie.rating = Number(movie.rating).toFixed(1); // Round rating if needed
}

const validate = (movie) => {
  let errors = [];
  if(!movie.title.length) errors.push('Title can not be blank.');
  
  let { release } = movie;
  if(!isNaN(Number(release))) release = Number(release); // In case of UNIX timestamp
  console.log(release, typeof(release));
  if(new Date(release).toString() === 'Invalid Date') errors.push('Release date is missing or invalid');
  
  if(!movie.director.length) errors.push('Director can not be blank');
  
  let numRating = Number(movie.rating);
  console.log(numRating);
  if(isNaN(numRating)) errors.push('Invalid rating.');
  if(numRating < 1 || numRating > 5) errors.push('Rating must be between 1 and 5');
  return errors;
}

// Row with editable td's
class EditableRow extends Component {
  render() {
    const { movie } = this.props;
    return (
      <tr className={this.props.unsaved ? 'unsaved' : ''}>
        {columns.map((column, i) => {
          let rawValue = movie[column];
          let value;
          if(rawValue) {
            switch(column) {
              case 'release':
                value = (movie.unsavedChanges && !(/(-)?[0-9]{12,13}/).test(rawValue)) ? rawValue : parseDate(rawValue);
                break;
              case 'rating':
                value = String(rawValue);
                break;
              default:
                value = rawValue;
            }
          } else value = '';
          return (
            <Editable
              html={value}
              onChange={e => this.props.handleChange(e, this.props.row, column)}
              tagName="td"
              key={i}
            />
          );
        })}
        <td>
          <button onClick={
              () => {
                if(this.props.newRow) {
                  this.props.handleAdd(this.props.row);
                } else this.props.handleSave(this.props.row);
              }
            }>
            <span role="img" aria-label="Save Row" title="Save Row">&#128190;</span>
          </button>
          {this.props.newRow ? '' :
            <button onClick={() => this.props.handleDelete(this.props.row)}>
              <span role="img" aria-label="Delete Row" title="Delete Row">&#10060;</span>
            </button>}</td>
      </tr>
    );
  }
}

class Movielist extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      savedMovieData: {},
      tempMovieData: {},
      stagedChanges: {},
      message: '',
      loginRedirect: false
    }
    
    this.populateMovieData = this.populateMovieData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    
    this.get = this.get.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    
    this.logout = this.logout.bind(this);
    
    // Initially populate table
    this.get();
  }
  
  // When getting initial database contents or syncing after a save
  populateMovieData(data) {
    const savedMovieData = data.movies;
    const tempMovieData = JSON.parse(JSON.stringify(savedMovieData)); // Quick deep clone
    for(let i in tempMovieData) {
      tempMovieData[i].unsavedChanges = false;
    }
    this.setState({
      savedMovieData,
      tempMovieData,
      lastIndex: data.lastIndex
    });
  }
  
  handleChange(e, row, column) {
    let { tempMovieData, savedMovieData } = this.state;
    let tempMovie = tempMovieData[row];
    let savedMovie = savedMovieData[row];
    
    // Movie is already in database
    if(savedMovie) {
      tempMovie[column] = e.target.value;
      tempMovie.unsavedChanges = tempMovie[column] !== savedMovie[column];
    } else { // Adding a new movie
      if(!tempMovie) {
        tempMovie = {
          title: '',
          release: '',
          director: '',
          rating: '',
          unsavedChanges: true
        }
        tempMovieData[row] = tempMovie;
      }
      tempMovie[column] = e.target.value;
    }
    this.setState({ tempMovieData });
  }
  
  render() {
    
    // Run some logic on the added movie
    let newIndex = this.state.lastIndex + 1;
    let newMovie = this.state.tempMovieData[newIndex] || { title: '', relese: '', director: '', rating: '' };
    
    return (
      <div>
        <table className="list">
        {this.state.loginRedirect ? <Redirect to="/login" push={true} /> : ''}
          <tbody>
          <tr>
            <th>Title</th>
            <th>Release Date</th>
            <th>Director(s)</th>
            <th>Rating</th>
            <th></th>
          </tr>
          {Object.keys(this.state.savedMovieData).map(index => {
              let movie = this.state.tempMovieData[index];
              return (
                <EditableRow
                  unsaved={movie.unsavedChanges}
                  key={index}
                  row={index}
                  movie={movie}
                  handleChange={this.handleChange}
                  handleAdd={this.add}
                  handleSave={this.save}
                  handleDelete={this.delete}
                />
              );
          })}
          <EditableRow
            key={newIndex}
            newRow="true"
            row={newIndex}
            unsaved={newMovie.unsavedChanges}
            movie={newMovie}
            handleChange={this.handleChange}
            handleAdd={this.add}
          />
          </tbody>
        </table>
        <a href="#" onClick={this.logout}>Log Out</a>
      </div>
    );
  }
  
  /*
   * API methods
   */
  
  
  // Helper for API requests and reponse/error handling
  async sendRequest(url, config) {
    const res = await fetch(url, config);
    if(res.status === 401) {
      // Redirect to login on the first API request that doesn't authenticate.
      this.setState({ loginRedirect: true });
    } else {
      const data = await res.json();
      return data;
    }
  }
  
  /*
   * Get movie list
   */
  async get() {
    try{
      const res = await this.sendRequest('/api/get', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
      });

      if(res.Error) this.props.updateMessage(res.Error.join(' '));
      else this.populateMovieData(res);
    } catch(e) {}
  }
  
  /*
   * Add a new movie
   */
  async add(row) {
    let tempMovie = this.state.tempMovieData[row];
    let errors = validate(tempMovie);
    if(errors.length) {
      this.props.updateMessage(errors.join(' '));
      return;
    }
    format(tempMovie);
    this.props.updateMessage('Adding...');
    try{
      const res = await this.sendRequest('/api/add', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: tempMovie
        })
      });

      if(res.Error) {
        if(res.Error) this.props.updateMessage(res.Error.join(' '));
      } else {
        this.props.updateMessage(res.message);
        this.populateMovieData(res.movieData);
      }
    } catch(e) {}
  }
  
  /*
   * Update a movie
   */
  async save(row) {
    let confirmChange = false;
    let savedMovie = this.state.savedMovieData[row];
    let tempMovie = this.state.tempMovieData[row]
    columns.forEach(column => {
      if(savedMovie[column] !== tempMovie[column]) confirmChange = true;
    });
    
    if(confirmChange) {
      let errors = validate(tempMovie);
      if(errors.length) {
        this.props.updateMessage(errors.join(' '));
        return;
      }
      format(tempMovie);
      this.props.updateMessage('Saving...');
      try{
        const res = await this.sendRequest('/api/save', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            row, data: tempMovie
          })
        });
        console.log('res:',res);
        if(res.Error) this.props.updateMessage(res.Error.join(' '));
        else {       
          console.log('updating movies');
          this.props.updateMessage(res.message);
          this.populateMovieData(res.movieData);
        }
      } catch(e) {}
    } else this.props.updateMessage('No changes detected to current row.');
  }
  
  /*
   * Delete a movie
   */
  async delete(row) {
    const confirm = window.confirm('Are you sure you want to delete this entry? This operation can not be undone.');
    if(confirm) {
      this.props.updateMessage('Deleting...');
      try{
        const res = await this.sendRequest('/api/delete', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            row
          })
        });

        if(res.Error) {
          if(res.Error) this.props.updateMessage(res.Error.join(' '));
        } else {
          this.props.updateMessage(res.message);
          this.populateMovieData(res.movieData);
        }
      } catch(e) {}
    }
  }
  
  async logout() {
    await fetch('/api/logout');
    this.props.updateMessage('Logged out successfully.');
    setTimeout(() => this.setState({ loginRedirect: true }), 1500);
  }
}

class Main extends Component {
  constructor() {
    super();
    this.state = {
      message: ''
    };
    this.updateMessage = this.updateMessage.bind(this);
  }
  
  updateMessage(message) {
    this.setState({ message });
  }
  
  render() {
    return (
      <>
        <h1>The Big Movie List</h1>
        <p>Currently only one line can be added or updated at a time. Click the save icon for one line before editing another. Release Date should accept most valid formats. Rating should be between 1 and 5.</p>
        <Movielist updateMessage={this.updateMessage}/>
        <div className="message">{this.state.message}</div>
      </>
    );
  }
}

export default Main;
