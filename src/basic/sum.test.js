const { sum, sumList } = require('./sum')


test('adding 1 and 2 should return 3', () => {
    expect(sum(1, 2)).toBe(3)
})

test('adding negative number as second arg returns first arg', () => {
    expect(sum(3, -4)).toBe(3)
})

test('adding a list of numbers', () => {
    const result = sumList([1, 2, 3, 4, 5, 6])
    expect(result).toBe(21)
})

test('adding a list of number to ignore negative number', () => {
    const result = sumList([1, -2, 3, -4, 5, 6])
    expect(result).toBe(15)
})