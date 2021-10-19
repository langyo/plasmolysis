import { compare } from '../utils';

describe('Special expression parse', () => {
  test('Test 1', () => {
    expect(compare(`
1 + 1    
`, `
1 + 1
`)).toBeTruthy();
  });

  test('Test 2', () => {
    expect(compare(`
1 + 1    
`, `
1 + 2
`)).toBeFalsy();
  });
});
