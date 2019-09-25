import { supermarketLocationConstants } from '../_constants';

export function supermarketLocations(state = {}, action) {
	switch (action.type) {
		case supermarketLocationConstants.CREATE_REQUEST:
			return {
				...state,
				loading: true,
			};
		case supermarketLocationConstants.CREATE_SUCCESS:
			state['loading'] = false;
			let { supermarketLocations } = state;
			if(supermarketLocations)
				supermarketLocations.push(action.supermarketLocation);
			else
				state['supermarketLocations'] = action.supermarketLocation;
			return {
				...state
			};
		case supermarketLocationConstants.CREATE_FAILURE:
			return {
				error: action.error
			};

		case supermarketLocationConstants.GETALL_REQUEST:
			return {
				loading: true
			};
		case supermarketLocationConstants.GETALL_SUCCESS:
			return {
				searchResults: [...action.searchResult],
			};
		case supermarketLocationConstants.GETALL_FAILURE:
			return { 
				error: action.error
			};

		case supermarketLocationConstants.SEARCH_REQUEST:
			return {
				loading: true
			};
		case supermarketLocationConstants.SEARCH_SUCCESS:
			return {
				searchResults: [...action.searchResults],
			};
		case supermarketLocationConstants.SEARCH_FAILURE:
			return { 
				error: action.error
			};

		case supermarketLocationConstants.UPDATE_REQUEST:
			return {
				...state,
				loading: true
			};
		case supermarketLocationConstants.UPDATE_SUCCESS:
			state['loading'] = false;
			state.searchResults[state.searchResults.findIndex(el => el.id === action.updatedLocation.id)] = action.updatedLocation;
			return {
				...state
			};
		case supermarketLocationConstants.UPDATE_FAILURE:
			return {
				error: action.error
			};

		case supermarketLocationConstants.DELETE_REQUEST:
			return {
				...state,
				deleting: true
			};
		case supermarketLocationConstants.DELETE_SUCCESS:
			state['deleting'] = false;
			state.searchResults = state.searchResults.filter(elem => elem.id != action.id);
			return {
				...state
			};
		case supermarketLocationConstants.DELETE_FAILURE:
			return {
				error: action.error
			};

		default:
			return state
	}
}