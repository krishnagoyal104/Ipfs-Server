var mongoose = require('mongoose');

var CloudSchema = new mongoose.Schema({
  
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true  //very important, since I'm accessing the id from the authenticate route   
  },

  ipfs: [
    {    
      hash: {
        type: String,
      }, 

      time: {
        type: Number,      
      }
    }  
  ],

});

const IPFS = mongoose.model('IPFS', CloudSchema);

module.exports = {IPFS};



