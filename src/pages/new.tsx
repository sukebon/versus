import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Spinner,
  Textarea,
} from '@chakra-ui/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import Layout from '../components/Layout';
import SpinnerArea from '../components/SpinnerArea';

const New = () => {
  const user = auth.currentUser;
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  //Postを作成
  const postCreate = async () => {
    setSpinner(true);
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        user: user?.uid,
        title,
        desc,
        timestamp: serverTimestamp(),
      });
      window.alert('作成しました。');
      router.push(`/dashboard/media/${docRef.id}`);
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
          <SpinnerArea spinner={spinner} />
          <Box
            h='100vh'
            backgroundColor='#f7f7f7'
            pt='70px'
            position='relative'
          >
            <Container mt={12} maxW='800px'>
              <Flex flexDirection='column' alignItems='center'>
                <Box as='h1'>アプリを作成</Box>
              </Flex>
              <Flex
                flexDirection='column'
                alignItems='left'
                mt={6}
                p={12}
                backgroundColor='white'
                borderRadius={6}
              >
                <Box fontWeight='bold'>タイトル</Box>
                <Box mt={1} color='gray.500' fontSize='xs'>
                  作成するアプリの名前を入力してください。
                </Box>
                <Input
                  type='text'
                  mt={3}
                  borderColor='gray.400'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Box mt={6} fontWeight='bold'>
                  説明
                </Box>
                <Box mt={1} color='gray.500' fontSize='xs'>
                  作成するアプリの説明を記入してください。
                </Box>
                <Textarea
                  mt={3}
                  borderColor='gray.400'
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </Flex>
              <Flex flexDirection='column' alignItems='center'>
                <Button
                  w='200px'
                  mt={6}
                  mx='auto'
                  colorScheme='orange'
                  cursor='pointer'
                  disabled={!title}
                  onClick={() => postCreate()}
                >
                  作成する
                </Button>
                <Link href='/dashboard'>
                  <a>
                    <Button
                      w='100px'
                      mt={6}
                      mx='auto'
                      justifySelf='center'
                      cursor='pointer'
                    >
                      戻る
                    </Button>
                  </a>
                </Link>
              </Flex>
            </Container>
          </Box>
        </Layout>
      )}
    </>
  );
};

export default New;
