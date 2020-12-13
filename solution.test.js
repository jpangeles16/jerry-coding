const RangeList = require('./solution');

test('isValidRange test', () => {
    let rl = new RangeList();
    expect(rl.isValidRange([1,2])).toBe(true);
    expect(rl.isValidRange([2,2])).toBe(true);
    expect(rl.isValidRange([2,1])).toBe(false);
});

test('toTheLeftOfTest', () => {
    let rl = new RangeList();
    expect(rl.toTheLeftOf([1,2],[2,3])).toBe(true);
    expect(rl.toTheLeftOf([2,2],[2,3])).toBe(true);
    expect(rl.toTheLeftOf([1,6],[2,3])).toBe(false);
    expect(rl.toTheLeftOf([5,7],[6,8])).toBe(false);
})

test('hasLeftSubsetTest', () => {
    let rl = new RangeList();
    expect(rl.hasLeftSubset([2,3],[1,3])).toBe(true);
    expect(rl.hasLeftSubset([2,3],[1,2])).toBe(false);
    expect(rl.hasLeftSubset([5,10],[-1,2])).toBe(false);

})

// Basic test Jerry provided me.
test('basic Test', () => {
    rl = new RangeList();
    rl.add([1, 5]);
    expect(rl.toString()).toBe('[1, 5)');
    rl.add([10, 20]);
    // Should display: [1, 5) [10, 20)
    expect(rl.toString()).toBe('[1, 5) [10, 20)');
    
    rl.add([20, 21]);
    // Should display: [1, 5) [10, 21)
    expect(rl.toString()).toBe('[1, 5) [10, 21)');
    rl.add([2, 4]);
    // Should display: [1, 5) [10, 21)
    expect(rl.toString()).toBe('[1, 5) [10, 21)');
    rl.add([3, 8]);
    // Should display: [1, 8) [10, 21)
    expect(rl.toString()).toBe('[1, 8) [10, 21)');
    rl.remove([10, 10]);
    // Should display: [1, 8) [10, 21)
    expect(rl.toString()).toBe('[1, 8) [10, 21)');
    rl.remove([10, 11]);
    // Should display: [1, 8) [11, 21)
    expect(rl.toString()).toBe('[1, 8) [11, 21)');
    rl.remove([15, 17]);
    // Should display: [1, 8) [11, 15) [17, 21)
    expect(rl.toString()).toBe('[1, 8) [11, 15) [17, 21)');
    rl.remove([3, 19]);
    // Should display: [1, 3) [19, 21)
    expect(rl.toString()).toBe('[1, 3) [19, 21)');
});

test('second custom test', () => {
    let rl = new RangeList();
    rl.add([-20, -19]);
    rl.add([3,4]);
    rl.add([5,6]);
    rl.add([7,8]);
    rl.add([9,10]);
    expect(rl.toString()).toBe('[-20, -19) [3, 4) [5, 6) [7, 8) [9, 10)')
    rl.add([0,7]);
    rl.add([-19, -6]);
    expect(rl.toString()).toBe('[-20, -6) [0, 8) [9, 10)');
    rl.remove([-8,-1]);
    expect(rl.toString()).toBe('[-20, -8) [0, 8) [9, 10)');
    rl.remove([1,3]);
    expect(rl.toString()).toBe('[-20, -8) [0, 1) [3, 8) [9, 10)')
    rl.remove([3,4]);
    expect(rl.toString()).toBe('[-20, -8) [0, 1) [4, 8) [9, 10)')
    debugger;
    rl.remove([0,6]);
    expect(rl.toString()).toBe('[-20, -8) [6, 8) [9, 10)')
    rl.remove([6, 9]);
    expect(rl.toString()).toBe('[-20, -8) [9, 10)')
    rl.add([-8,9]);
    expect(rl.toString()).toBe('[-20, 10)')

});

test('third custom test', () => {
    let rl = new RangeList();
    rl.add([-20, -19]);
    rl.add([3,4]);
    rl.add([5,6]);
    rl.add([7,8]);
    rl.add([9,10]);
    expect(rl.toString()).toBe('[-20, -19) [3, 4) [5, 6) [7, 8) [9, 10)')
    rl.add([-19, 9]);
    expect(rl.toString()).toBe('[-20, 10)');
});

test('fourth custom test', () => {
    let rl = new RangeList();
    rl.add([-20, -19]);
    rl.add([9,10]);
    rl.add([-19, 10]);
    expect(rl.toString()).toBe('[-20, 10)');
});

test('fifth custom test', () => {
    let rl = new RangeList();
    rl.add([-20, -19]);
    rl.add([3,4]);
    rl.add([5,6]);
    rl.add([7,8]);
    rl.add([9,10]);
    expect(rl.toString()).toBe('[-20, -19) [3, 4) [5, 6) [7, 8) [9, 10)');
    rl.remove([-100,100]);
    expect(rl.toString()).toBe('');
});

test('basic test', () => {
    let rl = new RangeList();
    rl.remove([-1,1]);
    expect(rl.toString()).toBe('');
    rl.add
});

// expect(rl.toString());
// // Should display: [1, 5)
// rl.add([10, 20]);
// rl.print();
// // Should display: [1, 5) [10, 20)
// rl.add([20, 20]);
// rl.print();
// // Should display: [1, 5) [10, 20)
// rl.add([20, 21]);
// rl.print();
// // Should display: [1, 5) [10, 21)
// rl.add([2, 4]);
// rl.print();
// // Should display: [1, 5) [10, 21)
// rl.add([3, 8]);
// rl.print();
// // Should display: [1, 8) [10, 21)
// rl.remove([10, 10]);
// rl.print();
// // Should display: [1, 8) [10, 21)
// rl.remove([10, 11]);
// rl.print();
// // Should display: [1, 8) [11, 21)
// rl.remove([15, 17]);
// rl.print();
// // Should display: [1, 8) [11, 15) [17, 21)
// rl.remove([3, 19]);
// rl.print();
// // Should display: [1, 3) [19, 21)


// Former tests
// Example run



