/**
 * Created by Aus on 2018/7/13.
 */

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    var profit = 0;

    for(var i = 1; i < prices.length; i++){
        if(prices[i] > prices[i-1]) {
            profit += prices[i] - prices[i-1];
        }
    }

    return profit;
};

maxProfit([7,1,5,3,6,4]);

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for(var i = 0; i < nums.length; i++){
        for(var j = i+1; j<nums.length; j++){
            if(nums[i] + nums[j] === target){
                return [i, j];
            }
        }
    }

    return [];
};

twoSum([2, 7, 11, 15], 9);

/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    var m=matrix.length;
    var n=matrix[0].length;
    for(var i=0;i<m;i++) {
        for(var j=m-1;j>=0;j--) {
            matrix[i].push(matrix[j][i]);
        }
    }
    for(var j=0;j<m;j++){
        matrix[j].splice(0,n);
    }
};

rotate([
    [1,2,3],
    [4,5,6],
    [7,8,9]
]);

// [
//     [7,4,1],
//     [8,5,2],
//     [9,6,3]
// ]