# crypto-shelf

A lightweight and secure Node.js library collection for password hashing and comparison, HMAC-based signature generation and verification, and symmetric encryption and decryption using modern authenticated encryption algorithms powered by Node's built-in `crypto` module.

## Table of Contents
**[Installation](#installation)**<br>
**[crypto-shelf/authentication](#crypto-shelfauthentication)**<br>
**[crypto-shelf/signature](#crypto-shelfsignature)**<br>
**[crypto-shelf/symmetric](#crypto-shelfsymmetric)**<br>

## Installation

```bash
npm i crypto-shelf
```

## crypto-shelf/authentication

Provides secure password hashing and verification using Node's native `crypto` module.

### Features

- Password hashing with `scrypt`
- Configurable salt and key lengths
- Default `base64url` encoding
- Timing-safe password comparison
- No external dependencies

### Usage

#### Import

```js
import { hashPassword, comparePassword } from 'crypto-shelf/authentication';
```

#### Hash a Password

```js
const hash = await hashPassword('SomePassword!1!11');
console.log(hash); // base64url string
```

#### Compare a Password

```js
const isCorrect = await comparePassword('SomePassword!1!11', hash);
console.log(isCorrect); // true or false
```

### Configuration

| Option       | Type     | Default      | Description                                   |
|--------------|----------|--------------|-----------------------------------------------|
| keyLength    | number   | 48           | Length of the derived key (1–255)             |
| saltLength   | number   | 16           | Length of the salt (1–255)                    |
| encoding     | string   | 'base64url'  | Output encoding (e.g., 'hex', 'base64')       |

Global defaults can be adjusted via the `defaults` object:

```js
import { defaults } from 'crypto-shelf/authentication';

defaults.keyLength = 42;
defaults.saltLength = 13;
defaults.encoding = 'base64';
```

Or override per call:

```js
const keyLength = 32;
const saltLength = 12;
const encoding = 'hex';

const hash = await hashPassword('SomePassword!1!11', { keyLength, saltLength, encoding});
const isValid = await comparePassword('SomePassword!1!11', hash, { encoding });
```

### How It Works

- Generates a random salt
- Derives a key with `scrypt`
- Combines salt length, key length, salt, and key into a single encoded string
- Comparison re-derives the key and uses `timingSafeEqual` for verification

### Security

- Relies on `scrypt` for password hashing
- Mitigates timing attacks with `timingSafeEqual`
- Secure defaults with customizable options

---

## crypto-shelf/signature

Generates and verifies HMAC-based signatures using Node’s `crypto` module.

### Features

- Secret key generation with customizable algorithm and encoding
- HMAC signature creation and verification
- Constant-time comparison using Buffers
- Easy global or per-call configuration

### Usage

#### Import

```js
import { generateSecret, createSignature, verifySignature } from 'crypto-shelf/signature';
```

#### Generate a Secret

Generate a new cryptographic secret key and share it with the future receiver of data + signature.

```js
const secret = await generateSecret();
console.log(secret); // base64 string
```

#### Create a Signature

Creates an HMAC signature.

```js
const data = 'e.g. some JSON payload to send via webhook';
const signature = createSignature(secret, data);
console.log(signature); // base64 string

// Send signature + data to the receiver
```

#### Verify received Data + Signature

Verifies a given signature by recreating it and comparing.

```js
const isValid = verifySignature(secret, signature, data);
console.log('Data valid:', isValid);
```

### Configuration

| Option     | Type     | Default      | Description                                   |
|------------|----------|--------------|-----------------------------------------------|
| algorithm  | string   | 'sha256'     | HMAC algorithm (e.g., 'sha384')               |
| keyLength  | number   | null         | Derived key length (defaults to algorithm safe value) |
| encoding   | string   | 'base64url'  | Output encoding                               |

Global configuration via `defaults`:

```js
import { defaults } from 'crypto-shelf/signature';

defaults.algorithm = 'md5';
defaults.keyLength = 512;
defaults.encoding = 'hex';
```

Or per call:

```js
const algorithm = 'sha512';
const keyLength = 1024;
const encoding = 'base64url';

const secret = await generateSecret({ algorithm, keyLength, encoding });
const signature = createSignature(secret, data, { algorithm, encoding });
const isValid = verifySignature(secret, signature, data, { algorithm, encoding });
```

### How It Works

- Secret generated via `generateKey`
- HMAC created with `createHmac`
- Signature verified by re-creating and comparing to original

### Security

- Uses native `generateKey` and `createHmac`
- Constant-time comparison prevents signature leakage
- Customizable with secure defaults

---

## crypto-shelf/symmetric

A minimalistic API for symmetric encryption and decryption supporting strong modern authenticated encryption algorithms like `ChaCha20-Poly1305`, `AES-*-GCM` and `AES-*-OCB`.

### Features

- Support for almost all available encryption ciphers
- Secure key derivation with `scrypt`
- AAD support for additional integrity checks
- Encoded output with `base64url` by default
- Easy to use with sane defaults

### Usage

#### Import

```js
import {
  generateSalt,
  generateKey,
  encrypt,
  decrypt,
} from 'crypto-shelf/symmetric';
```

#### Encrypt and Decrypt Data

If the passphrase/password comes from a user, generate a salt and save only the salt per user (e. g. a user vault). If it is a system password saved e. g. in a .env file, salt can be omitted if password is strong enough (have a high entropy).

```js
const passphrase = 'strong password';
// const salt = generateSalt(); // optional

// The actual key for the encryption and decryption needs to be generated from the passphrase
const key = await generateKey(passphrase /*, salt */);

const plaintext = 'Hello world!';
const encrypted = encrypt(key, plaintext);
const decrypted = decrypt(key, encrypted);

console.log({ encrypted, decrypted });
```

### Configuration

| Option     | Type     | Default        | Description                                  |
|------------|----------|----------------|----------------------------------------------|
| algorithm  | string   | 'aes-256-gcm'  | Encryption algorithm to use                  |
| encoding   | string   | 'base64url'    | Output encoding                              |
| aad        | string   | null           | Additional Authenticated Data                |

Adjust global defaults:

```js
import { defaults } from 'crypto-shelf/symmetric';

defaults.algorithm = 'chacha20-poly1305';
defaults.encoding = 'base64';
defaults.aad = 'foobar';
```

Or configure per call:

```js
const algorithm = 'aes-192-gcm';
const encoding = 'hex';
const aad = 'Additional authentication data';

const passphrase = 'SomeVeryLongPassphrase!1!11';
const plaintext = 'Sensitive data the needs to be stored encrypted';

const salt = generateSalt({ encoding, saltLength: 32 }); // saltLength = 32 by default
const key = await generateKey(passphrase, salt, { algorithm, encoding });
const encrypted = encrypt(key, plaintext, { algorithm, encoding, aad });
const decrypted = decrypt(key, encrypted, { algorithm, encoding, aad });
```

### How It Works

- A salt is generated using `randomBytes`.
- `scrypt` is used to derive a secure key from the passphrase/password and salt.
- `createCipheriv` is used to create encryption data.
- The output includes:
  - Initialization vector (If supported from the algorithm)
  - The encrypted data
  - Authentication Tag (If supported from the algorithm)
- When decrypted, the initialization vector and auth tag are extracted from the encryption data.
- `createDecipheriv` is used to decrypt the encrypted data.

### Recommended Algorithms

- ChaCha20-Poly1305
- AES-*-GCM (AES-256-GCM default)
- AES-*-OCB

Verify Node.js version compatibility for algorithm support.

### Security Notes

- Use strong passphrases and unique salts when possible
- AAD must be the same for encryption and decryption
- Output includes IV, auth tag, and encrypted data

### Security

- Uses core `createCipheriv`/`createDecipheriv`
- Supports authenticated encryption modes
- Secure out of the box with override flexibility
