type Parsed = {
  original: string;
  parsed_filters: Record<string, any>;
  conflict?: boolean;
} | null;

function parse(query: string): Parsed {
  const q = query.toLowerCase().trim();

  const filters: any = {};

  // single word => word_count = 1
  if (/single word/.test(q) || /\bone-word\b/.test(q)) {
    filters.word_count = 1;
  }

  // palindromic / palindrome
  if (/palindrom/.test(q)) {
    filters.is_palindrome = true;
  }

  // strings longer than N characters
  const longer = q.match(/strings?\s+longer\s+than\s+(\d+)/);
  if (longer) {
    const n = Number(longer[1]);
    if (!Number.isNaN(n)) {
      // min_length should be n + 1 to match "longer than 10" => min_length 11
      filters.min_length = n + 1;
    }
  }

  // strings containing the letter z or containing the letter x
  const containsLetter = q.match(/contain(?:ing)?\s+the\s+letter\s+([a-z])/);
  if (containsLetter) {
    filters.contains_character = containsLetter[1];
  } else {
    // simpler "strings containing the letter z" or "strings that contain z"
    const containsAny = q.match(/contain(?:ing)?\s+([a-z])/);
    if (containsAny && containsAny[1].length === 1) {
      filters.contains_character = containsAny[1];
    }
  }

  // "first vowel" heuristic: choose 'a' as first vowel
  if (/first vowel/.test(q)) {
    filters.contains_character = 'a';
    if (filters.is_palindrome === undefined) {
      // nothing
    }
  }

  if (Object.keys(filters).length === 0) return null;

  // detect trivial conflicts: min_length > some max_length etc
  if (filters.min_length !== undefined && filters.max_length !== undefined) {
    if (filters.min_length > filters.max_length) {
      return { original: query, parsed_filters: filters, conflict: true };
    }
  }

  return { original: query, parsed_filters: filters };
}

export default { parse };
