'use client';

import { Provider } from 'react-redux';
import store from './store'

interface ClientProviderProps {
  children: React.ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ClientProvider;

// 'use client';

// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import store, { persistor } from './store'; // 引入 persistor

// interface ClientProviderProps {
//   children: React.ReactNode;
// }

// const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         {children}
//       </PersistGate>
//     </Provider>
//   );
// };

// export default ClientProvider;
