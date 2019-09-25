import { alertActions } from '.';
import { priceConstants } from '../_constants';
import { priceService } from '../_services';

export const priceActions = {
    create,
};

function create(price) {
    return dispatch => {
        dispatch(request());

        priceService.create(price)
        .then(
            response => {
                dispatch(success(response));
                dispatch(alertActions.success('Price created successfully'));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    };

    function request() { return { type: priceConstants.CREATE_REQUEST } }
    function success(price) { return { type: priceConstants.CREATE_SUCCESS, price } }
    function failure(error) { return { type: priceConstants.CREATE_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request());

        priceService.getById(id)
            .then(
                price => dispatch(success(price)),
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: priceConstants.GETALL_REQUEST } }
    function success(price) { return { type: priceConstants.GETALL_SUCCESS, price } }
    function failure(error) { return { type: priceConstants.GETALL_FAILURE, error } }
}

function search(search) {
    return dispatch => {
        dispatch(request());

        priceService.search(search)
            .then(
                searchResults => dispatch(success(searchResults)),
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: priceConstants.SEARCH_REQUEST } }
    function success(searchResults) { return { type: priceConstants.SEARCH_SUCCESS, searchResults } }
    function failure(error) { return { type: priceConstants.SEARCH_FAILURE, error } }
}

function update(supermarketBrand) {
    return dispatch => {
        dispatch(request());

        priceService.update(supermarketBrand)
            .then(
                updatedSupermarketBrand => {
                    dispatch(success(updatedSupermarketBrand));
                    dispatch(alertActions.success('Supermarket updated'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: priceConstants.UPDATE_REQUEST } }
    function success(updatedBrand) { return { type: priceConstants.UPDATE_SUCCESS, updatedBrand } }
    function failure(error) { return { type: priceConstants.UPDATE_FAILURE, error } }
}

// delete is a JS reserved word, so we need to use _delete instead
function _delete(id) {
    return dispatch => {
        dispatch(request());
        
        priceService._delete(id)
            .then(
                response => {
                    dispatch(success(response));
                    dispatch(alertActions.success('Supermarket deleted successfully'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: priceConstants.DELETE_REQUEST } }
    function success(id) { return { type: priceConstants.DELETE_SUCCESS, id } }
    function failure(error) { return { type: priceConstants.DELETE_FAILURE, error } }

}