import { Box, Button, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, []);
  return <Box></Box>;
};
export default Home;
