/**
 * Created by Aus on 2018/6/27.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var dominantIndex = function(nums) {
    var maxVal = 0, maxIndex = 0, secondMaxVal = 0;

    nums.map(function (item, index) {

        if(item >= maxVal){
            secondMaxVal = maxVal;
            maxVal = item;
            maxIndex = index;

        } else if (item > secondMaxVal)  {
            secondMaxVal = item;
        }
    });

    if(maxVal >= secondMaxVal * 2) {
        return maxIndex;
    }

    return -1;
};

/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
    var last = digits[digits.length - 1];

    digits[digits.length - 1] += 1;

    if(digits[digits.length - 1] === 10) {
        carry(digits, digits.length - 1);
    }

    return digits;
};

function carry (array, index) {
    array[index] = 0;

    if(!array[index - 1]){

        array.unshift(1);
        return;
    }

    array[index - 1] += 1;

    if(array[index - 1] === 10){
        carry(array, index - 1);
    }
}

/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
    var len = matrix.length;
    if(len===0) return [];
    var len2 = matrix[0].length, len3=len*len2, res=[];
    var i=0, j=0, k=0;
    var i1=0, i2=len-1, j1=0, j2=len2-1; //current boundaries
    var h=1, v=0; //horizontal and vertical directions to start with
    while(k<len3){
        res.push(matrix[i][j]);
        k++;
        i+=v;
        j+=h;
        //reach the upper right point, set direction down
        if(i===i1 && j===j2+1){
            j--;
            i++;
            i1++;
            v=1;
            h=0;
        }
        //reach the lower right point, set direction left
        else if(i===i2+1 && j===j2){
            i--;
            j--;
            j2--;
            v=0;
            h=-1;
        }
        //reach the lower left point, set direction up
        else if(i===i2 && j===j1-1){
            j++;
            i--;
            i2--;
            v=-1;
            h=0;
        }
        //reach the upper left point, set direction right
        else if(i===i1-1 && j===j1){
            i++;
            j++;
            j1++;
            v=0;
            h=1;
        }
    }
    return res;
}

/**
 *
 *
 * [
    [1],
    [1,1],
    [1,2,1],
    [1,3,3,1],
    [1,4,6,4,1]
 * ]

 */

/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    if(numRows === 0) return [];

    if(numRows === 1) return [[1]];

    if(numRows === 2) return [[1], [1,1]];

    var result = [
        [1],
        [1,1]
    ];

    for(var i = 2; i < numRows; i++){
        var temp = [];

        for(var j = 0; j <= i; j++){

            if(j === 0){
                temp.push(1);
                continue;
            }

            if(j === i){
                temp.push(1);
                continue;
            }

            temp.push(result[i-1][j-1] + result[i-1][j]);
        }

        result.push(temp);
    }

    return result;
};

/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function(a, b) {
    // 2 -> 10
    var result = parseInt(a, 2) + parseInt(b, 2);
    // 10 -> 2
    return result.toString(2);
};

/**
 * 字符串判断位置的经典方法
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    var i = 0, j = 0;

    while (i < haystack.length && j < needle.length) {
        if(haystack[i] === needle[j]) {
            i++;
            j++;
        } else {
            i = i - j + 1;
            j = 0;
        }
    }

    if(j >= needle.length) {
        return i - needle.length;
    }

    return -1;
};

strStr('hello', 'll');

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    var shortest = '';

    for (var i = 0; i < strs.length; i++) {
        if(strs[i].length > shortest.length){
            shortest = strs[i];
        }
    }

    var result = '';
    var j = 0;

    while (shortest[j]) {
        var cur = shortest[j];

        var isNot = false;

        for (var x = 0; x < strs.length; x++) {
            if(isNot) continue;

            if(strs[x][j] !== cur){
                isNot = true;
            }
        }

        if(isNot) break;

        result += cur;
        j++;
    }

    return result;
};

longestCommonPrefix(["flower","flow","flight"]);

/**
 * @param {string} s
 * @return {string}
 */
var reverseString = function(s) {
    var result = "";

    for(var i = s.length-1; i >= 0; i--) {
        result += s[i];
    }

    return result;
};

reverseString('hello');

/**
 * @param {number[]} nums
 * @return {number}
 */
var arrayPairSum = function(nums) {
    var result = 0;
    var temp = [];

    nums.sort(function (a, b) {
        return a - b;
    });

    for(var i = 0; i < nums.length; i++){
        temp.push(nums[i]);

        if((i + 1) % 2 === 0){
            result += Math.min(temp[0], temp[1]);
            temp = [];
        }
    }

    return result;
};

arrayPairSum([-470, 66, -4835, -5623]);

/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    var result = [];

    for(var i = 0; i < numbers.length; i++){
        if(numbers[i] <= target){
            result.push(i);

            for(var j = 0; j < numbers.length; j++) {
                if(j !== i){
                    if(numbers[j] + numbers[i] === target){
                        result.push(j);
                    }
                }
            }

            if(result.length === 1){
                result = [];
            }
        }

        if(result.length === 2){
            break;
        }
    }

    return result;
};

twoSum([2,7,11,15], 9);

/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxConsecutiveOnes = function(nums) {
    var result = [0];

    for(var i = 0; i < nums.length; i++){

        if(nums[i] === 1){
            result[result.length - 1] += 1;
            continue;
        }

        result.push(0);
    }

    return result.sort(function(a,b){return a - b})[result.length - 1];
};

findMaxConsecutiveOnes([1,1,0,1,1,1]);

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    while (k > 0) {
        var temp = nums.pop();
        nums.unshift(temp);
        k--;
    }
};

/**
 * @param {number} rowIndex
 * @return {number[]}
 */
var getRow = function(rowIndex) {
    if(rowIndex === 0) return [1];

    if(rowIndex === 1) return [1, 1];

    var result = [];

    for (var i = 0; i <= rowIndex; i++) {
        result[i] = [];

        for(var j = 0; j <= i; j++){
            if(j === 0 || j === i){
                result[i][j] = 1;
                continue;
            }

            result[i][j] = result[i-1][j-1] + result[i-1][j];
        }
    }

    return result[rowIndex];
};

getRow(3);

/**
 * @param {string} str
 * @returns {string}
 */
var reverseWords = function(str) {
    var result = [];
    var temp = '';
    var length = str.length - 1;

    for(var i = length; i >= 0; i--){
        if(str[i] !== ' '){
            temp = str[i] + temp;
            continue;
        }

        if(temp.length > 0){
            result.push(temp);
        }

        temp = '';
    }

    if(temp.length > 0){
        result.push(temp);
    }

    return result.length ? result.join(' ') : '';
};

reverseWords('the sky is blue');


/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
    var result = [];
    var temp = '';
    var length = s.length - 1;

    for(var i = length; i >= 0; i--){
        if(s[i] !== ' '){
            temp = temp + s[i];
            continue;
        }

        if(temp.length > 0){
            result.unshift(temp);
        }

        temp = '';
    }

    if(temp.length > 0){
        result.unshift(temp);
    }

    return result.length ? result.join(' ') : '';
};

reverseWords("Let's take LeetCode contest");

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    var i = 0;

    while (nums[i] !== undefined && nums[i+1] !== undefined) {
        if(nums[i] === nums[i+1]){
            nums.splice(i, 1);
            continue;
        }

        i++;
    }

    return nums.length;
};

removeDuplicates([0,0,1,1,1,2,2,3,3,4]);

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    var i = 0;
    var movedNum = 0;

    while (nums[i] !== undefined) {

        if(nums[i] === 0){
            nums.splice(i, 1);
            movedNum++;
            continue;
        }

        i++;
    }

    while (movedNum) {
        nums.push(0);
        movedNum--;
    }
};

var testArray = [0,1,0,3,12];

moveZeroes(testArray);