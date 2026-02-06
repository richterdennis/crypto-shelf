import { BinaryToTextEncoding, HashOptions } from 'node:crypto';

type HashResult<E extends BinaryToTextEncoding | null | undefined> =
	E extends 'base64' | 'base64url' | 'hex' | undefined ? string : Buffer;

type HashFn = <E extends BinaryToTextEncoding | null | undefined = undefined>(
	value: string | Buffer,
	options?: HashOptions & { encoding?: E }
) => HashResult<E>;

declare function hash<E extends BinaryToTextEncoding | null | undefined = undefined>(
	algorithm: string,
	value: string | Buffer,
	options?: HashOptions & { encoding?: E }
): HashResult<E>;

export declare const md5: HashFn;
export declare const sha1: HashFn;
export declare const sha224: HashFn;
export declare const sha256: HashFn;
export declare const sha384: HashFn;
export declare const sha512: HashFn;

export default hash;
