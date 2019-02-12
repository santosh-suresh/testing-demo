module.exports = { sum, sumList }

function sum(a, b) {
    if (b < 0) return a
    return a + b
}

function sumList(input = []) {
    return input.reduce((acc, num) => {
        if (num < 0) return acc
        return acc + num;
    }, 0)

    // refactor this    
}

