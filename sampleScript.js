let exitCondition = false;
function wait() {
    if (!exitCondition) {
        exitCondition = Math.random(0, 1) > 0.5;
        console.log(`Will it exit? ${exitCondition}`);
        if (exitCondition || true) {
            throw 'banana peel';
        }
        setTimeout(wait, 5000);
    }
};
wait();
