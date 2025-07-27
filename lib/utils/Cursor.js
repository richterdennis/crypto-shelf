import defineProxy from './Proxy.js';

const BYTE_LENGTH = {
	Int8: 1,
	Int16: 2,
	Int32: 4,
	BigInt64: 8,
	Float: 4,
	Double: 8,
};

const Cursor = defineProxy({
	data: () => ({
		cursor: 0,
		buffer: null,
	}),

	constructor(buffer) {
		this.buffer = buffer;
	},

	methods: {
		// Read the next x bytes
		read(byteLength = -0, encoding = null) {
			if (byteLength < 0 || Object.is(byteLength, -0)) {
				byteLength = this.buffer.length - this.cursor + byteLength;
			}

			const sub = this.buffer.subarray(this.cursor, this.cursor + byteLength);
			this.cursor += byteLength;
			return encoding ? sub.toString(encoding) : sub;
		},

		// Write into buffer
		write(value, encoding = 'utf8') {
			// Write and copy return bytes written/copied
			this.cursor += Buffer.isBuffer(value)
				? value.copy(this.buffer, this.cursor)
				: this.buffer.write(value, this.cursor, encoding);

			// Return proxy for easy chaining
			return this;
		},

		// Track cursor on read functions
		['read*'](fnName, ...args) {
			// Insert cursor as offset into args list
			args.splice(0, 0, this.cursor);

			// (U)IntBE, (U)IntLE have byte length as argument
			if (fnName.endsWith('IntBE') || fnName.endsWith('IntLE')) {
				const byteLength = args[0];
				this.cursor += byteLength;
			}

			// Otherwise get fixed byte length
			else {
				this.cursor += BYTE_LENGTH[
					fnName.slice(4)
						.replace('U', '')
						.replace('BE', '')
						.replace('LE', '')
				];
			}

			return this.buffer[fnName](...args);
		},

		// Track cursor on write functions
		['write*'](fnName, ...args) {
			// Insert cursor as offset into args list
			args.splice(1, 0, this.cursor);

			// Write fns return the correct cursor
			this.cursor = this.buffer[fnName](...args);

			// Return proxy for easy chaining
			return this;
		},

		// Read the rest bytes
		rest(encoding = null) {
			const sub = this.buffer.subarray(this.cursor);
			this.cursor = this.buffer.length;
			return encoding ? sub.toString(encoding) : sub;
		},

		// Offset cursor
		offset(offset) {
			this.cursor += offset;

			// Return proxy for easy chaining
			return this;
		},

		// Reset cursor
		reset() {
			this.cursor = 0;

			// Return proxy for easy chaining
			return this;
		},
	},
});

Cursor.from = (buffer, ...args) => new Cursor(
	Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer, ...args),
);

Cursor.new = size => new Cursor(
	Buffer.allocUnsafe(size),
);

export default Cursor;
