// ENCRYPTION SERVICE - AES-256
// Military-grade encryption for marketplace credentials

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

export class EncryptionService {
  private masterKey: Buffer;

  constructor() {
    // Get master key from environment or generate
    const masterKeyHex = process.env.ENCRYPTION_MASTER_KEY;
    
    if (!masterKeyHex) {
      throw new Error('ENCRYPTION_MASTER_KEY not set in environment');
    }
    
    this.masterKey = Buffer.from(masterKeyHex, 'hex');
    
    if (this.masterKey.length !== KEY_LENGTH) {
      throw new Error(`Master key must be ${KEY_LENGTH} bytes`);
    }
  }

  // Encrypt sensitive data
  encrypt(plaintext: string): string {
    try {
      // Generate random IV
      const iv = crypto.randomBytes(IV_LENGTH);
      
      // Create cipher
      const cipher = crypto.createCipheriv(ALGORITHM, this.masterKey, iv);
      
      // Encrypt
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get auth tag
      const tag = cipher.getAuthTag();
      
      // Combine: iv + tag + encrypted
      const combined = Buffer.concat([
        iv,
        tag,
        Buffer.from(encrypted, 'hex')
      ]);
      
      // Return as base64
      return combined.toString('base64');
      
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt sensitive data
  decrypt(encryptedData: string): string {
    try {
      // Decode from base64
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extract components
      const iv = combined.subarray(0, IV_LENGTH);
      const tag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
      const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH);
      
      // Create decipher
      const decipher = crypto.createDecipheriv(ALGORITHM, this.masterKey, iv);
      decipher.setAuthTag(tag);
      
      // Decrypt
      let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
      
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Hash password (for verification, not storage)
  hash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  // Generate secure random key
  static generateMasterKey(): string {
    return crypto.randomBytes(KEY_LENGTH).toString('hex');
  }

  // Encrypt credentials object
  encryptCredentials(credentials: {
    username: string;
    password: string;
    twoFactorSecret?: string;
  }): string {
    const json = JSON.stringify(credentials);
    return this.encrypt(json);
  }

  // Decrypt credentials object
  decryptCredentials(encryptedData: string): {
    username: string;
    password: string;
    twoFactorSecret?: string;
  } {
    const json = this.decrypt(encryptedData);
    return JSON.parse(json);
  }
}

// Singleton instance
export const encryption = new EncryptionService();
