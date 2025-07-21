import {
	defaults,
	hashPassword,
	comparePassword,
} from 'crypto-shelf/authentication';

console.log('=================================');
console.log('== crypto-shelf/authentication ==');
console.log('---------------------------------');

defaults.keyLength = 42;
defaults.saltLength = 13;
defaults.encoding = 'base64';

const hashedPassword = await hashPassword('SecretPassword!');
console.log('hashedPassword:', hashedPassword);

const isCorrect = await comparePassword('SecretPassword!', hashedPassword);
console.log('isCorrect:', isCorrect);

if (!isCorrect) throw new Error('Whooops!');
