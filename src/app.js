import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import classController from './controllers/index.js'
import makeCallback from './expressCallback/index.js'
import cors from 'cors'
dotenv.config();

const app = express();
const port = process.env.PORT || 5000
const {
    postClass, 
    getClasses, 
    deleteClass, 
    putClass,
    bookClass,
    unbookClass
} = classController

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => res.send('hello world'))

app.post('/classes',makeCallback(postClass))
app.get('/classes',makeCallback(getClasses))
app.delete('/classes',makeCallback(deleteClass))
app.put('/classes',makeCallback(putClass))
app.post('/classes/:id/book',makeCallback(bookClass))
app.post('/classes/:id/unbook',makeCallback(unbookClass))

app.listen(port,() => {
    console.log('Server is running at port ' + port);
});

//HEROKU APP
//https://fathomless-coast-56337.herokuapp.com/