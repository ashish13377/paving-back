// Imports
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 7909;

const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then((res)=>{
    console.log("Connected")
});


// Create counter schema
const counterSchema = new mongoose.Schema({
    value: { type: Number, default: 5000 },
    timestamp: { type: Date, default: Date.now }
});

// Compile schema into model
const Counter = mongoose.model('Counter', counterSchema);

// Increment counter every 15 minutes
setInterval(() => {
    Counter.findOneAndUpdate({}, { $inc: { value: 1 } }, { new: true }, (err, counter) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Counter value: ${counter.value}`);
        }
    });
}, 900000);



// Static Files
app.use(express.static('public'));
// Specific folder example
// app.use('/css', express.static(__dirname + 'public/css'))
// app.use('/js', express.static(__dirname + 'public/js'))
// app.use('/img', express.static(__dirname + 'public/images'))

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');

// Navigation
app.get('', (req, res) => {
    Counter.findOne((err, counter) => {
        if (err) {
            console.log(err);
        } else {
            res.send(counter);
        }
    });    
})



app.listen(port, () => console.info(`App listening on port ${port}`))
