import fs from 'fs';
import data from './database.json';
const { movieData } = data;

const dbPath = './data/database.json';

const saveDatabase = () => {
  // Remove any token references that might have gotten attached to user objects.
  data.userData.forEach(user => delete user.token); 
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

class Database {
  // User methods
  register(user) {
    data.userData.push(user);
    saveDatabase();
  }
  
  getUser(username) {
    return data.userData.filter(user => user.username === username)[0];
  }
  
  // Movie methods
  add(newData) {
    console.log('adding row');
    delete newData.unsavedChanges;
    let index = ++movieData.lastIndex;
    movieData.movies[index] = newData;
    try{
      saveDatabase();
    } catch(e) {
      return { message: 'Add failed:', Error: e.message };
    }
    return { message: 'Add succeeded.', movieData };
  }
  
  save(row, newData) {
    console.log('saving row');
    try{
      delete newData.unsavedChanges;
      if(!movieData.movies[row]) throw new Error('Row does not exist.');
      movieData.movies[row] = newData;
      console.log(movieData);
      saveDatabase();
    } catch(e) {
      return { message: 'Update failed:', Error: e.message };
    }
    return { message: 'Update succeeded.', movieData };
  }
  
  get() {
    console.log('returning movieData');
    return movieData;
  }
  
  delete(row) {
    try{
      if(!movieData.movies[row]) throw new Error('Row does not exist.');
      delete movieData.movies[row];
      saveDatabase();
    } catch(e) {
      return { message: 'Delete failed:', Error: e.message };
    }
    return { message: 'Delete succeeded.', movieData };
  }
}

export default () => new Database();