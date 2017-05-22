
const trimString = (s, ml) => {
	const maxLength = ml || 25;
	if(s.length <= maxLength) return s;
	let trimmedString = s.substr(0, maxLength);
	trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
	return trimmedString+"...";
}

export default trimString;