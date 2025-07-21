export interface Options {
	algorithm?: string,
	encoding?: null | BufferEncoding,
	aad?: null | string,
}

export declare const defaults: Options;

export declare function generateSalt(
	options?: { encoding?: null | BufferEncoding, saltLength: number }
): string | Buffer

export declare function generateKey(
	passphrase: string | Buffer,
	salt?: string | Buffer,
	options?: { algorithm?: string, encoding?: null | BufferEncoding }
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
