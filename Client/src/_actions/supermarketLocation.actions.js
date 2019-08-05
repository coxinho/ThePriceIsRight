import { alertActions } from '.';
import { supermarketLocationConstants } from '../_constants';
import { supermarketLocationService } from '../_services';

export const supermarketLocationActions = {
    create,
    getAll,
    update,
    _delete,
};

function create(supermarketLocation) {
    return dispatch => {
        dispatch(request());

        supermarketLocationService.create(supermarketLocation)
        .then(
            response => {
                dispatch(success(response));
                dispatch(alertActions.success('Supermarket location created successfully'));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    };

    function request() { return { type: supermarketLocationConstants.CREATE_REQUEST } }
    function success(supermarketLocation) { return { type: supermarketLocationConstants.CREATE_SUCCESS, supermarketLocation } }
    function failure(error) { return { type: supermarketLocationConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        supermarketLocationService.getAll()
            .then(
                searchResults => dispatch(success(searchResults)),
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: supermarketLocationConstants.GETALL_REQUEST } }
    function success(searchResult) { return { type: supermarketLocationConstants.GETALL_SUCCESS, searchResult } }
    function failure(error) { return { type: supermarketLocationConstants.GETALL_FAILURE, error } }
}

function update(supermarketLocation) {
    return dispatch => {
        dispatch(request());

        supermarketLocationService.update(supermarketLocation)
            .then(
                updatedSupermarketLocation => {
                    dispatch(success(updatedSupermarketLocation));
                    dispatch(alertActions.success('Supermarket updated'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: supermarketLocationConstants.UPDATE_REQUEST } }
    function success(updatedLocation) { return { type: supermarketLocationConstants.UPDATE_SUCCESS, updatedLocation } }
    function failure(error) { return { type: supermarketLocationConstants.UPDATE_FAILURE, error } }
}

// delete is a JS reserved word, so we need to use _delete instead
function _delete(id) {
    return dispatch => {
        dispatch(request());
        
        supermarketLocationService._delete(id)
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

    function request() { return { type: supermarketLocationConstants.DELETE_REQUEST } }
    function success(id) { return { type: supermarketLocationConstants.DELETE_SUCCESS, id } }
    function failure(error) { return { type: supermarketLocationConstants.DELETE_FAILURE, error } }

}