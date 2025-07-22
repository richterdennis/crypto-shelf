import hash, { md5, sha512 } from 'crypto-shelf/hash';
import crypto from 'node:crypto';

const plaintext = 'Hello World'.repeat(5);

console.log('=============================');
console.log('== crypto-shelf/hash ========');

const algorithms = crypto.getHashes();

// console.log(algorithms);

for (const algorithm of algorithms) {
	console.log('-----------------------------');
	console.log(`${algorithm}:`);
	console.log(
		hash(algorithm, plaintext),
	);
}

console.log('-----------------------------');
console.log('md5:');
console.log(
	md5(plaintext),
);

console.log('-----------------------------');
console.log('sha512:');
console.log(
	sha512(plaintext, { encoding: 'base64' }),
);

console.log('-----------------------------');
console.log('RIPEMD160:');
console.log(
	hash('RIPEMD160', plaintext, { encoding: null }), // Buffer
);
