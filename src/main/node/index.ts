import { nanoid } from 'nanoid';
import { Socket, createServer } from 'net';
import { EventEmitter } from 'events';
import os from 'os';
import fs from 'fs';
import messageStream from './messageStream';
import { MessageEvent, Packet, SendableMessage } from '../types';

const Server = () => {
  const connections = new Map<string, Socket>();
  let connectionsCount = 0;

  const NODE_ID = nanoid();
  const peers = new Map<string, string>();
  const peersCount = 0;

  const emitter = new EventEmitter();

  /**
   * Callback function for handling new socket connections
   * @param socket Socket connection
   */
  const handleNewSocket = (socket: Socket) => {
    const connectionId = nanoid();

    connections.set(connectionId, socket);
    connectionsCount += 1;
    emitter.emit(
      '_connect',
      connectionId,
      socket.remoteAddress,
      socket.remotePort
    );

    socket.on('close', () => {
      connections.delete(connectionId);
      connectionsCount -= 1;
      emitter.emit('_disconnect', connectionId);
    });

    // Handle pipe for receiving messages

    // TODO: Redo messageStream and type it
    socket.pipe(messageStream()).on('data', (message: any) => {
      emitter.emit('_message', { connectionId, message });
    });
  };

  const server = createServer((socket) => handleNewSocket(socket));

  /**
   * Used internally to send messages to the specified peer.
   * @param connectionId ID of the destination peer.
   * @param message Message to send.
   */
  const internalSend = (connectionId: string, message: SendableMessage) => {
    const socket = connections.get(connectionId);

    if (!socket) {
      throw new Error(
        `Attempt to send data to ${connectionId} failed because connection does not exist.`
      );
    }

    socket.write(JSON.stringify(message));
  };

  /**
   * Starts the socket server.
   * @param port Server port. Default is 1337.
   * @param hostName Hostname to run the server on. Default is 0.0.0.0.
   * @param callback Optional callback function to run after the server is stopped.
   * @returns Function to stop the server.
   */
  const listen = (port = 1337, hostName = '0.0.0.0', callback?: () => void) => {
    server.listen(port, hostName, callback);

    return (cb: () => void) => server.close(cb);
  };

  /**
   * Connect to specified peer.
   * @param ip IP of peer.
   * @param port Port of peer.
   * @param callback Optional callback function to run when peer is disconnected.
   * @returns Function to disconnect from peer.
   */
  const connect = (ip: string, port: number, callback?: () => void) => {
    const socket = new Socket();

    socket.connect(port, ip, () => {
      handleNewSocket(socket);
      callback && callback();
    });

    return () => socket.destroy();
  };

  /**
   * Close connection with specified peer.
   * @param callback Optional callback function to be ran after disconnected from peer.
   */
  const close = (connectionId: string, callback?: () => void) => {
    const socket = connections.get(connectionId);

    // TODO: error handling if not connected to peer
    if (!socket) return;

    socket.destroy();
    callback && callback();
  };

  /**
   * Close connections with all peers and then stop the server.
   * @param callback Optional callback function to be ran after server is stopped.
   */
  const closeAll = (callback?: () => void) => {
    connections.forEach((socket, connectionId) => {
      socket.destroy();
    });
    server.close(callback);
  };

  /**
   * Helper function to find node ID by connection ID.
   * @param connectionId ID of connection to search by.
   * @returns ID of peer.
   */
  const findNodeId = (connectionId: string) => {
    // eslint-disable-next-line consistent-return
    peers.forEach((nodeId, neighborConnectionId) => {
      if (connectionId === neighborConnectionId) {
        return nodeId;
      }
    });
    return null;
  };

  /**
   * On successful connection, send handshake
   */
  emitter.on('_connect', (connectionId) => {
    internalSend(connectionId, { type: 'handshake', data: { NODE_ID } });
  });

  /**
   * Save a file to the user's Documents folder
   * @param filename Name of file to save
   * @param fileContent Base64-encoded file content to save
   */
  const saveFile = (filename: string, fileContent: string) => {
    const saveFolder = `${os.homedir()}/Documents/`;
    const savePath = saveFolder + filename;
    fs.writeFile(savePath, fileContent, { encoding: 'base64' }, (err) => {
      if (err) return console.log(err);
      return console.log('File saved');
    });
  };

  /**
   * On message received, check type of message and continue accordingly
   */
  emitter.on('_message', ({ connectionId, message }: MessageEvent) => {
    const { type, data } = message;

    // For handshakes, add node to peers list
    if (type === 'handshake') {
      const { nodeId } = data;

      peers.set(nodeId, connectionId);
      emitter.emit('connect', { nodeId });
    }

    // For regular messages, handle normally
    if (type === 'message') {
      const nodeId = findNodeId(connectionId);

      // TODO: handle no nodeId

      emitter.emit('message', { nodeId, data });
    }

    // For files
    if (type === 'file') {
      const { filename, fileContent } = data;
      saveFile(filename, fileContent);
    }
  });

  /**
   * On disconnect, remove node from peers
   */
  emitter.on('_disconnect', (connectionId: string) => {
    const nodeId = findNodeId(connectionId);

    // TODO: handle no nodeId
    if (!nodeId) return;

    peers.delete(nodeId);
    emitter.emit('disconnect', { nodeId });
  });

  // TODO: update send function for more types; update return values
  /**
   * Send message to specified node with data.
   * @param nodeId ID of destination node.
   * @param data Data to send.
   * @returns
   */
  const send = (nodeId: string, data: any) => {
    const connectionId = peers.get(nodeId);

    // TODO: handle no connection id
    if (!connectionId) return;

    internalSend(connectionId, { type: 'message', data });
  };

  /**
   * Send a packet to all peers
   */
  const sendPacket = (packet: Packet) => {
    // TODO: Make asynchronous
    peers.forEach((nodeId, _) => {
      send(nodeId, packet);
    });
  };

  /**
   * Broadcast message to all peers within the network.
   * @param message Message to broadcast.
   * @param id ID of message.
   * @param origin Origin node of the message.
   * @param ttl Time-to-live for the message (depth of peers the message hops between).
   */
  const broadcast = (
    message: SendableMessage,
    id = nanoid(),
    origin = NODE_ID,
    ttl = 255
  ) => {
    sendPacket({ id, ttl, type: 'broadcast', message, origin });
  };

  /**
   * Directly send message to specified peer within the network.
   * @param destination Destination of message.
   * @param message Message to send.
   * @param id ID of message.
   * @param origin Origin node of the message.
   * @param ttl Time-to-live for the message (depth of peers the message hops between).
   */
  const direct = (
    destination: string,
    message: SendableMessage,
    id = nanoid(),
    origin = NODE_ID,
    ttl = 255
  ) => {
    sendPacket({ id, ttl, type: 'direct', message, destination, origin });
  };

  const seenMessages = new Set();
  /**
   * On message received
   */
  emitter.on('message', ({ nodeId, data: packet }) => {
    // TODO: handle if already seen packet or invalid packet
    // used when hopping between peers
    if (seenMessages.has(packet.id) || packet.ttl < 1) {
      return;
    }
    seenMessages.add(packet.id);

    // If the packet is broadcasted, continue passing it on to peers
    if (packet.type === 'broadcast') {
      emitter.emit('broadcast', {
        message: packet.message,
        origin: packet.origin,
      });
      broadcast(packet.message, packet.id, packet.origin, packet.ttl - 1);
    }

    // If packet is direct message, check if it is for me
    // Otherwise, pass it on
    if (packet.type === 'direct') {
      if (packet.destination === NODE_ID) {
        emitter.emit('direct', {
          origin: packet.origin,
          message: packet.message,
        });
      } else {
        direct(
          packet.destination,
          packet.message,
          packet.id,
          packet.origin,
          packet.ttl - 1
        );
      }
    }
  });

  return {
    listen,
    connect,
    close,
    closeAll,
    broadcast,
    direct,
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    id: NODE_ID,
    peers: () => peers.keys(),
    connectionsCount,
    peersCount,
  };
};
export default Server;
