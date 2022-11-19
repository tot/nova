export interface KeyPair {
   publicKey: Buffer;
   secretKey: Buffer;
}

export interface ServerEvent {
   type: string;
   content: any;
}
