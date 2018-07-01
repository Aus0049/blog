/**
 * Created by Aus on 2018/6/29.
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    if(!root || root.val === null) return [];
    var result = [];

    ergodic(root);

    function ergodic (node) {
        if(node.val) result.push(node.val);

        if(node.left) ergodic(node.left);

        if(node.right) ergodic(node.right);
    }

    return result;
};

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(!root || root.val === null) return [];
    var result = [];

    ergodic(root, 0);

    function ergodic (node, level) {
        if(!result[level]) result[level] = [];

        if(node.val !== null) result[level].push(node.val);

        if(node.left) ergodic(node.left, level + 1);

        if(node.right) ergodic(node.right, level + 1);
    }

    return result;
};

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if (!root) return 0;
    const left = maxDepth(root.left);
    const right = maxDepth(root.right);
    return Math.max(left, right) + 1;
};

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
var isSymmetric = function(root) {
    if(!root) return true;

    function isMirror (left, right) {
        if(!left && !right) return true;

        if(!left || !right || left.val !== right.val) return false;

        return isMirror(left.left, right.right) && isMirror(left.right, right.left);
    }

    return isMirror(root, root);
};

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {boolean}
 */
var obj = {
    val: 1,
    left: {
        val: -2,
        left: {
            val: 1,
            left: {
                val: -1,
                left: null,
                right: null
            },
            right: null
        },
        right: {
            val: 3,
            left: null,
            right: null
        }
    },
    right: {
        val: -3,
        left: {
            val: -2,
            left: null,
            right: null
        },
        right: null
    }
};

var hasPathSum = function(root, sum) {
    if(!root) return false;

    function ergodic (node, summary) {

        if(!node.left && !node.right) {
            if(summary === node.val){
                return true;
            }
            return false;
        }

        return (node.left ? ergodic(node.left, summary - node.val) : false) ||
            (node.right ? ergodic(node.right, summary - node.val) : false);
    }

    return ergodic(root, sum);
};

hasPathSum(obj, 3);

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
    var cur = postorder[postorder.length-1];
    var curIndex = inorder.indexOf(cur);
    var leftTreeInorder = inorder.splice(0, curIndex);
    var reightTreeInorder = inorder.splice(curIndex, inorder.length-1);
    var leftTreePostorder = postorder.splice(0, leftTreeInorder.length);
    var rightTreePostoder = postorder.splice(leftTreeInorder.length-1, postorder.length-1);
    var node = {val: cur};

    if(leftTreeInorder.length > 0){
        node.left = buildTree(leftTreeInorder, leftTreePostorder);
    } else {
        node.left = null;
    }

    if(reightTreeInorder.length > 0){
        node.right = buildTree(reightTreeInorder, rightTreePostoder);
    } else {
        node.right = null;
    }

    return node;
};

buildTree(
    [9,3,15,20,7],
    [9,15,7,20,3]
);
