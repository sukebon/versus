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
import { auth } from '../../firebase/index';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';

const Register = () => {
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [passwordConfirmation, setPasswordConfirmation] = useState('');

  //登録
  const createUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinner(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        updateProfile(userCredential.user, {
          displayName: username,
          photoURL: '',
        }).then(() => {
          console.log(userCredential.user);
          router.push('/dashboard');
        });
      })
      .catch((error) => {
        console.log(error);
        window.alert('登録失敗');
      })
      .finally(() => {
        setSpinner(false);
      });
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
          <form onSubmit={(e) => createUser(e)}>
            <Flex flexDirection='column' justifyContent='space-around' px={6}>
              <Input
                type='text'
                w='100%'
                backgroundColor='rgb(232 240 254)'
                placeholder='ユーザー名'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type='email'
                w='100%'
                mt={3}
                backgroundColor='rgb(232 240 254)'
                placeholder='メールアドレス'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type='password'
                w='100%'
                mt={3}
                backgroundColor='rgb(232 240 254)'
                placeholder='パスワード'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <Button
                type='submit'
                mt={3}
                color='white'
                backgroundColor='facebook.600'
                _hover={{ backgroundColor: 'facebook.500' }}
                // disabled={!username || !email || !email}
              >
                新規登録
              </Button>
              <Box
                my={3}
                fontSize='xs'
                color='whiteAlpha.900'
                textAlign='center'
              >
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
          </form>
        </Container>
      </Layout>
    </Flex>
  );
};

export default Register;
