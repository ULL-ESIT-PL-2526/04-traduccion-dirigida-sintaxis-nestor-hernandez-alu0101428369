const { parse } = require('../src/index.js');

describe('Parser Failing Tests Parentheses', () => {
    test('should handle parentheses with correct precedence with sum and subtraction', () => {
        expect(parse("(1 + 2) - 3")).toBe(0); // (1 + 2) - 3 = 0
        expect(parse("10 - (3 + 2)")).toBe(5); // 10 - (3 + 2) = 5
        expect(parse("(5 + 4) - 1")).toBe(8); // (5 + 4) - 1 = 8
        expect(parse("1 + (2 - 3)")).toBe(0); // 1 + (2 - 3) = 0
        expect(parse("(5 + 2) - 1")).toBe(6); // (5 + 2) - 1 = 6
        expect(parse("20 - (5 + 3)")).toBe(12); // 20 - (5 + 3) = 12
        expect(parse("(15 + 4) - 2")).toBe(17); // (15 + 4) - 2 = 17
    });
    test('should handle parentheses with correct precedence with multiplication and division', () => {
        expect(parse("(2 * 3) / 4")).toBe(1.5); // (2 * 3) / 4 = 1.5
        expect(parse("10 / (2 * 3)")).toBeCloseTo(1.6666666667); // 10 / (2 * 3) = 10 / 6 = 1.6666666667
        expect(parse("(5 * 2) / 1")).toBe(10); // (5 * 2) / 1 = 10
        expect(parse("8 / (4 * 2)")).toBe(1); // 8 / (4 * 2) = 8 / 8 = 1
        expect(parse("(12 * 3) / 2")).toBe(18); // (12 * 3) / 2 = 36 / 2 = 18
        expect(parse("9 / (3 * 1.5)")).toBe(2); // 9 / (3 * 1.5) = 9 / 4.5 = 2
        expect(parse("(7 * 2) / 5")).toBe(2.8); // (7 * 2) / 5 = 14 / 5 = 2.8
    });
    test('should handle parentheses with correct precedence with exponentiation', () => {
        expect(parse("(2 ** 3) ** 2")).toBe(64); // (2 ** 3) ** 2 = 8 ** 2 = 64
        expect(parse("3 ** (2 ** 2)")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
        expect(parse("(2 ** 3) + 1")).toBe(9); // (2 ** 3) + 1 = 8 + 1 = 9
        expect(parse("3 + (2 ** 4)")).toBe(19); // 3 + (2 ** 4) = 3 + 16 = 19
        expect(parse("(2 * 3) ** 2")).toBe(36); // (2 * 3) ** 2 = 6 ** 2 = 36
        expect(parse("10 - (2 ** 3)")).toBe(2); // 10 - (2 ** 3) = 10 - 8 = 2
    });
    test('should handle nested parentheses with correct precedence', () => {
        expect(parse("((1 + 2) * 3) - 4")).toBe(5); // ((1 + 2) * 3) - 4 = (3 * 3) - 4 = 9 - 4 = 5
        expect(parse("(10 - (3 + 2)) * 4")).toBe(20); // (10 - (3 + 2)) * 4 = (10 - 5) * 4 = 5 * 4 = 20
        expect(parse("((5 * 2) + 1) / 3")).toBe(3.6666666666666665); // ((5 * 2) + 1) / 3 = (10 + 1) / 3 = 11 / 3
        expect(parse("1 + (2 * (3 - 4))")).toBe(-1); // 1 + (2 * (3 - 4)) = 1 + (2 * -1) = 1 - 2 = -1
        expect(parse("((5 + 2) * (3 - 1)) / 2")).toBe(7); // ((5 + 2) * (3 - 1)) / 2 = (7 * 2) / 2 = 14 / 2 = 7
        expect(parse("20 - ((5 + 3) * (2 - 1))")).toBe(12); // 20 - ((5 + 3) * (2 - 1)) = 20 - (8 * 1) = 20 - 8 = 12
        expect(parse("(15 + (4 * 2)) - (2 ** 3)")).toBe(15); // (15 + (4 * 2)) - (2 ** 3) = (15 + 8) - 8 = 23 - 8 = 15  
    });
});

