# Ipfs-Server
Server-side implementation for storing files on Ipfs using Node.js and MongoDb.

## To run locally
Requirements : 
* Node.js
* MongoDB

```
$ mongod --dbpath 'path/to/folder'
$ npm install  
$ node server.js 
```

## API
### Authentication
|Method|URL|Request body|Response body
| --|--|--|--|
|Post|/user/signup|{email, password}|jwt|
|Post|/user/signin|{email, password}|jwt|
|Delete|/user/signout|||

### Upload
|Method|URL|Request body|Response body|Description|
| --|--|--|--|--|
|Post|/api|Add file to form-data||Upload Files|
|Get|/api||{_user, ipfs[{hash, time}]}|List of images|


















