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

