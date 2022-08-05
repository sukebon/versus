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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/index';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInUser = () => {
    setSpinner(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push('/dashboard');
        window.alert('ログインしました');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert('失敗しました');
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
      backgroundColor='gray.900'
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

      <Container maxW='400px' p={0} backgroundColor='gray.800' borderRadius={6}>
        <Flex
          w='100%'
          h='70px'
          justifyContent='center'
          alignItems='center'
          color='white'
          fontSize='2xl'
        >
          Sign in
        </Flex>
        <Flex flexDirection='column' justifyContent='space-around' px={6}>
          <Input
            type='text'
            w='100%'
            mt={0}
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
            disabled={!email || !password}
            onClick={signInUser}
          >
            ログイン
          </Button>
          <Box my={3} fontSize='xs' color='whiteAlpha.900' textAlign='center'>
            アカウントをお持ちでないですか？
            <Link href='/signup'>
              <a>
                <Text
                  as='span'
                  ml={2}
                  textDecoration='underline'
                  cursor='pointer'
                >
                  新規登録
                </Text>
              </a>
            </Link>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Login;
