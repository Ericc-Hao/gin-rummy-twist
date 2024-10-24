// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user';
import testReducer from './slices/test';

const store = configureStore({
  reducer: {
    user: userReducer,
    test: testReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
export default store;

// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './slices/user';
// import testReducer from './slices/test';

// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // 使用 localStorage 进行持久化

// // 持久化配置
// const persistConfig = {
//   key: 'root',
//   storage,
// };

// // 持久化的 user reducer
// const persistedUserReducer = persistReducer(persistConfig, userReducer);

// // 持久化的 test reducer
// const persistedTestReducer = persistReducer(persistConfig, testReducer);

// // 配置 store
// const store = configureStore({
//   reducer: {
//     user: persistedUserReducer, // 持久化后的 user reducer
//     test: persistedTestReducer, // 持久化后的 test reducer
//   },
//   devTools: process.env.NODE_ENV !== 'production',
// });

// // 创建 persistor
// export const persistor = persistStore(store);

// export default store;

