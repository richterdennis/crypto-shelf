export interface Options {
	algorithm?: string,
	keyLength?: null | number,
	encoding?: null | BufferEncoding,
}

export declare const defaults: Options;

export declare function generateSecret(
	options?: Options
): Promise<string | Buffer>

export declare function createSignature(
	secret: string | Buffer,
	data: string | Buffer,
	options?: { algorithm?: string, encoding?: null | BufferEncoding }
): string | Buffer

export declare function verifySignature(
	secret: string | Buffer,
	signature: string | Buffer,
	data: string | Buffer,
	options?: { encoding?: null | BufferEncoding }
): boolean
