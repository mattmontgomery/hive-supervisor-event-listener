const supervisor = require("supervisord-eventlistener");

module.exports = function listen(event, callback) {
    supervisor.on(event, function(headers, data) {
        console.error(`Preparing for ${event} with ${data.processname}`);
        callback({ headers, data });
    });
}
