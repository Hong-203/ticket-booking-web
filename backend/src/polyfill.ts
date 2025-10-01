import * as nodeCrypto from 'crypto';

if (!globalThis.crypto) {
  (globalThis as any).crypto = {
    randomUUID: nodeCrypto.randomUUID,
    getRandomValues: (typedArray: Uint8Array) => {
      const buffer = nodeCrypto.randomBytes(typedArray.length);
      typedArray.set(buffer);
      return typedArray;
    },
  };
}
