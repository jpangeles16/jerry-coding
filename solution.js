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

    /**
     * We will represent all of the valid ranges as an array of arrays.
     */
    constructor() {
        this.validRanges = [];
    }

    /**
     * Checks if RANGE is valid.
     * @param {Array<number>} range - range to check
     * @return {boolean} true if range is valid.
     */
    isValidRange(range) {
        return range[1] >= range[0]; 
    }

    /**
     * Returns true if r1 is immediately to the right of r2.
     * For example, this returns true if r2 = [1,2] and r1 = [2,3]
     * because those ranges are 'next' to each other.
     * @param {Array<number>} r1 first range
     * @param {Array<number>} r2 second range
     * @returns {boolean} true if r1 is immediately to the right of r2.
     */
    immediatelyToTheRightOf(r1, r2) {
        return r2[1] == r1[0];
    }

    /**
     * Returns true if r1 is immediately to the left of r2.
     * @param {*} r1 first range
     * @param {*} r2 second range
     */
    immediatelyToTheLeftOf(r1, r2) {
        return r2[0] == r1[1];
    }

    /**
     * Returns true if r1 is completely to the left of r2 and shares no union with it.
     * @param {Array<number>} r1 - first range
     * @param {Array<number>} r2 - second range
     * @return {boolean} true if r1 is completely to the left of r2 and shares no union.
     * @raise assertionError if either r1 or r2 are invalid ranges.
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
     * Returns true if r1 is completely to the right of r2 and shares no union with it.
     * @param {Array<number>} r1  - first range
     * @param {Array<number>} r2  - second range
     * @return {boolean} true if r1 is completely to the right of r2 and shares no union with it.
     * @raise assertionError if either r1 or r2 are invalid ranges
     */
    toTheRightOf(r1, r2) {
        assert("Invalid ranges", this.isValidRange(r1) && this.isValidRange(r2));
        return this.toTheLeftOf(r2, r1);
    }

    /**
     * Returns true if r1 has an intersection of at least 1 number with r2 on r1's leftmost side.
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
     * Returns true if r1 has an intersection of at least 1 number with r2 on r1's rightmost side.
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
     * Returns true if NUMBER is completely out of bounds of RANGE
     * AND is bigger than any number within RANGE.
     * @param {number} number 
     * @param {Array<number>} range 
     * @returns {boolean} true if above.
     */
    numberToTheRightOf(number, range) {
        assert("Invalid ranges", this.isValidRange(range));
        return number >= range[0] && number >= range[1];
    }

    /**
     * Returns true if NUMBER is found within RANGE.
     * @param {number} number 
     * @param {Array<number>} range 
     * @returns true if above.
     */
    numberWithinRange(number, range) {
        assert("Invalid ranges", this.isValidRange(range));
        return number >= range[0] && number < range[1];
    }

    /**
     * Returns true if r1 is a subset of r2.
     * @param {Array<number>} r1 first range
     * @param {Array<number>} r2 second range
     */
    isSubsetOf(r1, r2) {
        return r1[0] >= r2[0] && r1[1] <= r2[1];
    }

    /**
     * Checks and fixes any overlapping ranges starting at INDEX 
     * in this.validRanges by iteratively deleting and/or
     * combining ranges.
     * 
     * Example:
     * this.validRanges = [[2,6],[3,7]]
     * fixCurrentRangeToRightOf(0)
     * this.validRanges = [[2,7]]
     * 
     * The above example fixes our ranges so that none of them are overlapping.
     * @param {number} startingIndex the index that we are starting with. 
     */
    fixOverlappingRanges(startingIndex) {
        let startingRange = this.validRanges[startingIndex];
        let rightMostValue = startingRange[1];
        let i = startingIndex + 1;
        if (startingIndex + 1 >= this.validRanges.length) return;
        while (true) {
            let currRange = this.validRanges[i];
            if (this.numberToTheRightOf(rightMostValue, currRange)) { 
                this.validRanges.splice(i, 1);
            } else if (this.numberWithinRange(rightMostValue, currRange)) {
                let newRight = currRange[1];
                let newLeft = startingRange[0];
                this.validRanges.splice(i - 1, 2, [newLeft, newRight]);
                return;
            } else {
                return;
            }
            if (i == this.validRanges.length) return;
        }
    }

    /**
    * Adds RANGETOADD to our rangeList by using linear search to
    * insert RANGETOADD into the correct position.
    * Does nothing if RANGETOADD is invalid.
    * @param {Array<number>} rangeToAdd - Array of two integers that specify the range to add
    */
    add(rangeToAdd) {
        if (!this.isValidRange(rangeToAdd)) return;
        if (rangeToAdd[0] == rangeToAdd[1]) return;
        if (this.validRanges.length == 0) {
            this.validRanges.push(rangeToAdd);
            return;
        }

        // Try to find where I can insert range into validRanges
        const firstValue = rangeToAdd[0];
        const secondValue = rangeToAdd[1];
        let prevRange = undefined;
        // This for-loop tries to find the proper spot to insert range into validRanges
        for (let i = 0; i < this.validRanges.length; i ++) {
            let currRange = this.validRanges[i];
            // Unique situation where we can add to the left of currRange
            if (prevRange == undefined && this.toTheLeftOf(rangeToAdd, currRange)) {
                this.validRanges.splice(i, 0, rangeToAdd);
                return;
            }
            // Check if rangeToAdd is contained in currRange, just return
            if (this.isSubsetOf(rangeToAdd, currRange)) {
                return;
            }
            // Check if rangeToAdd can be added to the right of currRange.
            if (this.hasRightSubset(rangeToAdd, currRange) || this.immediatelyToTheRightOf(currRange, rangeToAdd)) {
                let newRange = [firstValue, currRange[1]];
                this.validRanges[i] = newRange;
                this.fixOverlappingRanges(i);
                return;
            }
            // Check if rangeToAdd can be added to the left of currRange
            if (this.hasLeftSubset(rangeToAdd, currRange) || this.immediatelyToTheLeftOf(currRange, rangeToAdd)) {
                let newRange =  [currRange[0], secondValue];
                this.validRanges[i] = newRange;
                this.fixOverlappingRanges(i);
                return;
            }
            // Check if our rangeToAdd is a superset of currRange
            if (this.isSubsetOf(currRange, rangeToAdd)) {
                this.validRanges[i] = rangeToAdd;
                this.fixOverlappingRanges(i);
                return;
            }
            prevRange = currRange;
        }
        // We didn't find a spot, so we should just push our new range.
        this.validRanges.push(rangeToAdd);
    }

    /**
     * Returns true if X is contained within RANGE.
     * @param {number} x number that we're checking if it's contained in RANGE
     * @param {Array<number>} range range we're checking 
     */
    isContainedInRange(x, range) {
        if (range[1] - range[0] == 0) {
            return x == range[0];
        }
        return x < range[1] && x >= range[0];
    }

    /**
     * Splits the RANGE based off of NUMBER.
     * @param {*} number number within range we are trying to delete
     * @param {*} range range that we are trying to split
     * @returns {Array<Array<number>>} Returns a null pointer if we have an invalid input.
     * Returns an empty array if the entire interval is deleted: e.g. [1,2) becomes [] since there's only one integer in the range
     * Returns a single array nested within in array if we only chip off the ends of the range: e.g. [1,3) becomes [2,3)
     * Returns two arrays nested within an array otherwise 
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
     * Trims our validRanges so that any range contained in
     * RANGETOREMOVE is deleted. This algorithm only trims 
     * from LEFTINDEX to RIGHTINDEX, and decides whether to delete 
     * or split the ranges at LEFTINDEX and RIGHTINDEX 
     * based off of the REMOVE variables.
     * @param {Array<number>} rangeToRemove the range that we want to remove 
     * @param {boolean} removeBeforeLeftmostRange true if the range we need to delete is before the element at leftIndex
     * @param {boolean} removeWithinLeftmostRange true if the range we need to delete is within the element at leftIndex
     * @param {number} leftIndex index containing potentially the leftmost endpoint of the range we need to delete
     * @param {boolean} removeBeforeRightmostRange true if the range we need to delete is before the element at rightIndex
     * @param {boolean} removeWithinRightmostRange true if the range we need to delete is within the element at rightIndex
     * @param {number} rightIndex index containing potentially the rightmost endpoint of the range we need to delete
     */
    trimValidRanges(rangeToRemove, removeBeforeLeftmostRange, removeWithinLeftmostRange, leftIndex, removeBeforeRightmostRange, removeWithinRightmostRange, rightIndex) {
        // Delete or split the leftmost range
        if (removeBeforeLeftmostRange) {
            this.validRanges.splice(leftIndex, 1);
            rightIndex --;
        } else if (removeWithinLeftmostRange) {
            let splitRanges = this.splitRange(rangeToRemove[0], this.validRanges[leftIndex]);
            // Case where in the process of splitting, we end up deleting the range
            if (splitRanges.length == 0) {
                this.validRanges.splice(leftIndex, 1);
                rightIndex --;
            } else if (splitRanges.length == 1) {
                this.validRanges.splice(leftIndex, 1, splitRanges[0]);
                if (leftIndex == rightIndex) return;
            } else if (leftIndex == rightIndex) {
                let rightChippedRanges = this.splitRange(rangeToRemove[1] - 1, this.validRanges[rightIndex]);
                this.validRanges.splice(leftIndex, 1, splitRanges[0], rightChippedRanges[1]);
                return;
            } else { // Case where we split up one of our valid ranges
                this.validRanges.splice(leftIndex,1,splitRanges[0], splitRanges[1]);
                rightIndex ++;
                leftIndex ++;
            }
        }
        // Trim off any ranges that lie between the left and right endpoints
        while(leftIndex != rightIndex) {
            this.validRanges.splice(leftIndex, 1);
            rightIndex --;
        }
        // Delete or split the rightmost range
        if (leftIndex > rightIndex) return; 
        else if (removeBeforeRightmostRange) return;
        else if (removeWithinRightmostRange) {
            let splitRanges = this.splitRange(rangeToRemove[1] - 1, this.validRanges[rightIndex]);
            if (splitRanges == null) {
                this.validRanges.splice(rightIndex, 1);
            } else if (splitRanges.length == 1) {
                this.validRanges.splice(rightIndex, 1, splitRanges)
            } else {
                this.validRanges.splice(rightIndex, 1, splitRanges[0], splitRanges[1]);
                rightIndex ++;
            }
        }
        // Trim off any ranges that lie between the left and right endpoints
        while(leftIndex != rightIndex) {
            this.validRanges.splice(leftIndex, 1);
            rightIndex --;
        }
    }

    /**
    * Description: 
    * Iteratively remove a range from the list with linear runtime.
    * @param {Array<number>} rangeToRemove - Array of two integers that specify
    beginning and end of range.
    */
    remove(rangeToRemove) {
        if (this.validRanges.length == 0) return;
        if (!this.isValidRange(rangeToRemove)) return;
        if (rangeToRemove[0] == rangeToRemove[1]) return;

        let indexOfLeftmostRangeToRemove = 0;
        let removeBeforeLeft = false;
        let removeWithinLeft = false;

        // Check if the range we need to remove includes elements even before our list of valid ranges
        if (rangeToRemove[0] < this.validRanges[0][0]) {
            removeBeforeLeft = true;
        } else if (this.isContainedInRange(rangeToRemove[0], this.validRanges[0])) {
            removeWithinLeft = true;
        } 

        let prevRange = this.validRanges[0];
        // This for loop tries to mark the index of the leftmost range we need to remove, and breaks if we've found it
        for (let i = 1; i < this.validRanges.length; i ++) {
            let currRange = this.validRanges[i];
            let leftOfCurrRange = [prevRange[1], currRange[0]];
            // We don't need to iterate if we've already found out the leftmost range
            if (removeBeforeLeft || removeWithinLeft) {
                break;
            }
            // Case range to remove is between the previous range and the current range
            if (this.isContainedInRange(rangeToRemove[0], leftOfCurrRange)) {
                indexOfLeftmostRangeToRemove = i;
                removeBeforeLeft = true;
                break;
            }
            // Case where the leftMost range that we have to remove is in a range
            if (this.isContainedInRange(rangeToRemove[0], currRange)) {
                indexOfLeftmostRangeToRemove = i;
                removeWithinLeft = true;
                break;
            }
            prevRange = currRange;
        }

        // Start to find out the last range to delete from here on:
        let indexOfRightmostRangeToRemove = 0;
        let removeBeforeRight = false;
        let removeWithinRight = false;

        // Check if the range we need to remove includes elements even before our list of valid ranges
        if (rangeToRemove[1] <= this.validRanges[0][0]) {
            removeBeforeRight = true;
        } else if (this.isContainedInRange(rangeToRemove[1], this.validRanges[0])) {
            removeWithinRight = true;
        } 

        prevRange = this.validRanges[0];
        // This for loop marks the index of the leftmost range we need to remove, and breaks if we've found it
        for (let i = 1; i < this.validRanges.length; i ++) {
            let currRange = this.validRanges[i];
            let leftOfCurrRange = [prevRange[1], currRange[0]];
            // We don't need to iterate if we've already found out
            if (removeBeforeRight || removeWithinRight) {
                break;
            }
            if (this.isContainedInRange(rangeToRemove[1] - 1, leftOfCurrRange)) {
                indexOfRightmostRangeToRemove = i;
                removeBeforeRight = true;
                break;
            }
            if (this.isContainedInRange(rangeToRemove[1] - 1, currRange)) {
                indexOfRightmostRangeToRemove = i;
                removeWithinRight = true;
                break;
            }
            prevRange = currRange;
        }

        // This is the case where rightMostRange exceeds all of our valid ranges
        if (!(removeBeforeRight || removeWithinRight)) {
            indexOfRightmostRangeToRemove = this.validRanges.length;
        }
        
        this.trimValidRanges(rangeToRemove, removeBeforeLeft, removeWithinLeft,
            indexOfLeftmostRangeToRemove, removeBeforeRight, removeWithinRight, indexOfRightmostRangeToRemove);

    }

    /**
     * For debugging purposes, returns a stringified version of our range
     */
    toString() {
        let newRanges = this.validRanges.map(e => {
            return `[${e[0]}, ${e[1]})`;
        }); 
        return newRanges.join(" ");
    }

    /**
    * Console logs the toString list of ranges in the range list.
    */
    print() {
        console.log(this.toString());
    }
}

module.exports = RangeList;
