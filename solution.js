// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range
// includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100,
// 201)

var assert = require('assert');

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

/*
* NOTE: Feel free to add any extra member variables/functions you like.
*/
class RangeList {
    constructor() {
        this.currentRanges = [];
    }

    /**
     * Checks if leftRange is completely to the left of rightRange
     * @param {Array<number>} leftRange 
     * @param {Array<number>} rightRange 
     */
    toTheLeftOf(leftRange, rightRange) {
        return leftRange[0] < rightRange[0] 
                && leftRange[0] < rightRange[1] 
                && leftRange[1] < rightRange[0]
                && leftRange[1] < rightRange[1];
    }

    /**
     * Checks if rightRange is completely to the right of LeftRange
     * @param {Array<number>} rightRange 
     * @param {Array<number>} leftRange 
     */
    toTheRightOf(rightRange, leftRange) {
        return this.toTheLeftOf(leftRange, rightRange);
    }

    /**
     * Checks if x has a left-most subset with y, and they share a subset together.
     * Example:
     * 
     * x = [2,6]
     * y = [1,3]
     * hasLeftSubset(x, y) == True
     * @param {*} leftRange 
     * @param {*} rightRange 
     */
    hasLeftSubset(x, y) {
        return x[0] >= y[0] && x[0] <= y[1] && x[1] >= y[0] && x[1] >= y[1];
    }

    hasRightSubset(x, y) {
        return this.hasLeftSubset(y, x);
    }

    /**
     * Assuming we've just added a range to currentRanges, 
     * we're going to fix any overlapping elements as a result of combining our array starting
     * at index
     * 
     * Example:
     * currentRanges = [[2,6],[3,7]]
     * fixCurrentRangeToRightOf(5)
     * currentRanges = [[2,7]]
     * @param {number} index 
     */
    fixCurrentRangeToRightOf(index) {
        let startingRange = this.currentRanges[index];
        let right = this.currentRanges[index][1];
        for (let i = index + 1; i < this.currentRanges.length; i ++) {
            let currRange = this.currentRanges[i];
            if (right >= currRange[0] && right >= currRange[1]) {
                this.currentRanges.splice(i, 1);
                i --;
            } else if (right <= currRange[1] && right >= currRange[0]) {
                let newRight = currRange[1];
                let newLeft = startingRange[0];
                this.currentRanges.splice(i, 1);
                i --;
                this.currentRanges[i] = [newLeft, newRight];
            } else {
                return;
            }

        }
    }
    
    /**
    * Adds a range to the list
    * @param {Array<number>} range - Array of two integers that specify
    * beginning and end of range.
    */
    add(range) {
        if (this.currentRanges.length == 0) {
            this.currentRanges.push(range);
            return;
        }
        // Try to find where I can insert range into currentRanges
        const firstValue = range[0];
        const secondValue = range[1];
        let prev = undefined;
        for (let i = 0; i < this.currentRanges.length; i ++) {
            let currSubRange = this.currentRanges[i];
            // Situation where we can add to the left of currSubRange
            if (prev == undefined && this.toTheLeftOf(range, currSubRange)) {
                this.currentRanges.splice(i, 0, range);
                return;
            }
         
            // Check if range is contained in currSubrange
            if (firstValue >= currSubRange[0] && secondValue <= currSubRange[1]) {
                return;
            }

            // Check if range is to the rightOfcurrSubRange
            if (this.hasRightSubset(range, currSubRange)) {
                let newRange = [firstValue, currSubRange[1]];
                this.currentRanges[i] = newRange;
                this.fixCurrentRangeToRightOf(i);
                return;
            }
            // Check if range has a left subset
            if (this.hasLeftSubset(range, currSubRange)) {
                let newRange =  [currSubRange[0], secondValue];
                this.currentRanges[i] = newRange;
                this.fixCurrentRangeToRightOf(i);
                return;
            }

            if (firstValue <= currSubRange[0] && currSubRange[1] <= secondValue) {
                this.currentRanges[i] = range;
                this.fixCurrentRangeToRightOf(i);
                return;
            }
            prev = currSubRange;
        }
        this.currentRanges.push(range);
    }


    isContainedInRange(x, range) {
        if (range[1] - range[0] == 0) {
            return x == range[0];
        }
        return x < range[1] && x >= range[0];
    }

    /**
     * Splits the range based off of number.
     * Returns a null pointer if we have an invalid input.
     * Returns an empty array if the entire interval is deleted.
     * Returns a single array nested within in array if we only chip off the ends of the range
     * Returns two arrays nested within an array otherwise
     * Examples:
     * 11, [10,12) => [10, 11)
     * @param {*} number 
     * @param {*} range 
     */
    splitRange(number, range) {
        assert(this.isContainedInRange(number, range));
        if (range[0] == range[1] && number == range[0]) {
            return null;
        }
        if (range[1] - range[0] == 1 && number == range[0]) {
            return [];
        }
        if (range[1] - 1 == number) {
            return [[range[0], number]];
        }
        if (range[0] == number) {
            return [[range[0] + 1, range[1]]];
        }
        return [[range[0], number], [number + 1, range[1]]]
    }

    /**
    * Description: 
    * Removes a range from the list.
    * 
    * Algorithm:
    * The approach I took was "marking" our list of valid ranges,
    * and then once I find the marks, take measures to split or delete
    * unneccesary ranges.
    * For example, if I had
    * [ -20, -19 ), [ 0, 8 ), [ 9, 10 ),
    * and I had to remove [-20, 2),
    * then I would have to place markers on 
    * the first range [-20, -19) and the second range [0, 8), and
    * would have to delete [-20, -19) and trim the range [0, 8) 
    * 
    * Runtime: 
    * O(n)
    * 
    * Parameters:
    * @param {Array<number>} range - Array of two integers that specify
    beginning and end of range.
    */
    remove(range) {

        if (this.currentRanges.length == 0) return;
        if (range[0] == range[1]) return;

        let leftRangeToRemoveIndex = 0;
        let removeBeforeLeftRange = false;
        let removeWithinLeftRange = false;

        // Check if first element we need to remove is before the range
        if (range[0] < this.currentRanges[0][0]) {
            removeBeforeLeftRange = true;
        } else if (this.isContainedInRange(range[0], this.currentRanges[0])) {
            removeWithinLeftRange = true;
        } 

        let prevRange = this.currentRanges[0];

        // This for loop marks the first range we need to remove, and breaks if we've found it
        for (let i = 1; i < this.currentRanges.length; i ++) {
            let currRange = this.currentRanges[i];
            // We don't need to iterate if we've already found out
            if (removeBeforeLeftRange || removeWithinLeftRange) {
                break;
            }
            if (this.isContainedInRange(range[0], [prevRange[1], currRange[0]])) {
                leftRangeToRemoveIndex = i;
                removeBeforeLeftRange = true;
                break;
            }
            if (this.isContainedInRange(range[0], currRange)) {
                leftRangeToRemoveIndex = i;
                removeWithinLeftRange = true;
                break;
            }
            prevRange = currRange;
        }

        // Double check if we have marked our left range
        if (!(removeBeforeLeftRange || removeWithinLeftRange)) {
            console.log("Error in remove!");
        }

        let rightRangeToRemoveIndex = 0;
        let removeBeforeRightRange = false;
        let removeWithinRightRange = false;
        // Now, we have to find the right range to remove for the right endpoint
        if (range[1] <= this.currentRanges[0][0]) {
            removeBeforeRightRange = true;
        } else if (this.isContainedInRange(range[1], this.currentRanges[0])) {
            removeWithinRightRange = true;
        } 
            
        prevRange = this.currentRanges[0];

        for (let i = 1; i < this.currentRanges.length; i ++) {
            let currRange = this.currentRanges[i];
            // We don't need to iterate if we've already found out
            if (removeBeforeRightRange || removeWithinRightRange) {
                break;
            }
            if (this.isContainedInRange(range[1] - 1, [prevRange[1], currRange[0]])) {
                rightRangeToRemoveIndex = i;
                removeBeforeRightRange = true;
                break;
            }
            if (this.isContainedInRange(range[1] - 1, currRange)) {
                rightRangeToRemoveIndex = i;
                removeWithinRightRange = true;
                break;
            }
            prevRange = currRange;
        }

        if (!(removeBeforeRightRange || removeWithinRightRange)) {
            rightRangeToRemoveIndex = this.currentRanges.length;
        }

        if (removeBeforeLeftRange) {
            this.currentRanges.splice(leftRangeToRemoveIndex, 1);
            rightRangeToRemoveIndex --;
        } else if (removeWithinLeftRange) {
            let chippedRanges = this.splitRange(range[0], this.currentRanges[leftRangeToRemoveIndex]);
            if (chippedRanges.length == 0) {
                this.currentRanges.splice(leftRangeToRemoveIndex, 1);
                rightRangeToRemoveIndex --;
            } else if (chippedRanges.length == 1) {
                this.currentRanges.splice(leftRangeToRemoveIndex,1,chippedRanges[0]);
                if (leftRangeToRemoveIndex == rightRangeToRemoveIndex) {
                    return;
                }
                leftRangeToRemoveIndex ++;
            } else if (leftRangeToRemoveIndex == rightRangeToRemoveIndex) {
                let rightChippedRanges = this.splitRange(range[1] - 1, this.currentRanges[rightRangeToRemoveIndex]);
                this.currentRanges.splice(leftRangeToRemoveIndex,1,chippedRanges[0],rightChippedRanges[1]);
                return;
            } else { // Case where we split up one of our valid ranges
                this.currentRanges.splice(leftRangeToRemoveIndex,1,chippedRanges[0], chippedRanges[1]);
                rightRangeToRemoveIndex ++;
                leftRangeToRemoveIndex ++;
            }
        }

        // Trim off any ranges that lie between the left and right endpoints
        while(leftRangeToRemoveIndex != rightRangeToRemoveIndex) {
            this.currentRanges.splice(leftRangeToRemoveIndex, 1);
            rightRangeToRemoveIndex --;
        }

        if (leftRangeToRemoveIndex > rightRangeToRemoveIndex) {
            return;
        } else if (removeBeforeRightRange) {
            return;
        } else if (removeWithinRightRange) {
            let chippedRanges = this.splitRange(range[1], this.currentRanges[rightRangeToRemoveIndex]);
            if (chippedRanges == null) {
                this.currentRanges.splice(rightRangeToRemoveIndex, 1);
            } else if (chippedRanges.length == 1) {
                this.currentRanges.splice(rightRangeToRemoveIndex,1,chippedRanges)
            } else {
                this.currentRanges.splice(rightRangeToRemoveIndex,1,chippedRanges[0], chippedRanges[1]);
                rightRangeToRemoveIndex ++;
            }
        }

        // Trim off any ranges that lie between the left and right endpoints
        while(leftRangeToRemoveIndex != rightRangeToRemoveIndex) {
            this.currentRanges.splice(leftRangeToRemoveIndex, 1);
            rightRangeToRemoveIndex --;
        }

    }
    /**
    * Prints out the list of ranges in the range list
    */
    print() {
        let newRanges = this.currentRanges.map(e => {
            return `[${e[0]}, ${e[1]})`;
        });
        console.log(newRanges.join(" "));
    }
}

module.exports = RangeList;
// My tests
let rl = new RangeList();
console.log(rl.toTheLeftOf([2,2], [3,4]));
console.log(rl);
rl.add([-20, -19]);
rl.add([3,4]);
rl.add([5,6]);
rl.add([7,8]);
rl.add([9,10]);
console.log(rl);
rl.add([0,7]);
rl.add([-19, -6]);
console.log(rl);
rl.remove([-8,-1]);
console.log(rl);
rl.remove([1,3]);
console.log(rl);
rl.remove([3,4]);
console.log(rl);
rl.remove([0,6]);
console.log(rl);
rl.remove([6, 9]);
console.log(rl.print());

// Former tests
// Example run
rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)
rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)