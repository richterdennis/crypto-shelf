import { BinaryToTextEncoding } from 'node:crypto';

export interface Options {
	keyLength?: number;
	saltLength?: number;
	encoding?: null | BinaryToTextEncoding;
}

export declare const defaults: Options;

export declare function hashPassword(
	password: string | Buffer,
	options?: Options
): Promise<Buffer | string>;

export declare function comparePassword(
	clear: string | Buffer,
	hash: string | Buffer,
	options?: { encoding?: null | BinaryToTextEncoding }
): Promise<boolean>;
