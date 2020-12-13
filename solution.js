// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range
// includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100,
// 201)

var assert = require('assert');

// Taken from stack overflow to replace a character in a string at a certain index.
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
     * Checks if RANGE is valid.
     * @param {Array<number>} range - range to check
     * @return {undefined} true if range is valid.
     */
    isValidRange(range) {
        return range[1] >= range[0]; 
    }


    /**
     * Returns true if r1 is immediately to the right of r2.
     * for example, r2 = [1,2] and r1=[2,3]
     * @param {*} r1 
     * @param {*} r2 
     */
    immediatelyToTheRightOf(r1, r2) {
        return r2[1] == r1[0];
    }

    /**
     * Returns true if r1 is immediately to the left of r2
     * @param {*} r1 
     * @param {*} r2 
     */
    immediatelyToTheLeftOf(r1, r2) {
        return r2[0] == r1[1];
    }

    /**
     * Checks if r1 is completely to the left of r2 and shares no union.
     * @param {Array<number>} r1 - first range
     * @param {Array<number>} r2 - second range
     * @return {boolean} true if r1 is completely to the left of r2 and shares no union
     * @raise assertionError if either r1 or r2 are invalid ranges
     */
    toTheLeftOf(r1, r2) {
        assert("Invalid ranges", this.isValidRange(r1) && this.isValidRange(r2));
        if (r1[1] == r1[0] || r2[1] == r2[0]) return true;
        return r1[0] < r2[0] 
                && r1[0] < r2[1] 
                && r1[1] <= r2[0]
                && r1[1] <= r2[1];
    }

    /**
     * Checks if r1 is completely to the right of r2 and shares no union.
     * @param {Array<number>} r1  - first range
     * @param {Array<number>} r2  - second range
     * @return {boolean} true if r1 is completely to the left of r2 and shares no union
     * @raise assertionError if either r1 or r2 are invalid ranges
     */
    toTheRightOf(r1, r2) {
        assert("Invalid ranges", this.isValidRange(r1) && this.isValidRange(r2));
        return this.toTheLeftOf(r2, r1);
    }

    /**
     * Checks if r1 has an intersection of at least 1 number with r2 on r1's leftmost side.
     * @param {*} r1 
     * @param {*} r2 
     * @return {boolean} true if r1 has an intersection of at least 1 number
     * @raise assertionError if either r1 or r2 are invalid ranges
     */
    hasLeftSubset(r1, r2) {
        assert("Invalid ranges", this.isValidRange(r1) && this.isValidRange(r2));
        return r2[0] <= r1[0] && r2[0] < r1[1] && r2[1] - 1 >= r1[0] && r2[1] <=r1[1];
    }

    /**
     * Checks if r1 has an intersection of at least 1 number with r2 on r1's rightmost side.
     * @param {*} r1 
     * @param {*} r2 
     * @return {boolean} true if r1 has an intersection of at least 1 number
     * @raise assertionError if either r1 or r2 are invalid ranges
     */
    hasRightSubset(r1, r2) {
        assert("Invalid ranges", this.isValidRange(r1) && this.isValidRange(r2));
        return r1[1] > r2[0] && r1[1] - 1 < r2[1] && r1[0] <= r2[0] && r1[0] <= r2[1];
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
    * Adds RANGETOADD to our rangeList by inserting RANGETOADD into the correct position.
    * Does nothing if RANGETOADD is invalid.
    * Runtime: O(n)
    * @param {Array<number>} rangeToAdd - Array of two integers that specify the range to add
    */
    add(rangeToAdd) {
         
        if (!this.isValidRange(rangeToAdd)) return;
        if (rangeToAdd[0] == rangeToAdd[1]) return;
        if (this.currentRanges.length == 0) {
            this.currentRanges.push(rangeToAdd);
            return;
        }
        // Try to find where I can insert range into currentRanges
        const firstValue = rangeToAdd[0];
        const secondValue = rangeToAdd[1];
        let prev = undefined;
        for (let i = 0; i < this.currentRanges.length; i ++) {
            let currSubRange = this.currentRanges[i];
            // Situation where we can add to the left of currSubRange
            if (prev == undefined && this.toTheLeftOf(rangeToAdd, currSubRange)) {
                this.currentRanges.splice(i, 0, rangeToAdd);
                return;
            }
            // Check if range is contained in currSubrange
            if (firstValue >= currSubRange[0] && secondValue <= currSubRange[1]) {
                return;
            }
            // Check if range is to the rightOfcurrSubRange
            if (this.hasRightSubset(rangeToAdd, currSubRange) || this.immediatelyToTheRightOf(currSubRange, rangeToAdd)) {
                let newRange = [firstValue, currSubRange[1]];
                this.currentRanges[i] = newRange;
                this.fixCurrentRangeToRightOf(i);
                return;
            }
            // Check if range has a left subset
            if (this.hasLeftSubset(rangeToAdd, currSubRange) || this.immediatelyToTheLeftOf(currSubRange, rangeToAdd)) {
                let newRange =  [currSubRange[0], secondValue];
                this.currentRanges[i] = newRange;
                this.fixCurrentRangeToRightOf(i);
                return;
            }

            if (firstValue <= currSubRange[0] && currSubRange[1] <= secondValue) {
                this.currentRanges[i] = rangeToAdd;
                this.fixCurrentRangeToRightOf(i);
                return;
            }
            prev = currSubRange;
        }

        this.currentRanges.push(rangeToAdd);
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
        if (!this.isValidRange(range)) return;
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
                // leftRangeToRemoveIndex ++;
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
            let chippedRanges = this.splitRange(range[1] - 1, this.currentRanges[rightRangeToRemoveIndex]);
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


    toString() {
        let newRanges = this.currentRanges.map(e => {
            return `[${e[0]}, ${e[1]})`;
        }); 
        return newRanges.join(" ");
    }

    /**
    * Prints out the toString list of ranges in the range list.
    */
    print() {
        console.log(this.toString());
    }
}

module.exports = RangeList;
// My tests