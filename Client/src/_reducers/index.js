import { combineReducers } from 'redux';
import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { supermarketBrands } from './supermarketBrand.reducer';
import { supermarketLocation } from './supermarketLocation.reducer';
import { users } from './users.reducer';


const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  supermarketBrands,
  supermarketLocation,
});

export default rootReducer;