# Secure Proxy
TLS terminator that takes all https requests, strips of the tls, and forwards the request over http to a router service


# Installation

Clone the repository. In the root directory of the repository, execute the following

```bash
node secure-proxy.js --config test/config.json
```

This will start the secure proxy server using a self-signed certificate. The `test/config.json` settings will make the secure proxy server forward all traffic to a router server at

* host: localhost
* port: 4000



# Configuration
A `/path/to/config.json` file path can be supplied as a --config argument when running the *secure-proxy.js* file

`config.json` should contain at least the following

```javascript
{
  "router": {
    "host": "127.0.0.1"
    "port": 4000
  },
  "tls": {
    "keyFilePath": "/path/to/key.pem",
    "certFilePath": "/path/to/cert.pem"
  }
}
```


You can also specify the configuration options as command line paramters

```bash
node secure-proxy.json --router:host="127.0.0.1" --router:port=4000 --tls:keyFilePath="/path/to/key.pem" --tls:certFilePath="/path/to/cert.pem"
```
