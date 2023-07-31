function documentGetElementByNamesArray(names) {
	// DEPRECATED
	// Look for specific DOM Elements by matching input names
	// If parameter is an Array, search for first existed name in DOM
	// If parameter is a String, similar to standart function

	let ind = -1;
	if (Array.isArray(names)) {
		if (names.some((name,index) => {
			ind = index;
			return document.getElementsByName(name).length > 0;
		})) return document.getElementsByName(names[ind]);
	} else if (typeof names == 'string') {
		return document.getElementsByName(names);
	} else return undefined
}

