const {
  flattenObject,
  flattenKeys,
  escapeCSV,
  escapeXML,
  convertToBIF,
  generateId,
  parseValue
} = require('../../src/lib/utils');

describe('Utils', () => {
  describe('flattenObject', () => {
    test('should flatten a nested object', () => {
      const input = {
        a: {
          b: {
            c: 1,
            d: 2
          },
          e: 3
        },
        f: 4
      };
      const expected = {
        'a.b.c': 1,
        'a.b.d': 2,
        'a.e': 3,
        'f': 4
      };
      expect(flattenObject(input)).toEqual(expected);
    });

    test('should handle arrays', () => {
      const input = {
        a: [1, 2, 3],
        b: { c: [4, 5] }
      };
      const expected = {
        'a': [1, 2, 3],
        'b.c': [4, 5]
      };
      expect(flattenObject(input)).toEqual(expected);
    });

    test('should handle null and undefined values', () => {
      const input = {
        a: null,
        b: undefined,
        c: { d: null }
      };
      const expected = {
        'a': null,
        'b': undefined,
        'c.d': null
      };
      expect(flattenObject(input)).toEqual(expected);
    });
  });

  describe('flattenKeys', () => {
    test('should return flattened keys of a nested object', () => {
      const input = {
        a: {
          b: { c: 1 },
          d: 2
        },
        e: 3
      };
      const expected = ['a', 'a.b', 'a.b.c', 'a.d', 'e'];
      expect(flattenKeys(input).sort()).toEqual(expected.sort());
    });

    test('should handle empty objects', () => {
      const input = {};
      expect(flattenKeys(input)).toEqual([]);
    });
  });

  describe('escapeCSV', () => {
    test('should escape special characters in CSV values', () => {
      expect(escapeCSV('hello,world')).toBe('"hello,world"');
      expect(escapeCSV('line1\nline2')).toBe('"line1\nline2"');
      expect(escapeCSV('text with "quotes"')).toBe('"text with ""quotes"""');
    });

    test('should handle null and undefined', () => {
      expect(escapeCSV(null)).toBe('');
      expect(escapeCSV(undefined)).toBe('');
    });

    test('should convert numbers to strings', () => {
      expect(escapeCSV(123)).toBe('123');
      expect(escapeCSV(123.45)).toBe('123.45');
    });
  });

  describe('escapeXML', () => {
    test('should escape special characters in XML', () => {
      expect(escapeXML('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&apos;');
      expect(escapeXML('text & more')).toBe('text &amp; more');
    });

    test('should handle null and undefined', () => {
      expect(escapeXML(null)).toBe('');
      expect(escapeXML(undefined)).toBe('');
    });

    test('should convert numbers to strings', () => {
      expect(escapeXML(123)).toBe('123');
    });
  });

  describe('convertToBIF', () => {
    test('should convert a simple Bayesian network to BIF format', () => {
      const network = {
        nodes: {
          'A': {
            states: ['true', 'false'],
            parents: [],
            cpt: { true: 0.7, false: 0.3 }
          },
          'B': {
            states: ['yes', 'no'],
            parents: [{ id: 'A' }],
            cpt: {}
          }
        }
      };
      const bif = convertToBIF(network);
      expect(bif).toContain('network {');
      expect(bif).toContain('variable A {');
      expect(bif).toContain('variable B {');
      expect(bif).toContain('probability ( A )');
      expect(bif).toContain('probability ( B | A )');
    });
  });

  describe('generateId', () => {
    test('should generate an ID of specified length', () => {
      const id = generateId(16);
      expect(id).toHaveLength(16);
      expect(id).toMatch(/^[a-zA-Z0-9]+$/);
    });

    test('should generate different IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    test('should use default length of 12', () => {
      const id = generateId();
      expect(id).toHaveLength(12);
    });
  });

  describe('parseValue', () => {
    test('should parse boolean values', () => {
      expect(parseValue('true')).toBe(true);
      expect(parseValue('false')).toBe(false);
    });

    test('should parse numeric values', () => {
      expect(parseValue('123')).toBe(123);
      expect(parseValue('123.45')).toBe(123.45);
      expect(parseValue('-123')).toBe(-123);
    });

    test('should parse date values', () => {
      const dateStr = '2024-03-08';
      const result = parseValue(dateStr);
      expect(result instanceof Date).toBe(true);
      expect(result.toISOString().startsWith(dateStr)).toBe(true);
    });

    test('should parse JSON values', () => {
      expect(parseValue('{"a":1}')).toEqual({a: 1});
      expect(parseValue('[1,2,3]')).toEqual([1,2,3]);
    });

    test('should handle null and empty values', () => {
      expect(parseValue(null)).toBeNull();
      expect(parseValue(undefined)).toBeNull();
      expect(parseValue('')).toBeNull();
      expect(parseValue('null')).toBeNull();
    });

    test('should return string for invalid JSON', () => {
      expect(parseValue('{invalid}')).toBe('{invalid}');
    });

    test('should return string for non-parseable values', () => {
      expect(parseValue('hello')).toBe('hello');
      expect(parseValue('123abc')).toBe('123abc');
    });
  });
}); 