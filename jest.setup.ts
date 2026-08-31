import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  window.URL.revokeObjectURL = jest.fn();
}
