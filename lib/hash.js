import { createHash } from 'node:crypto';

export default function hash(algorithm, value, options = {}) {
	let encoding = null;

	({ encoding = 'hex', ...options } = options);

	return createHash(algorithm, options)
		.update(value)
		.digest(encoding);
}

export const md5 = hash.bind(null, 'md5');

export const sha1 = hash.bind(null, 'sha1');

export const sha224 = hash.bind(null, 'sha224');

export const sha256 = hash.bind(null, 'sha256');

export const sha384 = hash.bind(null, 'sha384');

export const sha512 = hash.bind(null, 'sha512');
