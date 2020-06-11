import { createStore } from 'easy-peasy';
import coronaData from './coronaDataStore';

const store = createStore({
  coronaData,
});

export default store;
