import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {
  private fingerprintHash: string = '';

  async init(): Promise<void> {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    this.fingerprintHash = await this.hash(result.visitorId);
  } catch (err) {
    console.error('Fingerprint initialization failed', err);
    // App continues with empty fingerprint
    // Backend will handle missing fingerprint appropriately
  }
}

  getHash(): string {
    return this.fingerprintHash;
  }

  private async hash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}