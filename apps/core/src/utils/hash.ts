import { createHash } from 'node:crypto';

export default function sha256(content: string) {
   return createHash('sha3-256').update(content).digest('hex');
}
