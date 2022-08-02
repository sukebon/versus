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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase/index';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //登録
  const createUser = () => {
    setSpinner(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(userCredential.user);
        try {
          const docRef = await setDoc(
            doc(db, 'users', userCredential.user.uid),
            {
              uid: userCredential.user.uid,
              username,
              email,
            }
          );
          window.alert('成功しました。');
        } catch (e) {
          console.error('Error adding document: ', e);
        } finally {
          setSpinner(false);
        }
        router.push('/dashboard');
        console.log('登録');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert('失敗ししました');
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const signInUser = () => {
    setSpinner(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // router.push('/dashboard');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert('失敗ししました');
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
          {toggle ? 'log in' : 'アカウント作成'}
        </Flex>
        <Flex flexDirection='column' justifyContent='space-around' px={6}>
          {!toggle && (
            <Input
              type='text'
              w='100%'
              backgroundColor='rgb(232 240 254)'
              placeholder='ユーザー名'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <Input
            type='text'
            w='100%'
            mt={toggle ? '0' : '3'}
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
          {toggle ? (
            <>
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
              <Box
                my={3}
                fontSize='xs'
                color='whiteAlpha.900'
                textAlign='center'
              >
                アカウントをお持ちでないですか？
                <Text
                  as='span'
                  ml={2}
                  textDecoration='underline'
                  onClick={() => setToggle(false)}
                  cursor='pointer'
                >
                  新規登録
                </Text>
              </Box>
            </>
          ) : (
            <>
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
              <Box
                my={3}
                fontSize='xs'
                color='whiteAlpha.900'
                textAlign='center'
              >
                すでにアカウントをお持ちですか？
                <Text
                  as='span'
                  ml={2}
                  textDecoration='underline'
                  onClick={() => setToggle(true)}
                  cursor='pointer'
                >
                  ログイン
                </Text>
              </Box>
            </>
          )}
        </Flex>
      </Container>
    </Flex>
  );
};

export default Login;
