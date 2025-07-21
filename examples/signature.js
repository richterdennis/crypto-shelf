import {
	defaults,
	generateSecret,
	createSignature,
	verifySignature,
} from 'crypto-shelf/signature';

const HASH_ALGORITHMS = [
	'md5',
	'sha1',
	'sha224',
	'sha256',
	'sha384',
	'sha512',
	'sha512-224',
	'sha512-256',
	'sha3-224',
	'sha3-256',
	'sha3-384',
	'sha3-512',
];

const data = 'Lorem Ipsum'.repeat(128);

console.log('===============================');
console.log('== crypto-shelf/signature =====');

for (const algorithm of HASH_ALGORITHMS) {
	console.log('-----------------------------');
	console.log('algorithm:', algorithm);

	const secret = await generateSecret({ algorithm });
	console.log('secret:', secret);

	const signature = createSignature(secret, data, { algorithm });
	console.log('signature:', signature);

	const isVerified = verifySignature(secret, signature, data, { algorithm });
	console.log('isVerified:', isVerified);

	if (!isVerified) throw new Error('Whooops!');
}

console.log('-----------------------------');

// Set default settings globally
defaults.algorithm = 'md5';
defaults.encoding = null; // Use buffers

console.log('algorithm:', defaults.algorithm);

const secret = await generateSecret(); // Returns a buffer
console.log('secret:', secret.toString('base64'));

const signature = createSignature(secret, data); // Takes secret as a buffer and also returns a buffer
console.log('signature:', signature.toString('hex'));

const isVerified = verifySignature(secret, signature, data);  // Takes signature and secret as a buffer
console.log('isVerified:', isVerified);
