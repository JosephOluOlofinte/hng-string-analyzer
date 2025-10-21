import dotenv from 'dotenv';
dotenv.config()
import express, { Request, Response } from 'express'
import cors from 'cors';
import logger from 'morgan';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import { PORT } from './constants/env';
import stringRoutes from './routers/strings.router';

const app = express();
const requestLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// middlewares
app.use(logger('combined'));
app.use(cors());
app.use(requestLimit)
app.use(bodyParser.json());


// routes
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Joseph\'s String Analyzer API. Your connectiong is healthy!'
    })
})

app.use('/strings', stringRoutes)
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: "Not Found"
    })
})

// listen to port
app.listen(PORT, () => {
    console.log(`Connection to server is successful. Listening on port ${PORT}`)
})