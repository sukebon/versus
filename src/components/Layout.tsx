import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      {/* <Sidebar /> */}
      {children}
    </>
  );
};

export default Layout;
