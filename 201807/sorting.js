/**
 * Created by Aus on 2018/7/12.
 */
/**
 * 1. 插入排序
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
 * 4. 快速排序
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

/**
 * 5. 选择排序
 * 时间复杂度O（n^2）
 * */

function selectionSort (arr) {

    for(var i = 0; i < arr.length - 1; i++){
        var min = arr[i];

        for(var j = i + 1; j < arr.length; j++){
            if(arr[j] < min) {
                var temp = min;
                min = arr[j];
                arr[j] = temp;
            }
        }

        arr[i] = min;
    }

    return arr;
}

selectionSort([4,21,3,21,24,12,56,2,11,33]);

/**
 * 6. 堆排序
 * 时间复杂度O（nlogn）
 * */

function heapSort(array) {
    //建堆
    var heapSize = array.length, temp;
    for (var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
        heapify(array, i, heapSize);
    }
    //堆排序
    for (var j = heapSize - 1; j >= 1; j--) {
        temp = array[0];
        array[0] = array[j];
        array[j] = temp;
        heapify(array, 0, --heapSize);
    }
    return array;
}
function heapify(arr, x, len) {
    var l = 2 * x + 1, r = 2 * x + 2, largest = x, temp;
    if (l < len && arr[l] > arr[largest]) {
        largest = l;
    }
    if (r < len && arr[r] > arr[largest]) {
        largest = r;
    }
    if (largest != x) {
        temp = arr[x];
        arr[x] = arr[largest];
        arr[largest] = temp;
        heapify(arr, largest, len);
    }
}
heapSort([4,21,3,21,24,12,56,2,11,33]);

/**
 * 6. 堆排序
 * 时间复杂度O（nlogn）
 * */

function mergeSort(arr) {
    if(arr.length <=1) return arr;
    var middle = Math.floor(arr.length / 2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right){
    var result = [];
    while(left.length > 0 && right.length > 0){
        if(left[0] < right[0]){
            result.push(left.shift());
        }else{
            result.push(right.shift());
        }
    }
    return result.concat(left, right);
}

mergeSort([4,21,3,21,24,12,56,2,11,33]);

/**
 * 7. 基数排序
 * 时间复杂度O（n*k）
 * */
function radixSort(array) {
    var max = Math.max.apply(0, array),
        times = getLoopTimes(max),
        len = array.length;
    msdRadixSort(array, len, times);
    return array;
}

//或者这个
function getBucketNumer(num, i) {
    return Math.floor((num / Math.pow(10, i)) % 10);
}
//获取数字的位数
function getLoopTimes(num) {
    var digits = 0;
    do {
        if (num > 1) {
            digits++;
        } else {
            break;
        }
    } while ((num = num / 10));
    return digits;
}
function msdRadixSort(array, len, radix) {
    var buckets = [[], [], [], [], [], [], [], [], [], []];
    //入桶
    for (let i = 0; i < len; i++) {
        let el = array[i];
        let index = getBucketNumer(el, radix);
        buckets[index].push(el);
    }
    //递归子桶
    for (let i = 0; i < 10; i++) {
        let el = buckets[i];
        if (el.length > 1 && radix - 1) {
            msdRadixSort(el, el.length, radix - 1);
        }
    }
    var k = 0;
    //重写原桶
    for (let i = 0; i < 10; i++) {
        let bucket = buckets[i];
        for (let j = 0; j < bucket.length; j++) {
            array[k++] = bucket[j];
        }
        bucket.length = 0;
    }
}
var arr = radixSort([170, 45, 75, 90, 802, 2, 24, 66]);