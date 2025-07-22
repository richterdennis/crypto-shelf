import { createHash } from 'node:crypto';

export default function hash(algorithm, value, options = {}) {
	let encoding = null;

	({ encoding = 'hex', ...options } = options);

	return createHash(algorithm, options)
		.update(value)
		.digest(encoding);
}

export const md5 = (...args) => hash('md5', ...args);

export const sha1 = (...args) => hash('sha1', ...args);

export const sha224 = (...args) => hash('sha224', ...args);

export const sha256 = (...args) => hash('sha256', ...args);

export const sha384 = (...args) => hash('sha384', ...args);

export const sha512 = (...args) => hash('sha512', ...args);
