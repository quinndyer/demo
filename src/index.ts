let argv = require('minimist')(process.argv.slice(2));
let net = require('net');
let url = require('url');

const parsedArgs: { host: string[], data: string, method: string } = parseArgs();
const method: number = verifyArgs(parsedArgs);

if(method === 0) {
    console.log("Invalid input.");
}

const hostUrl = new url.URL(parsedArgs.host[0]);

const client = openSocket(hostUrl.hostname);
sendRequest(method, parsedArgs.data, hostUrl.pathname);


function sendRequest(method: number, data: string, path: string) {
    switch(method) {
        case 1:
            client.write(`GET ${path} HTTP/1.0

`);
        case 2:
            client.write(`POST ${path} HTTP/1.0
${data}

`);
        default: return;
    }
    return;
}

function verifyArgs(args: { host: string[], data: string, method: string }) {
    if(args.host.length !== 1) {
        // Invalid input
        return 0;
    }
    if(args.method === "POST") {
        // POST Request
        return 2;
    } else if(args.method === "") {
        // GET Request
        return 1;
    }

    return 0;
}

function openSocket(host: string) {
    const client = new net.Socket();

    client.connect(
        80,
        host,
        function() {
            console.log("Connected");
        }
    );

    client.on('data', (data: any) => {
        console.log(data.toString());
        client.end();
    });

    return client;
}

function parseArgs() {
    let method: string = "";
    let data: string = "";
    let host: string[] = [];

    if(argv["x"]) {
        method = argv["x"];
    }

    if(argv["d"]) {
        data = argv["d"];
    }

    // Only accept single (non flagged) input
    if(argv["_"]?.length === 1) {
        host = argv["_"];
    }

    return { host, data, method };
}

