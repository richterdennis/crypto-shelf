export interface Options {
	keyLength?: number;
	saltLength?: number;
	encoding?: null | BufferEncoding;
}

export declare const defaults: Options;

export declare function hashPassword(
	password: string | Buffer,
	options?: Options
): Promise<Buffer | string>;

export declare function comparePassword(
	clear: string | Buffer,
	hash: string | Buffer,
	options?: { encoding?: null | BufferEncoding }
): Promise<boolean>;
