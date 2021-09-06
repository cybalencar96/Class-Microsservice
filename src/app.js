import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { postClass, getClasses } from './controllers/index.js'
import makeCallback from './expressCallback/index.js'
import cors from 'cors'
import makeListClasses from './useCases/listClasses.js'
dotenv.config();

const app = express();
const port = 3000

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => res.send('hello world'))
app.post('/classes',makeCallback(postClass))
app.get('/classes',makeCallback(getClasses))

app.listen(port,() => {
    console.log('Server is running at port ' + port);
})