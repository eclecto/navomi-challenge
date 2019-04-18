import fs from 'fs';
import data from './database.json';

const dbPath = './data/database.json';

const saveDatabase = () => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

class Database {
  
  add(newData) {
    console.log('adding row');
    delete newData.unsavedChanges;
    let index = ++data.lastIndex;
    data.movies[index] = newData;
    try{
      saveDatabase();
    } catch(e) {
      return { message: 'Add failed:', Error: e.message };
    }
    return { message: 'Add succeeded.', data };
  }
  
  save(row, newData) {
    console.log('saving row');
    try{
      delete newData.unsavedChanges;
      if(!data.movies[row]) throw new Error('Row does not exist.');
      data.movies[row] = newData;
      console.log(data);
      saveDatabase();
    } catch(e) {
      return { message: 'Update failed:', Error: e.message };
    }
    return { message: 'Update succeeded.', data };
  }
  
  get() {
    console.log('returning data');
    return data;
  }
  
  delete(row) {
    try{
      if(!data.movies[row]) throw new Error('Row does not exist.');
      delete data.movies[row];
      saveDatabase();
    } catch(e) {
      return { message: 'Delete failed:', Error: e.message };
    }
    return { message: 'Delete succeeded.', data };
  }
}

export default () => new Database();