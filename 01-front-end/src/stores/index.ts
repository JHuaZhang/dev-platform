import { createContext, useContext } from 'react';
import AppStore from './AppStore';

const stores = {
  appStore: AppStore
};

export const StoreContext = createContext(stores);

export const useStores = () => {
  return useContext(StoreContext);
};

export default stores;
