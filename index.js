const fs = require('fs');
const args = require('args');
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const supervisor = require("supervisord-eventlistener");
const listen = require('./lib/listen');
const genericFormatter = require('./lib/genericFormatter');

args
    .option('config', 'Your configuration file location', './config.js')
    .option('debug', 'Output configuration before starting');

const flags = args.parse(process.argv)

if (!fs.existsSync(flags.config)) {
    throw 'Configuration file does not exist'
}

const config = require(flags.config);

if (flags.debug) {
    console.error(JSON.stringify(config, function replacer(err, option) {
        if (typeof option === 'function') {
            return '__function__';
        }
        return option;
    }, "  "));
}


const webhook = new IncomingWebhook(config.webhook);

if (typeof config !== 'object' || !config) {
    throw 'Configuration not completed. Please check your config.js file.'
}

const { events = {}, processEvents = {}} = config;

Object.keys(events).map(function(event) {
    console.error(`Listening to ${event}`);
    const formatter = typeof events[event] === 'function' ? events[event] : (...args) => genericFormatter(event, ...args);
    listen(event, ({ headers, data }) => {
        const { processname: processName } = data;
        if (processEvents[processName] && typeof processEvents[processName] === 'object') {
            const { disabled = false, blacklist, whitelist } = processEvents[processName];
            const notInWhitelist = Array.isArray(whitelist) ? whitelist.indexOf(event) === -1 : false;
            const inBlacklist = Array.isArray(blacklist) ? blacklist.indexOf(event) > -1 : false;
            if (disabled || notInWhitelist || inBlacklist) {
                return;
            }
        }
        const text = formatter(headers, data);
        if (!text) {
            console.error(`Not sending a hook for '${event}'`)
            return;
        }
        webhook.send({
            text: text,
            username: config.username,
            iconEmoji: config.iconEmoji,
            attachments: JSON.stringify({
                headers,
                data
            })
        }, function(err, header, statusCode, body) {
            if (err) {
                console.error(`Encountered a Slack error on '${event}': ${err}`)
            } else {
                console.error(`Received: ${statusCode} for ${processName}:'${event}'`)
            }
        });
    });
});

supervisor.listen(process.stdin, process.stdout);
