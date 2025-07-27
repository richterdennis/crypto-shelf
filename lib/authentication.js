import {
	randomBytes,
	scrypt,
	timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import Cursor from './utils/Cursor.js';
import { merge } from './utils/helper.js';

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
	const key = await scryptAsync(
		password,
		salt,
		keyLength,
	);

	const hash = Cursor.new(2 + saltLength + keyLength)
		.writeUInt8(saltLength)
		.writeUInt8(keyLength)
		.write(salt)
		.write(key);

	return encoding ? hash.toString(encoding) : hash.buffer;
}

export async function comparePassword(clear, hash, options = {}) {
	const { encoding } = merge(defaults, options);

	hash = Cursor.from(hash, encoding);
	const saltLength = hash.readUInt8();
	const keyLength = hash.readUInt8();
	const salt = hash.read(saltLength);
	const key = hash.read();

	const compare = await scryptAsync(
		clear,
		salt,
		keyLength,
	);

	return timingSafeEqual(compare, key);
}
