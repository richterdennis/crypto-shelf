
export default function ProxyS(definition) {
	return (target, ...args) => {
		const data = definition.data();

		const proxy = new Proxy(target, {
			get: get.bind(null, data, definition.methods),
			set: set.bind(null, data),
		});

		definition.constructor.call(proxy, target, ...args);

		return proxy;
	};
}

function get(data, methods, target, prop, receiver) {
	if (Object.prototype.hasOwnProperty.call(data, prop)) {
		return data[prop];
	}

	if (Object.prototype.hasOwnProperty.call(methods, prop)) {
		return methods[prop].bind(receiver);
	}

	for (const key of Object.keys(methods)) {
		if (
			typeof prop !== 'string'
			|| typeof key !== 'string'
		) break;

		if (!key.includes('*')) continue;

		const [start, end] = key.split('*');

		if (
			!prop.startsWith(start)
			|| !prop.endsWith(end)
		) continue;

		return methods[key].bind(receiver, prop, target[prop].bind(target));
	}

	if (prop in target && target[prop] instanceof Function) {
		return target[prop].bind(target);
	}

	return target[prop];
}

function set(data, target, prop, value) {
	if (prop in data) {
		return data[prop] = value;
	}

	return target[prop] = value;
}
