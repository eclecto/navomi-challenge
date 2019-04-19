import bcrypt from 'bcrypt';
import database from '../data/database';
const jwt = require('jsonwebtoken');
const db = database();


class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
  
  static async register(username, password) {
    if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
      return { Error: 'Password does not meet requirements.' };
    }
    if(db.getUser(username)) {
      return { Error: 'Username already exists' };
    } else {
      const hashedPW = await bcrypt.hash(password, 10);
      const user = new User(username, hashedPW);
      console.log('user:',user);
      db.register(user);
      return user;
    }
  }
  
  static async login(username, password) {
    const userEntry = db.getUser(username);
    if(userEntry) {
      const same = await bcrypt.compare(password, userEntry.password);
      if(same) {
        console.log(process.env.LOCAL_SECRET);
        const token = jwt.sign({ username }, process.env.SECRET, {
          expiresIn: '1h'
        });
        console.log(token);
        userEntry.token = token;
        return userEntry;
      }
      else return { Error: 'Password does not match username.' };
    } else {
      return { Error: 'Username does not exist' };
    }
  }
  
  static async auth(req, res, next) {
    const token = req.cookies.token;
    if(!token) {
      res.status(401).send('Unauthorized: User is not logged in.');
    } else {
      const decoded = jwt.verify(token, process.env.SECRET);
      console.log(decoded);
      if(decoded) next();
    }
  }
}

export default User;