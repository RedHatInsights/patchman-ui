import dateValidator from './dateValidator';

describe('dateValidator', () => {
  it.each`
    date             | result
    ${'1990-01-01'}  | ${undefined}
    ${'2022-01-01'}  | ${undefined}
    ${'2022-12-01'}  | ${undefined}
    ${'1428-02-03'}  | ${'Date is before the allowable range.'}
    ${'1989-12-31'}  | ${'Date is before the allowable range.'}
    ${'2022-1-01'}   | ${'The date should be valid of a type YYYY-MM-DD'}
    ${'random-text'} | ${'The date should be valid of a type YYYY-MM-DD'}
  `('dateValidator: Should match validate date', ({ date, result }) => {
    let validatedResult = dateValidator(date);
    expect(validatedResult).toEqual(result);
  });
});
