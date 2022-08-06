import { Box, Button, Container, Flex, Input } from '@chakra-ui/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import Layout from '../../../components/Layout';

const TitleId = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');

  //postsからタイトルを取得
  useEffect(() => {
    const getPost = async () => {
      try {
        const docRef = doc(db, 'posts', `${id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title);
          setOriginalTitle(docSnap.data().title);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [id]);

  //postsからタイトルを取得

  const updatePost = async () => {
    try {
      const docRef = doc(db, 'posts', `${id}`);
      await updateDoc(docRef, {
        title,
      });
      setOriginalTitle(title);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Box as='main' minH='100vh' pt='70px' backgroundColor='#f7f7f7'>
        <Flex p={3} justifyContent='center' backgroundColor='white'>
          <Box
            mr={6}
            cursor='pointer'
            fontSize='xs'
            transition='0.5s'
            _hover={{ color: 'gray.500' }}
            onClick={() => router.push('/dashboard')}
          >
            ダッシュボード
          </Box>
          <a href={`/app/${id}`} target='_blank' rel='noopener noreferrer'>
            <Box
              mr={6}
              cursor='pointer'
              fontSize='xs'
              transition='0.5s'
              _hover={{ color: 'gray.500' }}
            >
              アプリを確認
            </Box>
          </a>
          <Link href={`/dashboard/title/${id}`}>
            <a>
              <Box
                mr={6}
                cursor='pointer'
                fontSize='xs'
                transition='0.5s'
                _hover={{ color: 'gray.500' }}
              >
                タイトル設定
              </Box>
            </a>
          </Link>
          <Link href={`/dashboard/media/${id}`}>
            <a>
              <Box
                cursor='pointer'
                fontSize='xs'
                transition='0.5s'
                _hover={{ color: 'gray.500' }}
              >
                メディア設定
              </Box>
            </a>
          </Link>
        </Flex>

        <Container maxW='800px' mt={12} pb={6}>
          <Box as='h1' fontSize='2xl' fontWeight='bold'>
            タイトル設定
          </Box>
          <Box mt={6} p={6} borderRadius={6} backgroundColor='white'>
            <Box>Title</Box>
            <Input
              type='text'
              mt={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
          <Button
            w='200px'
            mt={6}
            mx='auto'
            colorScheme='orange'
            cursor='pointer'
            disabled={title === originalTitle ? true : false}
            onClick={updatePost}
          >
            更新する
          </Button>
        </Container>
      </Box>
    </Layout>
  );
};

export default TitleId;
