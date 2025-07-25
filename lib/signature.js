import { createHmac, generateKey, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { merge } from './utils/helper.js';

const generateKeyAsync = promisify(generateKey);

const BLOCK_SIZES = {
	'md5': 512,

	'sha1': 512,
	'sha224': 512,
	'sha256': 512,
	'sha384': 1024,
	'sha512': 1024,
	'sha512-224': 1024,
	'sha512-256': 1024,

	'sha3-224': 1152,
	'sha3-256': 1088,
	'sha3-384': 832,
	'sha3-512': 576,
};

export const defaults = {
	algorithm: 'sha256',
	keyLength: null,
	encoding: 'base64',
};

export async function generateSecret(options = {}) {
	const { algorithm, encoding } = merge(defaults, options);

	let key = await generateKeyAsync('hmac', {
		length: options.keyLength || defaults.keyLength || BLOCK_SIZES[algorithm],
	});

	key = key.export();

	return encoding ? key.toString(encoding) : key;
}

export function createSignature(secret, data, options = {}) {
	const { algorithm, encoding } = merge(defaults, options);

	if (typeof secret === 'string') secret = Buffer.from(secret, encoding);

	return createHmac(algorithm, secret)
		.update(data)
		.digest(encoding);
}

export function verifySignature(secret, signature, data, options = {}) {
	const { algorithm, encoding } = merge(defaults, options);

	if (encoding) {
		secret = Buffer.from(secret, encoding);
		signature = Buffer.from(signature, encoding);
	}

	const shouldBe = createSignature(secret, data, { algorithm, encoding: null });

	return timingSafeEqual(signature, shouldBe);
}
