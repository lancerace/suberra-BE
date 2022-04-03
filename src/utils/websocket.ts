import WebSocket from 'ws';

export default {
    create(port: string) {
        const wss = new WebSocket.Server({ port: parseInt(port) });
        return wss;
    }
}

