/**
 * Created by Aus on 2018/7/12.
 */
/**
 * 1. 直接插入排序
 * 时间复杂度O（n^2）
 * */
function straightInsertionSort (arr) {
    var result = [];

    for(var i = 0; i < arr.length; i++){
        var target = arr[i];
        var index = 0;

        for(var j = 0; j < result.length; j++){
            if(target > result[j]) {
                index++;
            }
        }

        result.splice(index, 0, target);
    }

    return result;
}

straightInsertionSort([4,21,3,21,24,12,56,2,11,33]);

/**
 * 2. 希尔排序
 * 时间复杂度O（nlogn）
 * */
function shellSort (arr) {
    var gap = Math.floor(arr.length / 2);

    while(gap > 0){
        for(var i = gap;i < arr.length;i++){
            var j,temp = arr[i];

            for(j = i-gap;j >= 0 && temp < arr[j]; j = j-gap){
                arr[j+gap] = arr[j];
            }

            arr[j+gap] = temp;
        }
        console.log("gap="+gap);
        console.log(arr);
        gap=Math.floor(gap/2);
    }
}

shellSort([4,21,3,21,24,12,56,2,11,33]);

/**
 * 3. 冒泡排序
 * 时间复杂度O（n^2）
 * */

function bubbleSort (arr) {
    var length = arr.length;

    while (length > 1) {
        for(var i = 0; i < length; i++){
            if(arr[i] > arr[i+1]){
                var temp = arr[i+1];
                arr[i+1] = arr[i];
                arr[i] = temp;
            }
        }
        length--;
    }

    return arr;
}

bubbleSort([4,21,3,21,24,12,56,2,11,33]);

/**
 * 3. 快速排序
 * 时间复杂度O（nlogn）
 * */

function quickSort (arr) {
    if(arr.length <= 1) return arr;

    var pivotIndex = Math.floor(arr.length/2);
    var pivot = arr[pivotIndex];
    var left = [];
    var right = [];

    for(var i = 0; i < arr.length; i++){
        if(i === pivotIndex) continue;

        if(arr[i] <= pivot){
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return quickSort(left).concat(pivot, quickSort(right));
}

quickSort([4,21,3,21,24,12,56,2,11,33]);