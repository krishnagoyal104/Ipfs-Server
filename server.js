const express = require('express');
const mongoose = require('./db/mongoose');

const app = express();

const port = process.env.PORT || 3000;

app.use('/api', require('./routes/upload'));	
app.use('/user', require('./routes/user'));

app.listen(port, () => {
	console.log(`Listening on ${port}...`);
});

