import { alertActions } from '.';
import { supermarketBrandConstants } from '../_constants';
import { supermarketBrandService } from '../_services';

export const supermarketBrandActions = {
    create,
    getAll,
    update,
    _delete,
};

function create(supermarketBrand) {
    return dispatch => {
        dispatch(request());

        supermarketBrandService.create(supermarketBrand)
        .then(
            response => {
                dispatch(success(response));
                dispatch(alertActions.success('Supermarket brand create successfully'));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    };

    function request() { return { type: supermarketBrandConstants.CREATE_REQUEST } }
    function success(supermarketBrand) { return { type: supermarketBrandConstants.CREATE_SUCCESS, supermarketBrand } }
    function failure(error) { return { type: supermarketBrandConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        supermarketBrandService.getAll()
            .then(
                searchResults => dispatch(success(searchResults)),
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: supermarketBrandConstants.GETALL_REQUEST } }
    function success(searchResult) { return { type: supermarketBrandConstants.GETALL_SUCCESS, searchResult } }
    function failure(error) { return { type: supermarketBrandConstants.GETALL_FAILURE, error } }
}

function update(supermarketBrand) {
    return dispatch => {
        dispatch(request());

        supermarketBrandService.update(supermarketBrand)
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

    function request() { return { type: supermarketBrandConstants.UPDATE_REQUEST } }
    function success(updatedBrand) { return { type: supermarketBrandConstants.UPDATE_SUCCESS, updatedBrand } }
    function failure(error) { return { type: supermarketBrandConstants.UPDATE_FAILURE, error } }
}

// delete is a JS reserved word, so we need to use _delete instead
function _delete(id) {
    return dispatch => {
        dispatch(request());
        
        supermarketBrandService._delete(id)
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

    function request() { return { type: supermarketBrandConstants.DELETE_REQUEST } }
    function success(id) { return { type: supermarketBrandConstants.DELETE_SUCCESS, id } }
    function failure(error) { return { type: supermarketBrandConstants.DELETE_FAILURE, error } }

}