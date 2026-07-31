import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class EncryptUtil {
    private static readonly SALT_ROUNDS = 10;

    static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    static async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static generateRandomToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    static hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}