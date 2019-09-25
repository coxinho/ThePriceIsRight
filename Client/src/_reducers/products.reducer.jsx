import { productConstants } from '../_constants';

export function products(state = {}, action) {
	switch (action.type) {
		case productConstants.CREATE_REQUEST:
			return {
				...state,
				loading: true,
			};
		case productConstants.CREATE_REQUEST:
			return {
				...state
			};
		case productConstants.CREATE_FAILURE:
			return {
				error: action.error
			};

		case productConstants.SEARCH_REQUEST:
			return {
				...state,
				loading: true
			};
		case productConstants.SEARCH_SUCCESS:
			return {
				searchResults: [...action.searchResults],
			};
		case productConstants.SEARCH_FAILURE:
			return { 
				error: action.error
			};

		case productConstants.UPDATE_REQUEST:
			return {
				...state,
				loading: true
			};
		case productConstants.UPDATE_SUCCESS:
			return {
				...state
			};
		case productConstants.UPDATE_FAILURE:
			return {
				error: action.error
			};

		case productConstants.DELETE_REQUEST:
			return {
				...state,
				deleting: true
			};
		case productConstants.DELETE_SUCCESS:
			return {
				...state
			};
		case productConstants.DELETE_FAILURE:
			return {
				error: action.error
			};

		default:
			return state
	}
}