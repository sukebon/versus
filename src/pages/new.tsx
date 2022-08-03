import { Box, Button, Container, Flex, Input, Spinner } from '@chakra-ui/react';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import Layout from '../components/Layout';

const New = () => {
  const user = auth.currentUser;
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [title, setTitle] = useState('');
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const postCreate = async () => {
    setSpinner(true);
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        user: user?.uid,
        title,
      });
      window.alert('作成しました。');
      router.push(`/dashboard/${docRef.id}`);
    } catch (e) {
      console.error('Error adding document: ', e);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <>
      {user && (
        <Layout>
          {spinner && (
            <Flex
              position='fixed'
              width='100%'
              height='80vh'
              justifyContent='center'
              alignItems='center'
              zIndex={10}
            >
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
            </Flex>
          )}
          <Box h='100vh' backgroundColor='#f7f7f7' position='relative'>
            <Container>
              <Flex flexDirection='column' alignItems='center' p={12}>
                <Box as='h1'>サービス情報を入力</Box>
                <Box as='h2'>下記入力欄を記入してください。</Box>
              </Flex>
              <Flex
                flexDirection='column'
                alignItems='left'
                p={12}
                backgroundColor='white'
                borderRadius={6}
              >
                <Box fontWeight='bold'>タイトル</Box>
                <Box fontSize='xs'>アプリのタイトルを設定してください。</Box>
                <Input
                  type='text'
                  mt={3}
                  borderColor='gray.400'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Box fontWeight='bold' mt={6}>
                  サービスID
                </Box>
                <Box fontSize='xs'>サービスIDは作成するページのURLです。</Box>
                <Input type='text' mt={3} borderColor='gray.400' />
              </Flex>
              <Flex>
                <Button
                  w='200px'
                  mt={12}
                  mx='auto'
                  colorScheme='orange'
                  justifySelf='center'
                  cursor='pointer'
                  onClick={() => postCreate()}
                >
                  作成する
                </Button>
              </Flex>
            </Container>
          </Box>
        </Layout>
      )}
    </>
  );
};

export default New;
