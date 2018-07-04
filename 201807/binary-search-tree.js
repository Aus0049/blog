/**
 * Created by Aus on 2018/7/3.
 */
// 二叉搜索（排序）树
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
// 1. 判断是否是BST
var isValidBST = function(root) {
    if(!root) return true;

    function isValid (node, min, max) {
        if(!node) return true;

        if(node.val <= min || node.val >= max) return false;

        return isValid(node.left, min, node.val) && isValid(node.right, node.val, max);
    }

    return isValid(root, -Infinity, Infinity);
};

/**
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
// 2. 查找二叉搜索树节点
var searchBST = function(root, val) {
    if(!root) return null;

    if(val === root.val) return root;

    if(val < root.val) return searchBST(root.left, val);

    if(val > root.val) return searchBST(root.right, val);
};
/**
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
// 3. 二叉搜索树的插入
var insertIntoBST = function(root, val) {
    if(!root) {
        return new TreeNode(val);
    }

    if(val < root.val) root.left = insertIntoBST(root.left, val);

    if(val > root.val) root.right = insertIntoBST(root.right, val);

    return root;
};
/**
 * @param {TreeNode} root
 * @param {number} key
 * @return {TreeNode}
 */
// 4. 二叉搜索树的删除
var deleteNode = function(root, key) {
    if(!root) return null;

    if(root.val === key) {
        if(!root.left && !root.right) {
            return null;
        }

        if(root.left && root.right){
            var cur = null;
            var next = root.right;

            while (next.left) {
                cur = next;
                next = next.left;
            }

            if(cur !== null) {
                root.val = next.val;
                cur.left = next.right;
                return root;
            }

            next.left = root.left;
            return next;
        }

        if(root.left) return root.left;

        if(root.right) return root.right;
    }

    if(root.val < key) root.right = deleteNode(root.right, key);
    if(root.val > key) root.left= deleteNode(root.left, key);

    return root;
};
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
// 5. 二叉搜索树最小祖先
var lowestCommonAncestor = function(root, p, q) {
    if (root.val < p.val && root.val < q.val) {
        return lowestCommonAncestor(root.right, p, q);
    }  else if (root.val > p.val && root.val > q.val) {
        return lowestCommonAncestor(root.left, p, q);
    }
    return root;
};
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
// 6. 判断是否是平衡二叉树
var isBalanced = function(root) {

    function getDeep (node) {
        if(!node) return 0;

        var leftDeep = getDeep(node.left);
        var rightDeep = getDeep(node.right);

        if(leftDeep === false || rightDeep === false) return false;

        if([-1, 0, 1].indexOf(leftDeep - rightDeep) > -1) {
            return Math.max(leftDeep, rightDeep) + 1;
        }

        return false;
    }

    return getDeep(root) === false ? false : true;
};
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
// 7. 有序数组转二叉搜索树
var sortedArrayToBST = function(nums) {
    if(!nums || nums.length === 0) return null;

    var middle = Math.floor(nums.length/2);
    var root = {
        val: nums[middle],
        left: null,
        right: null
    };

    var leftTree = nums.slice(0, middle);
    var rightTree = nums.slice(middle+1, nums.length);

    root.left = sortedArrayToBST(leftTree);
    root.right = sortedArrayToBST(rightTree);

    return root;
};