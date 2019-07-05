
export function setKeyValue ( key, value ) {
    sessionStorage.setItem(key, value);
}
export function getKeyValue (key) {
	return sessionStorage.getItem(key);
}
export function removeKey (key) {
	sessionStorage.removeItem(key);
}
export function flushAll () {
	sessionStorage.clear();
}
export function getSearch () {
	return window.location.search.slice(1).split('&').map(item => ({ [item.split('=')[0]]: item.split('=')[1] }));
}