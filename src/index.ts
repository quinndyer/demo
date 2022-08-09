const argv = require('minimist')(process.argv.slice(2));
import { Socket } from 'net';
import { URL } from 'url';

type RequestMethod = 'GET' | 'POST';

// Main code

const request: { host: string, method: RequestMethod, data: string } | null = parseArgs();

if(!request) {
    console.log("Invalid input.");
} else {
    const hostUrl = new URL(request.host);
    const client = openSocket(hostUrl.hostname);
    sendRequest(request.method, request.data, hostUrl.pathname, client);
}

// Methods

function sendRequest(method: RequestMethod, data: string, path: string, client: Socket) {
    if(method === "GET") {
        client.write(`GET ${path} HTTP/1.0

`);
    } else if(method === "POST") {
        client.write(`POST ${path} HTTP/1.0
${data}

`);
    }
    return;
}

function openSocket(host: string) {
    const client = new Socket();

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
    const request: { host: string, method: RequestMethod, data: string } = { host: "", method: "GET", data: "" };

    // Unsure if matches RequestMethod type yet, so keep as temp before checking
    const tempMethod = argv["x"] || "";
    request.data = argv["d"] || "";

    // Only accept single (non flagged) input
    if(argv["_"]?.length === 1) {
        request.host = argv["_"][0];
    } else {
        return null;
    }

    if(tempMethod === "POST") {
        request.method = tempMethod;
    } else if (tempMethod != "") {
        // Return null if not GET or POST
        return null;
    }

    return request;
}

