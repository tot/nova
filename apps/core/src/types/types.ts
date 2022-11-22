export interface KeyPair {
   publicKey: Buffer;
   secretKey: Buffer;
}

export interface SendEvent {
   target: string;
   content: Content;
}

interface Content {
   type: string;
   data: any;
}

export interface Response {
   target: string;
   content: any;
}
