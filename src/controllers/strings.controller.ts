import { Request, Response } from "express";
import analyzer from "../services/analyzer";
import nlParser from "../services/nlParser";
import jsonStore from "../json_store/jsonStore";


export const addString = async (req: Request, res: Response) => {
    const { value } = req.body ?? {};
    if (value === undefined) {
      return res.status(400).json({ error: 'Missing "value" field' });
    }
    if (typeof value !== 'string') {
      return res.status(422).json({ error: '"value" must be a string' });
    }

    const props = analyzer.computeProperties(value.toLowerCase());
    const id = props.sha256_hash;

    const existing = jsonStore.getById(id);
    if (existing) {
      return res
        .status(409)
        .json({ error: 'String already exists in the system' });
    }

    const record = {
      id,
      value,
      properties: props,
      created_at: new Date().toISOString(),
    };

    jsonStore.save(record);
    return res.status(201).json(record);
}


export const getString = (req: Request, res: Response) => {
    const string_value = decodeURIComponent(req.params.string_value);
    const stringValue = string_value.toLowerCase();
    console.log(stringValue)


      if (typeof stringValue !== 'string' || stringValue.length === 0) {
        return res.status(400).json({ error: 'Invalid string parameter' });
    }
    
    const id = analyzer.sha256(stringValue);
    console.log({ 'string id': id });

  const record = jsonStore.getById(id);
  if (!record) {
    return res.status(404).json({ error: "String does not exist in the system" });
  }
  return res.json(record);
}

export const getFilteredString = (req: Request, res: Response) => {
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = req.query;

    // Validate query types
    const filters: any = {};
    if (is_palindrome !== undefined) {
      if (is_palindrome !== 'true' && is_palindrome !== 'false') {
        return res
          .status(400)
          .json({ error: 'is_palindrome must be true or false' });
      }
      filters.is_palindrome = is_palindrome === 'true';
    }
    if (min_length !== undefined) {
      const v = Number(min_length);
      if (!Number.isInteger(v) || v < 0) {
        return res
          .status(400)
          .json({ error: 'min_length must be a non-negative integer' });
      }
      filters.min_length = v;
    }
    if (max_length !== undefined) {
      const v = Number(max_length);
      if (!Number.isInteger(v) || v < 0) {
        return res
          .status(400)
          .json({ error: 'max_length must be a non-negative integer' });
      }
      filters.max_length = v;
    }
    if (word_count !== undefined) {
      const v = Number(word_count);
      if (!Number.isInteger(v) || v < 0) {
        return res
          .status(400)
          .json({ error: 'word_count must be a non-negative integer' });
      }
      filters.word_count = v;
    }
    if (contains_character !== undefined) {
      if (
        typeof contains_character !== 'string' ||
        contains_character.length !== 1
      ) {
        return res
          .status(400)
          .json({
            error: 'contains_character must be a single character string',
          });
      }
      filters.contains_character = contains_character;
    }

    const all = jsonStore.getAll();
    const data = all.filter((r) => {
      const p = r.properties;
      if (
        filters.is_palindrome !== undefined &&
        p.is_palindrome !== filters.is_palindrome
      )
        return false;
      if (filters.min_length !== undefined && p.length < filters.min_length)
        return false;
      if (filters.max_length !== undefined && p.length > filters.max_length)
        return false;
      if (
        filters.word_count !== undefined &&
        p.word_count !== filters.word_count
      )
        return false;
      if (filters.contains_character !== undefined) {
        if (!p.character_frequency_map[filters.contains_character])
          return false;
      }
      return true;
    });

    return res.json({
      data,
      count: data.length,
      filters_applied: filters,
    });
}

export const getStringByNaturalLanguage = (req: Request, res: Response) => {
     const q = req.query.query;
     if (!q || typeof q !== 'string') {
       return res.status(400).json({ error: 'query parameter is required' });
     }
     const interpreted = nlParser.parse(q);
     if (!interpreted) {
       return res
         .status(400)
         .json({ error: 'Unable to parse natural language query' });
     }
     if (interpreted.conflict) {
       return res
         .status(422)
         .json({ error: 'Query parsed but resulted in conflicting filters' });
     }

     // Build filters similar to GET /strings
     const { parsed_filters } = interpreted;
     const all = jsonStore.getAll();
     const data = all.filter((r) => {
       const p = r.properties;
       if (
         parsed_filters.is_palindrome !== undefined &&
         p.is_palindrome !== parsed_filters.is_palindrome
       )
         return false;
       if (
         parsed_filters.word_count !== undefined &&
         p.word_count !== parsed_filters.word_count
       )
         return false;
       if (
         parsed_filters.min_length !== undefined &&
         p.length < parsed_filters.min_length
       )
         return false;
       if (parsed_filters.contains_character !== undefined) {
         if (!p.character_frequency_map[parsed_filters.contains_character])
           return false;
       }
       return true;
     });

     return res.json({
       data,
       count: data.length,
       interpreted_query: {
         original: q,
         parsed_filters: parsed_filters,
       },
     });
}

export const deleteString = (req: Request, res: Response) => {
    const string_value = decodeURIComponent(req.params.string_value);
    const stringValue = string_value.toLowerCase();
    console.log(stringValue)
    const id = analyzer.sha256(stringValue);
    const existing = jsonStore.getById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ error: 'String does not exist in the system' });
    }
    jsonStore.removeById(id);
    return res.status(204).send();
}