const { test, expect } = require('@playwright/test');

test.describe('encodeURIComponent', () => {

  test('encodes spaces as %20', () => {
    expect(encodeURIComponent('Hello World')).toBe('Hello%20World');
  });

  test('encodes special characters', () => {
    expect(encodeURIComponent('@#$%^&')).toBe('%40%23%24%25%5E%26');
  });

  test('encodes unicode characters', () => {
    expect(encodeURIComponent('café')).toBe('caf%C3%A9');
  });

  test('does not encode unreserved characters', () => {
    const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'()";
    expect(encodeURIComponent(s)).toBe(s);
  });

  test('encodes URL schemes and slashes', () => {
    expect(encodeURIComponent('https://example.com/path')).toBe('https%3A%2F%2Fexample.com%2Fpath');
  });

  test('handles empty string', () => {
    expect(encodeURIComponent('')).toBe('');
  });

});

test.describe('decodeURIComponent', () => {

  test('decodes %20 to space', () => {
    expect(decodeURIComponent('Hello%20World')).toBe('Hello World');
  });

  test('decodes mixed encoded string', () => {
    expect(decodeURIComponent('Hello%20World%21')).toBe('Hello World!');
  });

  test('decodes unicode percent-encoding', () => {
    expect(decodeURIComponent('caf%C3%A9')).toBe('café');
  });

  test('throws URIError for invalid percent-encoding', () => {
    expect(() => decodeURIComponent('%ZZ%')).toThrow();
  });

  test('throws URIError for truncated percent sequence', () => {
    expect(() => decodeURIComponent('%2')).toThrow();
  });

  test('handles empty string', () => {
    expect(decodeURIComponent('')).toBe('');
  });

});

test.describe('round-trip consistency', () => {

  const inputs = [
    'Hello World!',
    'https://example.com/search?q=hello world&cat=tech',
    'Special chars: @#$%^&*()',
    'Unicode: café résumé 日本語',
    'Email: user@example.com',
    '',
    'a',
    '1234567890',
    '-_.!~*\'()'
  ];

  for (const input of inputs) {
    test(`encode then decode returns original: ${input || '(empty)'}`, () => {
      const encoded = encodeURIComponent(input);
      const decoded = decodeURIComponent(encoded);
      expect(decoded).toBe(input);
    });
  }

});
