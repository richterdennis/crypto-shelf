import { BinaryToTextEncoding } from 'node:crypto';

interface Options {
	algorithm?: string,
	encoding?: null | BinaryToTextEncoding,
	aad?: null | string,
}

export declare const defaults: Options;

export declare function generateSalt(
	options?: { encoding?: null | BinaryToTextEncoding, saltLength: number }
): string | Buffer

export declare function generateKey(
	passphrase: string | Buffer,
	salt?: string | Buffer,
	options?: { algorithm?: string, encoding?: null | BinaryToTextEncoding }
): Promise<Buffer>

export declare function encrypt(
	key: Buffer,
	str: string,
	options?: Options
): string | Buffer

export declare function decrypt(
	key: Buffer,
	str: string | Buffer,
	options?: Options
): string
