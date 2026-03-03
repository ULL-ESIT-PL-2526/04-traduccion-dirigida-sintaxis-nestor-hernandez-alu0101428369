const { parse } = require('../src/index.js');  

describe('Parser Failing Tests Floating Point', () => {
    test('should handle only sum and subtraction with correct precedence', () => {
        expect(parse("1.5 + 2.3 - 0.8")).toBe(3); // (1.5 + 2.3) - 0.8 = 3
        expect(parse("10.0 - 3.5 + 2.5")).toBe(9); // (10.0 - 3.5) + 2.5 = 9
        expect(parse("5.0 + 4.0 - 1.0")).toBe(8); // (5.0 + 4.0) - 1.0 = 8
        expect(parse("1.0 + 2.0 - 3.0")).toBe(0); // (1.0 + 2.0) - 3.0 = 0
        expect(parse("5.5 + 2.2 - 1.1")).toBe(6.6); // (5.5 + 2.2) - 1.1 = 6.6
        expect(parse("20.0 - 5.5 + 3.0")).toBe(17.5); // (20.0 - 5.5) + 3.0 = 17.5
        expect(parse("15.0 + 4.5 - 2.0")).toBe(17.5); // (15.0 + 4.5) - 2.0 = 17.5
    });
    test('should handle only multiplication and division with correct precedence', () => {
        expect(parse("2.0 * 3.0 / 4.0")).toBe(1.5); // (2.0 * 3.0) / 4.0 = 1.5
        expect(parse("10.0 / 2.0 * 3.0")).toBe(15); // (10.0 / 2.0) * 3.0 = 15
        expect(parse("5.3 * 2.5 / 1.0")).toBe(13.25); // (5.3 * 2.5) / 1.0 = 13.25
        expect(parse("8.8 / 4.7 * 2.0")).toBeCloseTo(3.744680851); // (8.8 / 4.7) * 2.0 = 3.744680851
        expect(parse("12.0 * 3.5 / 2.0")).toBe(21); // (12.0 * 3.5) / 2.0 = 21
        expect(parse("9.0 / 3.4 * 1.5")).toBeCloseTo(3.970588235); // (9.0 / 3.4) * 1.5 = 3.970588235
        expect(parse("7.5 * 2.0 / 5.0")).toBe(3); // (7.5 * 2.0) / 5.0 = 3
    });
    test('should handle only exponentiation with correct precedence', () => {
        expect(parse("2.0 ** 3.0 ** 2.0")).toBe(512); // 2.0 ** (3.0 ** 2.0) = 2.0 ** 9.0 = 512
        expect(parse("3.0 ** 2.0 ** 2.0")).toBe(81); // 3.0 ** (2.0 ** 2.0) = 3.0 ** 4.0 = 81
        expect(parse("2.0 ** 3.3")).toBeCloseTo(9.849); // 2.0 ** 3.3 = 9.849
        expect(parse("5.0 ** 2.5")).toBeCloseTo(55.901699437); // 5.0 ** 2.5 = 55.901699437
        expect(parse("10.0 ** 1.5")).toBeCloseTo(31.6227766017); // 10.0 ** 1.5 = 31.6227766017
        expect(parse("4.4 ** 3.0")).toBe(85.18400000000003); // 4.4 ** 3.0 = 85.18400000000003
        expect(parse("6.0 ** 2.0")).toBe(36); // 6.0 ** 2.0 = 36
    });
    test('should handle mixed operations with correct precedence', () => {
        expect(parse("1.5 + 2.3 * 4.0")).toBe(10.7); // 1.5 + (2.3 * 4.0) = 10.7
        expect(parse("10.0 - 6.0 / 2.0")).toBe(7);
        expect(parse("5.5 * 2.0 + 3.0")).toBe(14); // (5.5 * 2.0) + 3.0 = 14
        expect(parse("1.5 + 2.3 * 4.0")).toBe(10.7); // 1.5 + (2.3 * 4.0) = 10.7
        expect(parse("10.0 - 6.0 / 2.0")).toBe(7); // 10.0 - (6.0 / 2.0) = 7
        expect(parse("5.5 * 2.0 + 3.0")).toBe(14); // (5.5 * 2.0) + 3.0 = 14
        expect(parse("1.5 + 2.3 * 4")).toBe(10.7); // 1.5 + (2.3 * 4) = 10.7
        expect(parse("10.0 - 6.0 / 2")).toBe(7); // 10.0 - (6.0 / 2) = 7
        expect(parse("5.5 * 2 + 3.0")).toBe(14); // (5.5 * 2) + 3.0 = 14
    });
});