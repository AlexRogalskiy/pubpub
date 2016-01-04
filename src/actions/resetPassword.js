/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const REQUEST_LOAD = 'resetPassword/REQUEST_LOAD';
export const REQUEST_SUCCESS = 'resetPassword/REQUEST_LOAD_SUCCESS';
export const REQUEST_FAIL = 'resetPassword/REQUEST_LOAD_FAIL';

export const HASH_LOAD = 'resetPassword/HASH_LOAD';
export const HASH_SUCCESS = 'resetPassword/HASH_LOAD_SUCCESS';
export const HASH_FAIL = 'resetPassword/HASH_LOAD_FAIL';

export const RESET_LOAD = 'resetPassword/RESET_LOAD';
export const RESET_SUCCESS = 'resetPassword/RESET_LOAD_SUCCESS';
export const RESET_FAIL = 'resetPassword/RESET_LOAD_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function submitResetRequest(email) {
	return {
		types: [REQUEST_LOAD, REQUEST_SUCCESS, REQUEST_FAIL],
		promise: (client) => client.get('/requestReset', {params: {
			'email': email
		}})
	};
}

export function checkHash(hash) {
	return {
		types: [HASH_LOAD, HASH_SUCCESS, HASH_FAIL],
		promise: (client) => client.get('/checkResetHash', {params: {
			'hash': hash
		}})
	};
}

export function resetPassword(hash, username, password) {
	return {
		types: [RESET_LOAD, RESET_SUCCESS, RESET_FAIL],
		promise: (client) => client.get('/passwordReset', {params: {
			'hash': hash,
			'username': username,
			'password': password,
		}})
	};
}
