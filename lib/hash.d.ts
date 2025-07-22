import { BinaryToTextEncoding, HashOptions } from 'node:crypto';

declare function hash(
	algorithm: string,
	value: string | Buffer,
	options?: HashOptions & { encoding?: BinaryToTextEncoding | null }
): string | Buffer;

export declare const md5: (
	value: string | Buffer,
	options?: HashOptions & { encoding?: BinaryToTextEncoding | null }
) => string | Buffer;

export declare const sha1: (
	value: string | Buffer,
	options?: HashOptions & { encoding?: BinaryToTextEncoding | null }
) => string | Buffer;

export declare const sha224: (
	value: string | Buffer,
	options?: HashOptions & { encoding?: BinaryToTextEncoding | null }
) => string | Buffer;

export declare const sha256: (
	value: string | Buffer,
	options?: HashOptions & { encoding?: BinaryToTextEncoding | null }
) => string | Buffer;

export declare const sha384: (
	value: string | Buffer,
	options?: HashOptions & { encoding?: BinaryToTextEncoding | null }
) => string | Buffer;

export declare const sha512: (
	value: string | Buffer,
	options?: HashOptions & { encoding?: BinaryToTextEncoding | null }
) => string | Buffer;

export default hash;
