import {
	defaults,
	generateKey,
	encrypt,
	decrypt,
} from 'crypto-shelf/symmetric';
import crypto from 'node:crypto';

const plaintext = 'Hello World'.repeat(5);

console.log('===============================');
console.log('== crypto-shelf/symmetric =====');

let algorithms = generateUsableCipherList();
// console.log('Available algorithms:', algorithms);

// Recommended cipher list
algorithms = filterUnsafeCiphers(algorithms);
algorithms = orderCiphersByRanking(algorithms);
// console.log('Recommended algorithms:', algorithms);

for (const algorithm of algorithms) {
	console.log('-----------------------------');
	console.log('algorithm:', algorithm);

	const key = await generateKey('MySecretPassphrase', null, { algorithm });
	console.log('key:', key.toString(defaults.encoding));

	const encrypted = encrypt(key, plaintext, { algorithm, aad: 'test' });
	console.log('encrypted:', encrypted);

	const decryptedCorrectly = plaintext === decrypt(key, encrypted, { algorithm, aad: 'test' });
	console.log('decryptedCorrectly:', decryptedCorrectly);

	if (!decryptedCorrectly) throw new Error('Whooops!');
}

console.log('-----------------------------');

// Set default settings globally
defaults.algorithm = 'chacha20-poly1305';
defaults.encoding = null; // Use buffers

console.log('algorithm:', defaults.algorithm);

const key = await generateKey('MySecretPassphrase'); // Always returns a buffer
console.log('key:', key.toString('base64'));

const encrypted = encrypt(key, plaintext); // Always takes key as a buffer and plaintext as string. Now it also returns a buffer
console.log('encrypted:', encrypted.toString('base64'));

const decryptedCorrectly = plaintext === decrypt(key, encrypted);  // Always takes key as a buffer. Takes encrypted as a buffer now. Always returns a string
console.log('decryptedCorrectly:', decryptedCorrectly);

function orderCiphersByRanking(algorithms) {
	return algorithms.sort((a, b) => {
		if (a === b) return 0;

		// AEAD, fast in software, modern, safe
		if (a === 'chacha20-poly1305') return -1;
		if (b === 'chacha20-poly1305') return 1;

		const modeA = a.slice(-3);
		const modeB = b.slice(-3);

		const modes = [
			'ccm', // Needs aad to be set
			'ocb', // AEAD. Fast and efficient, but less widely supported
			'gcm', // AEAD. Widely supported, safer and easier to use correctly than OCB
		];

		if (modeA !== modeB) return modes.indexOf(modeB) - modes.indexOf(modeA);

		const keyA = a.slice(4, 7);
		const keyB = b.slice(4, 7);
		if (keyA !== keyB) return keyB.localeCompare(keyA);

		return b.localeCompare(a);
	});
}

function filterUnsafeCiphers(algorithms) {
	return algorithms.filter(algorithm => (
		algorithm === 'chacha20-poly1305' // Best choice for modern secure communication when AES hardware support is weak
		|| algorithm.startsWith('aes')
		&& !algorithm.endsWith('ecb') // deterministic output, leaks patterns
		&& !algorithm.endsWith('ofb') // Obsolete, insecure in many use cases
		&& !algorithm.includes('cfb') // Not commonly used anymore

		// These modes needs extra authentication with hmac to be safe
		&& !algorithm.endsWith('cbc')
		&& !algorithm.endsWith('ctr')

		// Not recommended due to aad required
		&& !algorithm.endsWith('ccm')

		&& algorithm.length > 6 // Avoid aliases
	));
}

function generateUsableCipherList() {
	const algorithms = new Set();

	for (const algorithm of crypto.getCiphers()) {
		if (isUsable(algorithm)) algorithms.add(algorithm);
	}

	return [...algorithms];
}

function isUsable(algorithm) {
	try {
		const { name, keyLength, ivLength } = crypto.getCipherInfo(algorithm);

		// Create a dummy key and IV
		const key = crypto.randomBytes(keyLength);
		const iv = crypto.randomBytes(ivLength || 0);

		// Test cipheriv support
		const c = crypto.createCipheriv(algorithm, key, iv, { authTagLength: 16 });
		c.update('test');
		c.final();

		return name;
	}
	catch (e) {
		if (e.message === 'Trying to add data in unsupported state') return false;
		throw e;
	}
}
