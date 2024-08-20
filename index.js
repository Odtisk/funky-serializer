function serialize(source) {
	return JSON.stringify(preproccessValue(source));
}

function deserialize(serialized) {
	return postproccessValue(JSON.parse(serialized));
}

function preproccessValue(value) {
	if (Array.isArray(value))
		return value.map(item => preproccessValue(item));

	else if (value && typeof value === "object")
		return mapObject(value, preproccessValue);

	else if (typeof value === "function")
		return value.toString();

	return value;
}

function postproccessValue(value) {
	if (Array.isArray(value))
		return value.map(item => postproccessValue(item));
	
	else if (value && typeof value === "object")
		return mapObject(value, postproccessValue);

	let isFunction = /function.*\(.*\).*\{.*|.*=>.*/.test(value);
	let func;

	try {
		func = new Function(`return ${value}`)();
	} catch {
		isFunction = false;
	} finally {
		return isFunction ? func : value;
	}
}

function mapObject(obj, fn) {
	return Object.fromEntries(
		Object.entries(obj).map(
			([k, v], i) => [k, fn(v, k, i)]
		)
	);
}

module.exports = { serialize, deserialize }