import { BinaryToTextEncoding } from 'node:crypto';

interface Options {
	keyLength: number;
	saltLength: number;
}

type HashResult<E extends BinaryToTextEncoding | null | undefined> =
	E extends 'base64' | 'base64url' | 'hex' ? string : Buffer;

export declare const defaults: Options & { encoding: BinaryToTextEncoding | null };

export declare function hashPassword<E extends BinaryToTextEncoding | null | undefined = 'base64url'>(
	password: string | Buffer,
	options?: Partial<Options> & { encoding?: E }
): Promise<HashResult<E>>;

export declare function comparePassword(
	clear: string | Buffer,
	hash: string | Buffer,
	options?: { encoding?: null | BinaryToTextEncoding }
): Promise<boolean>;
