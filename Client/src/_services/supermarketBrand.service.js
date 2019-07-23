import config from 'config';
import { authHeader } from '../_helpers';

export const supermarketBrandService = {
    create,
    getAll,
    update,
    _delete,
};

function create(supermarketBrand) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(supermarketBrand)
    };
    // Call the server API
    return fetch(`${config.apiUrl}/api/SupermarketBrand`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
    };
    return fetch(`${config.apiUrl}/api/SupermarketBrand`, requestOptions).then(handleResponse);
}

function update(supermarketBrand) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(supermarketBrand)
    };
    // Call the server API
    return fetch(`${config.apiUrl}/api/SupermarketBrand/${supermarketBrand.id}`, requestOptions).then(handleResponse);
}

function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(id)
    };
    // Call the server API
    return fetch(`${config.apiUrl}/api/SupermarketBrand/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401)
                location.reload(true);

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}