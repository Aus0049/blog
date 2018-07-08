/**
 * Created by Aus on 2018/7/8.
 */
/**
 * Initialize your data structure here.
 */
var MyHashSet = function() {
    this.list = [];
};

/**
 * @param {number} key
 * @return {void}
 */
MyHashSet.prototype.add = function(key) {
    if(key < 1 || key > 10000) return;

    this.list[parseInt(key/10000)*1000 + key%1000] = key;
};

/**
 * @param {number} key
 * @return {void}
 */
MyHashSet.prototype.remove = function(key) {
    if(key < 1 || key > 10000) return;

    this.list[parseInt(key/10000)*1000 + key%1000] = undefined;
};

/**
 * Returns true if this set did not already contain the specified element
 * @param {number} key
 * @return {boolean}
 */
MyHashSet.prototype.contains = function(key) {
    if(key < 1 || key > 10000) return false;

    return this.list[parseInt(key/10000)*1000 + key%1000] !== undefined ? true : false;
};

/**
 * Your MyHashSet object will be instantiated and called as such:
 * var obj = Object.create(MyHashSet).createNew()
 * obj.add(key)
 * obj.remove(key)
 * var param_3 = obj.contains(key)
 */

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    var hasDuplicate = false;
    var hasSet = [];

    for(var i = 0; i < nums.length; i++){
        if(hasSet[nums[i]]){
            hasDuplicate = true;
            hasSet[nums[i]]++;
            continue;
        }

        hasSet[nums[i]] = 1;
    }


    return hasDuplicate;
};

/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
    var tmp;

    while (n !== 1) {
        tmp = 0;
        while (n > 0) {
            var digit = Math.pow(n % 10, 2);
            tmp += digit;
            n = Math.floor(n / 10);

            if (digit === n && digit !== 1) {
                return false;
            }
        }

        n = tmp;
    }

    return true;
};