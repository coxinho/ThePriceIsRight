import { priceConstants } from '../_constants';

export function price(state = {}, action) {
	switch (action.type) {
		case priceConstants.CREATE_REQUEST:
			return {
				...state,
				loading: true,
			};
		case priceConstants.CREATE_SUCCESS:
			return {
				...state
			};
		case priceConstants.CREATE_FAILURE:
			return {
				error: action.error
			};

		case priceConstants.SEARCH_REQUEST:
			return {
				...state,
				loading: true
			};
		case priceConstants.SEARCH_SUCCESS:
			return {
				searchResults: [...action.searchResults],
			};
		case priceConstants.SEARCH_FAILURE:
			return { 
				error: action.error
			};

		case priceConstants.UPDATE_REQUEST:
			return {
				...state,
				loading: true
			};
		case priceConstants.UPDATE_SUCCESS:
			return {
				...state
			};
		case priceConstants.UPDATE_FAILURE:
			return {
				error: action.error
			};

		case priceConstants.DELETE_REQUEST:
			return {
				...state,
				deleting: true
			};
		case priceConstants.DELETE_SUCCESS:
			return {
				...state
			};
		case priceConstants.DELETE_FAILURE:
			return {
				error: action.error
			};

		default:
			return state
	}
}