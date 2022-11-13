"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_net_1 = __importDefault(require("node:net"));
const client = node_net_1.default.createConnection({
    port: 1337
}, () => {
    client.write('hello\r\n');
});
client.on('data', data => {
    console.log(data.toString());
    client.end();
});
