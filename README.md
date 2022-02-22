# express_template
Express application code template.  

## Functions
This express template shows the implementations of following features.
* Listen, Read http request, and Send http response
* Connection timeout
* Use express middleware
* Log access and diagnostic information
* Applications graceful shutdown

## Install dependencies
```bash
$ npm install
```

## Build
```bash
$ npm run build 
```

## Run express template application
```bash
$ npm start
```

## Run express template application using node-dev
```bash
$ npm run dev
```

## Check lint
```bash
$ npm run lint      # check lint
$ npm run lintfix   # Check lint and fix automatically.
```

## Run test
```bash
$ npm run test
```

## Configure express template application
Following environment variables are loaded.  

| Environment Variable            | Default Value | Description |
|:--------------------------------|:--------------|:------------|
| ACCESS_LOG_FILE_PATH            | access.log    | File path of access log. |
| CONNECTION_TIMEOUT_MS           | 10000         | The number of milliseconds before active connections time out. |
| LISTEN_PORT                     | 3000          | Port number to listen.   |
| LOG_LEVEL                       | debug         | Log level. You can set one of `trace`, `debug`, `info`, `warn`, `error`, `fatal`. |
| SERVER_LOG_FILE_PATH            | server.log    | File path of server log. Diagnostic information are logged to this file. |
| TERMINATE_CONNECTION_TIMEOUT_MS | 20000         | The number of milliseconds before active connections time out when `SIGTERM` is received. |
