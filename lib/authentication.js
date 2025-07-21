import {
	randomBytes,
	scrypt,
	timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import { merge } from './util.js';

const scryptAsync = promisify(scrypt);

export const defaults = {
	keyLength: 48,
	saltLength: 16,
	encoding: 'base64url',
};

export async function hashPassword(password, options = {}) {
	const { keyLength, saltLength, encoding } = merge(defaults, options);

	assert(keyLength > 0 && keyLength < 256, '"keyLength" must be between 1 and 255');
	assert(saltLength > 0 && saltLength < 256, '"saltLength" must be between 1 and 255');

	const salt = randomBytes(saltLength);

	const hash = Buffer.concat([
		Buffer.from([saltLength, keyLength]),
		salt,
		await scryptAsync(
			password,
			salt,
			keyLength,
		),
	]);

	return encoding ? hash.toString(encoding) : hash;
}

export async function comparePassword(clear, hash, options = {}) {
	const { encoding } = merge(defaults, options);

	if (!Buffer.isBuffer(hash)) hash = Buffer.from(hash, encoding);

	const saltLength = hash.readUInt8(0);
	const keyLength = hash.readUInt8(1);

	const salt = hash.subarray(2, saltLength + 2);

	const compare = await scryptAsync(
		clear,
		salt,
		keyLength,
	);

	return timingSafeEqual(compare, hash.subarray(saltLength + 2));
}
