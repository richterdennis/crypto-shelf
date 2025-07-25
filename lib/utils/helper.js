export function merge(...objects) {
	const merged = {};
	Object.assign(merged, ...objects);
	return merged;
}
