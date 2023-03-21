export interface SendableMessage {
   type: string;
   data: { [key: string]: any };
}

export interface MessageEvent {
   connectionId: string;
   message: { [key: string]: any };
}

export interface Packet {
   id: string;
   ttl: number;
   type: string;
   message: SendableMessage;
   destination?: string;
   origin: string;
}
