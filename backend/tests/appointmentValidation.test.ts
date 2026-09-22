/**
 * tests/appointmentValidation.test.ts
 * Tests for appointment validation logic (time and date formats)
 */

describe('Appointment Time Validation Pattern', () => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5]\d(\s*(AM|PM|am|pm))?$/i;

  it('should accept standard 12-hour AM/PM formats from booking UI', () => {
    expect(timeRegex.test('09:00 AM')).toBe(true);
    expect(timeRegex.test('10:00 AM')).toBe(true);
    expect(timeRegex.test('11:30 AM')).toBe(true);
    expect(timeRegex.test('02:00 PM')).toBe(true);
    expect(timeRegex.test('03:30 PM')).toBe(true);
    expect(timeRegex.test('04:30 PM')).toBe(true);
    expect(timeRegex.test('9:00 AM')).toBe(true);
    expect(timeRegex.test('2:00 PM')).toBe(true);
  });

  it('should accept 24-hour military formats', () => {
    expect(timeRegex.test('09:00')).toBe(true);
    expect(timeRegex.test('14:00')).toBe(true);
    expect(timeRegex.test('23:59')).toBe(true);
    expect(timeRegex.test('00:00')).toBe(true);
  });

  it('should reject invalid time values', () => {
    expect(timeRegex.test('25:00')).toBe(false);
    expect(timeRegex.test('12:65')).toBe(false);
    expect(timeRegex.test('random string')).toBe(false);
    expect(timeRegex.test('')).toBe(false);
  });
});
