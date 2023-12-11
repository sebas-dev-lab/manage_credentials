import * as cry from 'crypto';
import { encrypt_sites } from '../envs/server.envs';
import { ConflictException } from '@nestjs/common';
import Logger from '../configurations/loggingConfiguration/winston.logs';

export class HanshAndEncryptData {
    private transformed: string;
    private readonly secret = encrypt_sites.secret_key;
    private readonly algorithm = encrypt_sites.algorithm;
    private readonly alg_length = 16;

    constructor(private _target: string, private _hash?: string) {
        this.encryptData = this.encryptData.bind(this);
    }

    /**
     * ==========================================
     * ======= SITE PASSWORD ENCRYPTATION =======
     */

    // ============== ENCRYPT DATA ============== //
    async encryptData(): Promise<{ iv: string; encrypted: string }> {
        try {
            // Creating Cipheriv with its parameter
            const iv = cry.randomBytes(this.alg_length);

            const cipher = cry.createCipheriv(
                this.algorithm, // TODO: en Variable
                Buffer.from(this.secret, 'hex'),
                iv,
            );

            // Updating text
            let encrypted = cipher.update(this._target);

            // Using concatenation
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            // Returning iv and encrypted data
            return { iv: iv.toString('hex'), encrypted: encrypted.toString('hex') };
        } catch (err) {
            Logger.error(err.message);
            throw new ConflictException(err.message);
        }
    }

    // ============== DECRYPT DATA ============== //
    decryptData(data: { iv: string; encrypted: string }) {
        try {
            const iv = Buffer.from(data.iv, 'hex');
            const encryptedText = Buffer.from(data.encrypted, 'hex');

            // Creating Decipher
            const decipher = cry.createDecipheriv(
                this.algorithm,
                Buffer.from(this.secret, 'hex'),
                iv,
            );

            // Updating encrypted text
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            // returns data after decryption
            return decrypted.toString();
        } catch (err) {
            Logger.error(err.message);
            throw new ConflictException(err.message);
        }
    }

    // ============== GTTERS ============== //

    getData(): string {
        return this.transformed;
    }
}