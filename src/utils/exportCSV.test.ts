import { exportCSV, formatCSVCell, generateCSVString } from './exportCSV';

describe('exportCSV utility', () => {
  test('formats CSV cells properly', () => {
    expect(formatCSVCell('hello')).toBe('"hello"');
    expect(formatCSVCell('hello, world')).toBe('"hello, world"');
    expect(formatCSVCell('hello "world"')).toBe('"hello ""world"""');
    expect(formatCSVCell(null)).toBe('""');
    expect(formatCSVCell(undefined)).toBe('""');
    expect(formatCSVCell(123)).toBe('"123"');
  });

  test('generates valid CSV string from array of objects', () => {
    const data = [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'Editor' },
    ];

    const csv = generateCSVString(data, {
      columns: [
        { key: 'name', label: 'Full Name' },
        { key: 'role', label: 'User Role' },
      ],
    });

    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('"Full Name","User Role"');
    expect(lines[1]).toBe('"Alice","Admin"');
    expect(lines[2]).toBe('"Bob","Editor"');
  });

  test('handles custom cell formatting', () => {
    const data = [{ id: 1, amount: 2500 }];

    const csv = generateCSVString(data, {
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'amount', label: 'Formatted Amount', format: val => `$${val}.00` },
      ],
    });

    expect(csv).toContain('"$2500.00"');
  });

  test('returns empty string for empty data', () => {
    expect(generateCSVString([])).toBe('');
  });

  test('exportCSV triggers download or returns string', () => {
    const data = [{ id: 1, name: 'Test' }];
    const res = exportCSV(data, { filename: 'test_export.csv' });
    expect(res).toContain('"id","name"');
  });
});
