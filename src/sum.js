module.exports = { sum, sumList }

function sum(a, b) {
    if (b < 0) return a
    return a + b
}

function sumList(input = []) {
    let sum = 0;
    for (var i = 0; i < input.length; i++) {
        if (input[i] > 0) {
            sum += input[i]
        }
    }
    return sum;
}

