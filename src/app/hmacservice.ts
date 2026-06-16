import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HmacService {

  // hashes the request payload (JSON string) using SHA-256
  async hashPayload(payload: string): Promise<string> {
    return this.sha256Hex(payload);
  }

  // computes HMAC-SHA256(fingerprint + payloadHash + timestamp, secret)
  async computeSignature(fingerprint: string, payloadHash: string, timestamp: string, secret: string): Promise<string> {
    const dataToSign = fingerprint + payloadHash + timestamp;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(dataToSign);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    return this.bufferToHex(signatureBuffer);
  }

  private async sha256Hex(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.bufferToHex(hashBuffer);
  }

  private bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}