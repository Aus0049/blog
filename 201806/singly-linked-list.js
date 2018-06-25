/**
 * Created by Aus on 2018/6/25.
 *
 * Design your implementation of the linked list. You can choose to use the singly linked list or the doubly linked list. A node in a singly linked list should have two attributes: val and next. val is the value of the current node, and next is a pointer/reference to the next node. If you want to use the doubly linked list, you will need one more attribute prev to indicate the previous node in the linked list. Assume all nodes in the linked list are 0-indexed.

 * Implement these functions in your linked list class:

 * get(index) : Get the value of the index-th node in the linked list. If the index is invalid, return -1.
 * addAtHead(val) : Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.
 * addAtTail(val) : Append a node of value val to the last element of the linked list.
 * addAtIndex(index, val) : Add a node of value val before the index-th node in the linked list. If index equals to the length of linked list, the node will be appended to the end of linked list. If index is greater than the length, the node will not be inserted.
 * deleteAtIndex(index) : Delete the index-th node in the linked list, if the index is valid.
 */

/**
 * Initialize your data structure here.
 */
var MyLinkedList = function() {
    this.node = null;
    this.length = 0;
};

/**
 * Get the value of the index-th node in the linked list. If the index is invalid, return -1.
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function(index) {
    if (index >= this.length) return -1;

    var cur = this.node;

    while (index > 0) {
        cur = cur.next;
        index--;
    }

    return cur.val;
};

/**
 * Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function(val) {
    var newNode = {
        val: val,
        next: this.node
    };

    this.node = newNode;
    this.length++;
};

/**
 * Append a node of value val to the last element of the linked list.
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function(val) {
    if(this.length === 0){
        this.addAtHead(val);
        return;
    }

    var cur = this.node;

    while (cur.next) {
        cur = cur.next;
    }

    cur.next = {val: val, next: null};

    this.length++;
};

/**
 * Add a node of value val before the index-th node in the linked list. If index equals to the length of linked list, the node will be appended to the end of linked list. If index is greater than the length, the node will not be inserted.
 * @param {number} index
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function(index, val) {
    if(index > this.length) return;

    if(index === this.length){
        this.addAtTail(val);
        return;
    }

    if(index === 0){
        this.addAtHead(val);
        return;
    }

    // s is target p is target
    // s->prior = p->prior;
    // s->prior->next = s;
    // s->next = p;
    // p->prior = s;
    var cur = this.node;

    while (index - 1 >= 0) {
        cur = cur.next;
        index--;
    }

    var prior = cur;
    var target = prior.next;
    var newNode = {val: val, next: null};

    newNode.next = target;
    prior.next = newNode;

    this.length++;
};

/**
 * Delete the index-th node in the linked list, if the index is valid.
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function(index) {
    if(index >= this.length) return;
    // s is target
    // s->prior->next = s->next;
    // s->next->prior = s->prior;
    var cur = this.node;

    while (index - 1 >= 0) {
        cur = cur.next;
        index--;
    }

    var prior = cur;
    var target = prior.next;

    prior.next = target.next;

    this.length--;
};

/**
 * test case
 */
var linkedList = new MyLinkedList();

linkedList.addAtHead(1); // undefined

linkedList.addAtIndex(1, 2); // undefined

linkedList.get(1); // 2

linkedList.get(0); // 1

linkedList.get(2); // -1


