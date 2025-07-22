import { BinaryToTextEncoding } from 'node:crypto';

export interface Options {
	algorithm?: string,
	keyLength?: null | number,
	encoding?: null | BinaryToTextEncoding,
}

export declare const defaults: Options;

export declare function generateSecret(
	options?: Options
): Promise<string | Buffer>

export declare function createSignature(
	secret: string | Buffer,
	data: string | Buffer,
	options?: { algorithm?: string, encoding?: null | BinaryToTextEncoding }
): string | Buffer

export declare function verifySignature(
	secret: string | Buffer,
	signature: string | Buffer,
	data: string | Buffer,
	options?: { encoding?: null | BinaryToTextEncoding }
): boolean
