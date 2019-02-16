const router = require('express').Router();
const bodyParser = require('body-parser');
const _ = require('lodash');
const {User} = require('../models/user');
const authenticate = require('../middleware/authenticate');

const {IPFS} = require('../models/ipfs');

router.use(bodyParser.json());

router.post('/signup', (req, res) => {

	const user = _.pick(req.body, ['email', 'password']);

	const newUser = new User(user);

	newUser.save().then(() => {

    /*const data = {
      _user: newUser._id                                        
    }
      
    const newIpfs = new IPFS(data);

    newIpfs.save();*/

		return newUser.generateAuthToken()
	}).then((token) => {
	  res.send(token);

  }).catch((e) => {
		res.status(400).send(e);
	});
});

router.get('/test', (req, res) => {

  res.send('Hi');

});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.post('/signin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.send(token);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

router.delete('/signout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = router;