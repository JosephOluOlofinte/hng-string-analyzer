import express from 'express';
import { addString, deleteString, getFilteredString, getString, getStringByNaturalLanguage } from '../controllers/strings.controller';


const stringRoutes = express.Router();

stringRoutes.post('/strings', addString);
stringRoutes.get('/strings', getFilteredString);
stringRoutes.get(
  '/strings/filter-by-natural-language',
  getStringByNaturalLanguage
);
stringRoutes.get('/strings/:string_value', getString);
stringRoutes.delete('/strings/:string_value', deleteString);


export default stringRoutes;