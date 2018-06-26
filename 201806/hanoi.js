/**
 * Created by Aus on 2018/6/26.
 */
// a 是 起始柱 c 是目的柱
function hanoi (disc, a, b, c) {
    if (disc > 0) {
        hanoi(disc - 1, a, c, b);
        console.log('Move disc ' + disc + ' from ' + a + ' to ' + c);
        hanoi(disc - 1, b, a, c);
    }
}

hanoi(3, 'a', 'b', 'c');