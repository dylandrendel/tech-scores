import { getDateString, getCsvFilePath, getLocalDate } from './add_data_util';

describe('getTodayDate', () => {
  it('returns a Date object', () => {
    expect(getLocalDate(new Date())).toBeInstanceOf(Date);
  });
});

describe('getTodayString', () => {
  it('returns a date string in YYYY-MM-DD format', () => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const today = getLocalDate(new Date());
    expect(getDateString(today)).toMatch(regex);
  });
});

describe('getCsvFilePath', () => {
  it('constructs a file path with the correct date string', () => {
    const dateString = '2023-01-01';
    const expectedPath = expect.stringContaining(`jobs_${dateString}.csv`);
    expect(getCsvFilePath(dateString)).toEqual(expectedPath);
  });
});

// test the gettodaydate function with multiple mock dates around UTC cutoff using system local timezone
describe('getTodayDate and getTodayString', () => {
  it('returns the correct date for a given timezone', () => {
    // get current timezone
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() / 60;
    // pad the offset with a zero if it's a single digit using a pad function
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    const mockDates = [
      { date: '2023-01-01T00:00:00Z', expected: '2022-12-31' },
      { date: '2023-01-01T23:59:59Z', expected: '2023-01-01' },
      {
        date: `2023-01-02T${pad(tzOffset - 1)}:00:00Z`,
        expected: '2023-01-01',
      },
      { date: `2023-01-02T${pad(tzOffset)}:00:00Z`, expected: '2023-01-01' },
      {
        date: `2023-01-02T${pad(tzOffset + 1)}:00:00Z`,
        expected: '2023-01-02',
      },
    ];

    mockDates.forEach((mock) => {
      expect(getDateString(getLocalDate(new Date(mock.date)))).toEqual(
        mock.expected
      );
    });
  });
});
