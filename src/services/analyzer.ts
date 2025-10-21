import crypto from 'crypto';

type Properties = {
  length: number;
  is_palindrome: boolean;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: Record<string, number>;
};

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function computeCharacterFrequency(value: string): Record<string, number> {
  const map: Record<string, number> = {};
  for (const ch of value) {
    map[ch] = (map[ch] || 0) + 1;
  }
  return map;
}

function isPalindrome(value: string): boolean {
  const lower = value.toLowerCase();
  const rev = Array.from(lower).reverse().join('');
  return lower === rev;
}

function countWords(value: string): number {
  // split on whitespace. empty string => 0
  if (value.trim().length === 0) return 0;
  return value.trim().split(/\s+/).length;
}

function computeProperties(value: string): Properties {
  const length = value.length;
  const is_palindrome = isPalindrome(value);
  const charFreq = computeCharacterFrequency(value);
  const unique_characters = Object.keys(charFreq).length;
  const word_count = countWords(value);
  const sha256_hash = sha256(value);

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map: charFreq,
  };
}

export default {
  sha256,
  computeProperties,
};

export type { Properties };
