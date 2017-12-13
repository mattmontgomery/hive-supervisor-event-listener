# Hive Supervisor event listener

### Setting up the config options

You'll find a pretty thorough example of all working features in the `config.js.example` file. When running the
listener, simply specify the location of your configuration Javascript with `-c /etc/monitor.conf` (or wherever you
decide that thing should live! It's up to you.)

### Setting up the eventlistener

Create an entry in `/etc/supervisor/conf.d` (or wherever you store your supervisord configs!) - it'll need to be an
`eventlistener` type. You'll find an example in `listener.conf.example`. That instance will run for every event, but
not all events will be processed.

```
[eventlistener:monitoring]
command=node index.js
events=EVENT
autostart=true
buffer_size=1024
```
