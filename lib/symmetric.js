import {
	randomBytes,
	getCipherInfo,
	scrypt,
	createCipheriv,
	createDecipheriv,
} from 'node:crypto';
import { promisify } from 'node:util';
import Cursor from './utils/Cursor.js';
import { merge } from './utils/helper.js';

const scryptAsync = promisify(scrypt);

const DEFAULT_SALT = Buffer.from('Eu372mYdUcdOzo2KrCdav2twN5CbTcmzGnvRKxxv5Rc', 'base64');

const AUTHENTICATED_ENCRYPTION_MODES = new Set(['gcm', 'ccm', 'ocb']);
const AUTHENTICATED_ENCRYPTION_CIPHERS = new Set(['chacha20-poly1305']);

export const defaults = {
	algorithm: 'aes-256-gcm', // Use aes-*-gcm, chacha20-poly1305 or aes-*-ocb for strong encryption
	encoding: 'base64url',
	aad: null, // additional authentication data
};

export function generateSalt(options = {}) {
	const { encoding, saltLength = 32 } = merge(defaults, options);
	const salt = randomBytes(saltLength);
	return encoding ? salt.toString(encoding) : salt;
}

export async function generateKey(passphrase, salt = null, options = {}) {
	const { algorithm, encoding } = merge(defaults, options);

	if (salt && !Buffer.isBuffer(salt)) salt = Buffer.from(salt, encoding);
	if (!salt) salt = DEFAULT_SALT;

	const { keyLength } = getCipherInfo(algorithm);

	return await scryptAsync(
		passphrase,
		salt,
		keyLength,
	);
}

export function encrypt(key, input, options = {}) {
	const { algorithm, encoding, aad } = merge(defaults, options);
	const { ivLength, authTagLength, mode } = getInfo(algorithm);

	const iv = randomBytes(ivLength);
	const cipher = createCipheriv(algorithm, key, iv, { authTagLength });

	if (mode === 'ccm') {
		cipher.setAutoPadding(false);
	}

	if (authTagLength && aad) {
		cipher.setAAD(Buffer.from(aad), {
			plaintextLength: Buffer.byteLength(input),
		});
	}

	const output = Buffer.concat([
		iv,
		cipher.update(input),
		cipher.final(),
		authTagLength
			? cipher.getAuthTag()
			: Buffer.alloc(0),
	]);

	return encoding ? output.toString(encoding) : output;
}

export function decrypt(key, input, options = {}) {
	const { algorithm, encoding, aad } = merge(defaults, options);
	const { ivLength, authTagLength, mode } = getInfo(algorithm);

	input = Cursor.from(input, encoding);
	const iv = input.read(ivLength);
	const encrypted = input.read(-authTagLength);
	const authTag = input.read();

	const decipher = createDecipheriv(algorithm, key, iv, { authTagLength });

	if (mode === 'ccm') {
		decipher.setAutoPadding(false);
	}

	if (authTagLength && aad) {
		decipher.setAAD(Buffer.from(aad), {
			plaintextLength: encrypted.length,
		});
	}

	if (authTagLength) decipher.setAuthTag(authTag);

	return decipher.update(encrypted, 'utf8') + decipher.final('utf8');
}

function getInfo(algorithm) {
	const { ivLength, mode } = getCipherInfo(algorithm);

	const usingAuth = (
		AUTHENTICATED_ENCRYPTION_MODES.has(mode)
		|| AUTHENTICATED_ENCRYPTION_CIPHERS.has(algorithm)
	);

	return {
		ivLength: ivLength || 0,
		authTagLength: usingAuth ? 16 : 0,
		mode,
	};
}
