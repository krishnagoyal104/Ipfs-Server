const ipfsAPI = require('ipfs-api');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = require('express');
const {IPFS} = require('../models/ipfs');
const authenticate = require('../middleware/authenticate');

const router = app.Router();

const MAX_SIZE = 52428800;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});

const upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 } });

multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
});

/*const ipfs = ipfsAPI({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http'
});*/

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});


router.get('/', authenticate, (req, res) => {

  IPFS.findOne({_user: req.user._id}).then((data) => {
    res.send(data);    
  }).catch((e) => {
    res.status(400).send(e);
  });

});


router.post('/', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(422).json({
      error: 'File needs to be provided.',
    });
  }

  const mime = req.file.mimetype;
  if (mime.split('/')[0] !== 'image') {
    fs.unlink(req.file.path);

    return res.status(422).json({
      error: 'File needs to be an image.',
    });
  }

  const fileSize = req.file.size;
  if (fileSize > MAX_SIZE) {

    fs.unlink(req.file.path);

    return res.status(422).json({
      error: `Image needs to be smaller than ${MAX_SIZE} bytes.`,
    });
  }  
    
  //const data = fs.readFileSync(req.file.path);
  const data = fs.createReadStream(req.file.path);

  ipfs.add(data, (err, files) => {   

    fs.unlink(req.file.path);

    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
                        

    const data = {
      _user: req.user._id                                           
    }

    const newIpfs = new IPFS(data);

    newIpfs.save().then((doc) => {
      res.send(doc.ipfs);
    }).catch((e) => {
      res.status(400).send(e);
    });

    newIpfs.ipfs.push({hash: files[0].hash, time: now});

    const object = {
      hash: files[0].hash,
      time: new Date()
    }

    IPFS.findOneAndUpdate(
      {_user: req.user._id}, 
      { "$push": {"ipfs": object} },
      {upsert: true, new: true}
    ).then((doc) => {
      res.send(doc);
    }).catch((e) => {
      res.send(e);
    });

  });

});      

module.exports = router;