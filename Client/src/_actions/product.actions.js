import { alertActions } from '.';
import { productConstants } from '../_constants';
import { productService } from '../_services';

export const productActions = {
    create,
    getById,
    search,
    update,
    _delete,
};

function create(product) {
    return dispatch => {
        dispatch(request());

        productService.create(product)
        .then(
            response => {
                dispatch(success(response));
                dispatch(alertActions.success('Product create successfully'));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    };

    function request() { return { type: productConstants.CREATE_REQUEST } }
    function success(product) { return { type: productConstants.CREATE_SUCCESS, product } }
    function failure(error) { return { type: productConstants.CREATE_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request());

        productService.getById(id)
            .then(
                product => dispatch(success(product)),
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: productConstants.GETALL_REQUEST } }
    function success(product) { return { type: productConstants.GETALL_SUCCESS, product } }
    function failure(error) { return { type: productConstants.GETALL_FAILURE, error } }
}

function search(search) {
    return dispatch => {
        dispatch(request());

        productService.search(search)
            .then(
                searchResults => dispatch(success(searchResults)),
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: productConstants.GETALL_REQUEST } }
    function success(searchResults) { return { type: productConstants.GETALL_SUCCESS, searchResults } }
    function failure(error) { return { type: productConstants.GETALL_FAILURE, error } }
}

function update(supermarketBrand) {
    return dispatch => {
        dispatch(request());

        productService.update(supermarketBrand)
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

    function request() { return { type: productConstants.UPDATE_REQUEST } }
    function success(updatedBrand) { return { type: productConstants.UPDATE_SUCCESS, updatedBrand } }
    function failure(error) { return { type: productConstants.UPDATE_FAILURE, error } }
}

// delete is a JS reserved word, so we need to use _delete instead
function _delete(id) {
    return dispatch => {
        dispatch(request());
        
        productService._delete(id)
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

    function request() { return { type: productConstants.DELETE_REQUEST } }
    function success(id) { return { type: productConstants.DELETE_SUCCESS, id } }
    function failure(error) { return { type: productConstants.DELETE_FAILURE, error } }

}