# HNG Internship - Backend Task (Stage One)

Simple RESTful API that analyzes strings and stores computed properties.

---

## Features
- TypeScript setup  
- Error and timeout handling for external API requests  
- CORS configuration for safe cross-origin access  
- HTTP request logging using Morgan  
- Basic rate limiting to prevent abuse  
- Compute length, is_palindrome (case-insensitive), unique_characters, word_count, sha256_hash, character_frequency_map
- endpoints:
  - POST /strings
  - GET /strings/:string_value
  - GET /strings with filters
  - GET /strings/filter-by-natural-language?query=...
  - DELETE /strings/:string_value
- JSON file persistence in `data/strings.json`

---

## Folder Structure
- data
- │ └── strings.json
- src/
- ├── constants/
- │ └── env.ts
- ├── controllers/
- │ └── strings.controller.ts
- ├── json_store/
- │ └── jsonStore.ts 
- ├── routers/
- │ └── strings.router.ts
- ├── services/
- │ └── analyzer.ts 
- │ └── nlParser.ts 
- ├── index.ts 
- .gitignore
- package-lock.json 
- package.json 
- README.me 
- tsconfig.json 

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/JosephOluOlofinte/hng-string-analyzer.git
cd hng-string-analyzer
```

### 2. Install Dependencies
```bash
npm install
```

## Running the Project Locally

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

## Dependencies

### 1. Express
### 2. Cors
### 3. Typescript
### 4. Morgan
### 5. Express Rate Limit 
### 6. Dot Env
### 7. TS Node
### 8. Nodemon

### How To Install Dependencies
```bash
npm install express cors morgan express-rate-limit dotenv 

npm install --save-dev @types/express @types/cors @types/morgan ts-node nodemon typescript
```

---

### ENV
- PORT=4060
This is exported in /src/constants/env.ts as a constant

---

## API Documentation
### Base URL
```bash
Prod: https://
Dev: http://localhost:3000/
```

### Endpoint
```bash
POST /strings
```

#### Description
- Create/Analyze String

#### Request Format
```json
{
  "value": "string"
}
```

#### Response Format
##### Success Response
```json
{
  "id": "sha256_hash_value",
  "value": "string",
  "properties": {
    "length": 17,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2,
      // ... etc
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

##### Error response
```json
{
    "error": "String already exists in the system"
}
```

```json
{
    "error": "Missing \"value\" field"
}
```

### Endpoint
```bash
GET /strings/:string_value
```

#### Description
- Get Specific String

#### Request Format
```bash
/strings/level
```

#### Response Format
##### Success Response
```json
{
    "id": "0081779c287d567d9ca622f4c0cc2ede819b0cc7f286a5f01d8c3c0178191ad6",
    "value": "level",
    "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "0081779c287d567d9ca622f4c0cc2ede819b0cc7f286a5f01d8c3c0178191ad6",
        "character_frequency_map": {
            "l": 2,
            "e": 2,
            "v": 1
        }
    },
    "created_at": "2025-10-21T20:24:00.158Z"
}
```

##### Error response
```json
{
    "error": "String does not exist in the system"
}
```


### Endpoint
```bash
GET /strings?filters
```

#### Description
- Get All Strings with Filtering

#### Request Format
```bash
/strings?is_palindrome=true&min_length=5&max_length=20&word_count=1&contains_character=a
```

#### Response Format
##### Success Response
```json
{
    "data": [
        {
            "id": "765cc52b3dbc1bb8ec279ef9c8ec3d0f251c0c92a6ecdc1870be8f7dc7538b21",
            "value": "madam",
            "properties": {
                "length": 5,
                "is_palindrome": true,
                "unique_characters": 3,
                "word_count": 1,
                "sha256_hash": "765cc52b3dbc1bb8ec279ef9c8ec3d0f251c0c92a6ecdc1870be8f7dc7538b21",
                "character_frequency_map": {
                    "m": 2,
                    "a": 2,
                    "d": 1
                }
            },
            "created_at": "2025-10-21T20:28:29.936Z"
        },
        {
            "id": "fc881aa34d44660e1012dec26ccda0b469d6c8359e91dc674dab4c095b9fe832",
            "value": "hannah",
            "properties": {
                "length": 6,
                "is_palindrome": true,
                "unique_characters": 3,
                "word_count": 1,
                "sha256_hash": "fc881aa34d44660e1012dec26ccda0b469d6c8359e91dc674dab4c095b9fe832",
                "character_frequency_map": {
                    "h": 2,
                    "a": 2,
                    "n": 2
                }
            },
            "created_at": "2025-10-21T20:28:42.189Z"
        }
    ],
    "count": 2,
    "filters_applied": {
        "is_palindrome": true,
        "min_length": 5,
        "max_length": 20,
        "word_count": 1,
        "contains_character": "a"
    }
}
```

##### Error response
```json
{
    "error": "Invalid query parameter values or types"
}
```


### Endpoint
```bash
GET /strings/filter-by-natural-language?filters
```

#### Description
- Natural Language Filtering

#### Request Format
```bash
/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings
```

#### Response Format
##### Success Response
```json
{
    "data": [
        {
            "id": "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
            "value": "a",
            "properties": {
                "length": 1,
                "is_palindrome": true,
                "unique_characters": 1,
                "word_count": 1,
                "sha256_hash": "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
                "character_frequency_map": {
                    "a": 1
                }
            },
            "created_at": "2025-10-21T17:44:58.254Z"
        },
        {
            "id": "de7d1b721a1e0632b7cf04edf5032c8ecffa9f9a08492152b926f1a5a7e765d7",
            "value": "I",
            "properties": {
                "length": 1,
                "is_palindrome": true,
                "unique_characters": 1,
                "word_count": 1,
                "sha256_hash": "de7d1b721a1e0632b7cf04edf5032c8ecffa9f9a08492152b926f1a5a7e765d7",
                "character_frequency_map": {
                    "i": 1
                }
            },
            "created_at": "2025-10-21T19:02:24.154Z"
        },
        {
            "id": "0081779c287d567d9ca622f4c0cc2ede819b0cc7f286a5f01d8c3c0178191ad6",
            "value": "level",
            "properties": {
                "length": 5,
                "is_palindrome": true,
                "unique_characters": 3,
                "word_count": 1,
                "sha256_hash": "0081779c287d567d9ca622f4c0cc2ede819b0cc7f286a5f01d8c3c0178191ad6",
                "character_frequency_map": {
                    "l": 2,
                    "e": 2,
                    "v": 1
                }
            },
            "created_at": "2025-10-21T20:24:00.158Z"
        },
        {
            "id": "765cc52b3dbc1bb8ec279ef9c8ec3d0f251c0c92a6ecdc1870be8f7dc7538b21",
            "value": "madam",
            "properties": {
                "length": 5,
                "is_palindrome": true,
                "unique_characters": 3,
                "word_count": 1,
                "sha256_hash": "765cc52b3dbc1bb8ec279ef9c8ec3d0f251c0c92a6ecdc1870be8f7dc7538b21",
                "character_frequency_map": {
                    "m": 2,
                    "a": 2,
                    "d": 1
                }
            },
            "created_at": "2025-10-21T20:28:29.936Z"
        },
        {
            "id": "fc881aa34d44660e1012dec26ccda0b469d6c8359e91dc674dab4c095b9fe832",
            "value": "hannah",
            "properties": {
                "length": 6,
                "is_palindrome": true,
                "unique_characters": 3,
                "word_count": 1,
                "sha256_hash": "fc881aa34d44660e1012dec26ccda0b469d6c8359e91dc674dab4c095b9fe832",
                "character_frequency_map": {
                    "h": 2,
                    "a": 2,
                    "n": 2
                }
            },
            "created_at": "2025-10-21T20:28:42.189Z"
        }
    ],
    "count": 5,
    "interpreted_query": {
        "original": "all single word palindromic strings",
        "parsed_filters": {
            "word_count": 1,
            "is_palindrome": true
        }
    }
}
```

##### Error response
```json
{
    "error": "Unable to parse natural language query"
}
```

```json
{
    "error": "Query parsed but resulted in conflicting filters"
}
```

### Endpoint
```bash
DELETE /strings/:string_value
```

#### Description
- Delete Specific String

#### Request Format
```bash
/strings/level
```

#### Response Format
##### Success Response
```json

```

##### Error response
```json
{
    "error": "String does not exist in the system"
}
```

# Persistence
- Strings are stored in `data/strings.json`, leveraging Node.JS filesystem


# Notes and limitations
- Natural language parser is heuristic based. It handles the example phrases in the spec and a few variants. For production, replace with a parser or a small NLP model.
- JSON store is simple and fine for staging. For concurrency or large data, swap for PostgreSQL, SQLite, or another DB.
