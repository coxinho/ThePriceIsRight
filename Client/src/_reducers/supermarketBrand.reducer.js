import { supermarketBrandConstants } from '../_constants';

export function supermarketBrands(state = {}, action) {
	switch (action.type) {
		case supermarketBrandConstants.CREATE_REQUEST:
			return {
				...state,
				loading: true,
			};
		case supermarketBrandConstants.CREATE_SUCCESS:
			state['loading'] = false;
			let { searchResults } = state;
			if(searchResults)
				searchResults.push(action.supermarketBrand);
			else
				state['searchResults'] = action.supermarketBrand;
			return {
				...state
			};
		case supermarketBrandConstants.CREATE_FAILURE:
			return {
				error: action.error
			};

		case supermarketBrandConstants.GETALL_REQUEST:
			return {
				loading: true
			};
		case supermarketBrandConstants.GETALL_SUCCESS:
			return {
				searchResults: [...action.searchResult],
			};
		case supermarketBrandConstants.GETALL_FAILURE:
			return { 
				error: action.error
			};

		case supermarketBrandConstants.UPDATE_REQUEST:
			return {
				...state,
				loading: true
			};
		case supermarketBrandConstants.UPDATE_SUCCESS:
			state['loading'] = false;
			state.searchResults[state.searchResults.findIndex(el => el.id === action.updatedBrand.id)] = action.updatedBrand;
			return {
				...state
			};
		case supermarketBrandConstants.UPDATE_FAILURE:
			return {
				error: action.error
			};

		case supermarketBrandConstants.DELETE_REQUEST:
			return {
				...state,
				deleting: true
			};
		case supermarketBrandConstants.DELETE_SUCCESS:
			state['deleting'] = false;
			state.searchResults = state.searchResults.filter(elem => elem.id != action.id);
			return {
				...state
			};
		case supermarketBrandConstants.DELETE_FAILURE:
			return {
				error: action.error
			};

		default:
			return state
	}
}