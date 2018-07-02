/**
 * Created by Aus on 2018/7/2.
 */

// 二叉树常见方法汇总

// 节点
function TreeNode(val) {
     this.val = val;
     this.left = this.right = null;
}

// 1. 前序遍历
function preOrder (root) {
    if(!root) return [];
    var result = [];

    function order (node) {
        // D
        if(node.val) result.push(node.val);
        // L
        if(node.left) order(node.left);
        // R
        if(node.right) order(node.right);
    }

    order(root);

    return result;
}
// 2. 中序遍历
function inOrder (root) {
    if(!root) return [];
    var result = [];

    function order (node) {
        // L
        if(node.left) order(node.left);
        // D
        if(node.val) result.push(node.val);
        // R
        if(node.right) order(node.right);
    }

    order(root);

    return result;
}
// 3. 后序遍历
function postOrder (root) {
    if(!root) return [];
    var result = [];

    function order (node) {
        // L
        if(node.left) order(node.left);
        // R
        if(node.right) order(node.right);
        // D
        if(node.val) result.push(node.val);
    }

    order(root);

    return result;
}
// 4. 宽度优先遍历
function BFS (root) {
    if(!root) return [];
    var result = [];

    function order (node, deep) {
        if(!result[deep]) result[deep] = [];

        if(node.val !== null) result[deep].push(node.val);

        if(node.left) order(node.left, deep+1);

        if(node.right) order(node.right, deep+1);
    }

    order(root, 0);

    return result.reduce(function(total, cur){
        total = total.concat(cur);
    }, []);
}
// 5. 求树的最大深度
function maxDeep (root) {
    if(!root) return 0;

    var left, right;

    if(root.left) left = maxDeep(root.left);

    if(root.right) right = maxDeep(root.right);

    return Math.max(left, right) + 1;
}
// 6. 指定节点到跟的路径总和
function pathNum (root, target) {
    if(!root.val) return 0;

    function order (node) {

        if(node.val === target) return node.val;

        var result = (node.left ? order(node.left) : 0) ||
            (node.right ? order(node.right) : 0);

        return result ? result + obj.val : 0;
    }

    return order(root);
}
// 7. 根据中序遍历和后续遍历确定树
function buildTree (inOrder, postOrder) {
    var cur = postOrder[postOrder.length-1];
    var curIndex = inOrder.indexOf(cur);

    var leftTreeInOrder = inOrder.splice(0, curIndex);
    var rightTreeInOrder = inOrder.splice(curIndex, inOrder.length-1);

    var leftTreePostOrder = postOrder.splice(0, leftTreeInOrder.length);
    var rightTreePostOrder = postOrder.splice(rightTreeInOrder.length-1, postOrder.length-1);
    var node = {val: cur};

    node.left = leftTreeInOrder.length ? buildTree(leftTreeInOrder, leftTreePostOrder) : null;

    node.right = rightTreeInOrder.length ? buildTree(rightTreeInOrder, rightTreePostOrder) : null;

    return node;
}
// 8. 根据前序遍历和中序遍历确定树
function buildTree2 (preOrder, inOrder) {
    var cur = preOrder[0];
    var curIndex = inOrder.indexOf(cur);

    var leftTreeInOrder = inOrder.splice(0, curIndex);
    var rightTreeInOrder = inOrder.splice(curIndex, inOrder-1);

    var leftTreePreOrder = preOrder.splice(1, leftTreeInOrder.length);
    var rightTreePreOrder = preOrder.splice(rightTreeInOrder.length-1, preOrder.length-1);
    var node = {val: cur};

    node.left = leftTreeInOrder.length ? buildTree(leftTreeInOrder, leftTreePreOrder) : null;

    node.right = rightTreeInOrder.length ? buildTree(rightTreeInOrder, rightTreePreOrder) : null;

    return node;
}
// 9. 给定节点x,y的最小公共祖先
function lowestCommonAncestor (node, x, y) {
    if(node.val === x || node.val === y) return node;

    var left = node.left ? lowestCommonAncestor(node.left, x, y) : null;
    var right = node.right ? lowestCommonAncestor(node.right, x, y) : null;

    return (left && right) ? node : (left || right);
}
