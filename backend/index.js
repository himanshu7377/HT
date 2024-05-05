
const connectDB = require('./db/db.js');
const express = require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const route = require('./route/emp.js');
const port = process.env.PORT || 5000;
const app = express();
// Serve static files from the 'images' folder
app.use('/Public', express.static('Public'));
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(cors());

app.use(route);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
