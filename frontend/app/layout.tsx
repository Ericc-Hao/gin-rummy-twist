import './globals.css';
import { Metadata } from 'next';
import ClientProvider from '@shared-store/ClientProvider'


export const metadata: Metadata = {
  title: 'Cookie Stock',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="h-full w-full">
      <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}

// import React from 'react';
// import './globals.css';
// import { Metadata } from 'next';
// import ClientProvider from '@shared-store/ClientProvider';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// export const metadata: Metadata = {
//   title: 'Cookie Stock',
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en">
//       <body className="h-full w-full">
//         <DndProvider backend={HTML5Backend}>
//           <ClientProvider>
//             {children}
//           </ClientProvider>
//         </DndProvider>
//       </body>
//     </html>
//   );
// }

