# Secure Proxy
TLS terminator that takes all https requests, strips of the tls, and forwards the request over http to a router service

## Services
This proxy server handles all https traffic on port 443. It strips the encryption and forwards the connection on to the **router** service. The router configuration details are specified in a config.json file or as command line args

### Configuration
A config.json file path can be supplied as a --config argument when running the *secure-proxy.js* file

```
node secure-proxy.js --config ./test/config.json
```

config.json should contain at least the following

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
