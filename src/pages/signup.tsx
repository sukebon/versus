import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase/index';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';

const SignUp = () => {
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //登録
  const createUser = () => {
    setSpinner(true);
    createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        // Signed in
        updateProfile(userCredential.user, {
          displayName: username,
          photoURL: '',
        })
          .then(() => {
            console.log(userCredential.user);
          })
          .catch(() => {})
          .finally(() => {
            router.push('/dashboard');
            setSpinner(false);
          });
      }
    );
  };

  return (
    <Flex
      w='100%'
      h='100vh'
      alignItems='center'
      justifyContent='center'
      px={6}
      position='relative'
    >
      {spinner && (
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
          position='absolute'
          zIndex={100}
          style={{ transform: 'translate(-50%,-50%)' }}
        />
      )}
      <Layout>
        <Container
          maxW='400px'
          p={0}
          backgroundColor='#122449'
          borderRadius={6}
        >
          <Flex
            w='100%'
            h='70px'
            justifyContent='center'
            alignItems='center'
            color='white'
            fontSize='2xl'
          >
            アカウント作成
          </Flex>
          <Flex flexDirection='column' justifyContent='space-around' px={6}>
            <Input
              type='text'
              w='100%'
              backgroundColor='rgb(232 240 254)'
              placeholder='ユーザー名'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type='text'
              w='100%'
              mt={3}
              backgroundColor='rgb(232 240 254)'
              placeholder='メールアドレス'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              w='100%'
              mt={3}
              backgroundColor='rgb(232 240 254)'
              placeholder='パスワード'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              mt={3}
              color='white'
              backgroundColor='facebook.600'
              _hover={{ backgroundColor: 'facebook.500' }}
              onClick={createUser}
              disabled={!username || !email || !email}
            >
              新規登録
            </Button>
            <Box my={3} fontSize='xs' color='whiteAlpha.900' textAlign='center'>
              すでにアカウントをお持ちですか？
              <Link href='/login'>
                <Text
                  as='span'
                  ml={2}
                  textDecoration='underline'
                  cursor='pointer'
                >
                  ログイン
                </Text>
              </Link>
            </Box>
          </Flex>
        </Container>
      </Layout>
    </Flex>
  );
};

export default SignUp;
