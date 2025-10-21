import express from 'express';
import { addString, deleteString, getFilteredString, getString, getStringByNaturalLanguage } from '../controllers/strings.controller';


const stringRoutes = express.Router();

stringRoutes.post('/', addString);
stringRoutes.get('/', getFilteredString);
stringRoutes.get('/filter-by-natural-language', getStringByNaturalLanguage);
stringRoutes.get('/:string_value', getString);
stringRoutes.delete('/:string_value', deleteString);


export default stringRoutes;