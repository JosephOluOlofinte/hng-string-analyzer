import express from 'express';
import { addString, deleteString, getFilteredString, getString, getStringByNaturalLanguage } from '../controllers/strings.controller';


const stringRoutes = express.Router();

stringRoutes.post('/strings', addString);
stringRoutes.get(
  '/strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a',
  getFilteredString
);
stringRoutes.get(
  '/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings',
  getStringByNaturalLanguage
);
stringRoutes.get('/strings/:string_value', getString);
stringRoutes.delete('/strigs/:string_value', deleteString);


export default stringRoutes;