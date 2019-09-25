import { combineReducers } from 'redux';
import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { price } from './price.reducer';
import { products } from './products.reducer';
import { supermarketBrands } from './supermarketBrand.reducer';
import { supermarketLocations } from './supermarketLocation.reducer';
import { users } from './users.reducer';


const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  price,
  products,
  supermarketBrands,
  supermarketLocations,
});

export default rootReducer;