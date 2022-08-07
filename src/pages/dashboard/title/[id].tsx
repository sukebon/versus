import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import Layout from '../../../components/Layout';
import SpinnerArea from '../../../components/SpinnerArea';
import SubHeader from '../../../components/SubHeader';

const TitleId = () => {
  const router = useRouter();
  const { id } = router.query;
  const [spinner, setSpinner] = useState(false);
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [originalDesc, setOriginalDesc] = useState('');

  //postsからタイトルを取得
  useEffect(() => {
    const getPost = async () => {
      try {
        const docRef = doc(db, 'posts', `${id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title);
          setOriginalTitle(docSnap.data().title);
          setDesc(docSnap.data().desc);
          setOriginalDesc(docSnap.data().desc);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [id]);

  //postsからタイトルを取得
  const updatePost = async () => {
    setSpinner(true);
    try {
      const docRef = doc(db, 'posts', `${id}`);
      await updateDoc(docRef, {
        title,
        desc,
      });
      setOriginalTitle(title);
      setOriginalDesc(desc);
      window.alert('更新しました。');
    } catch (error) {
      console.log(error);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <Layout>
      <SpinnerArea spinner={spinner} />
      <Box as='main' minH='100vh' pt='70px' backgroundColor='#f7f7f7'>
        <SubHeader id={id} />
        <Container maxW='800px' mt={12} pb={6}>
          <Box as='h1' fontSize='2xl' fontWeight='bold'>
            タイトル設定
          </Box>
          <Box mt={6} p={6} borderRadius={6} backgroundColor='white'>
            <Box>タイトル</Box>
            <Input
              type='text'
              mt={1}
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
          </Box>
          <Box textAlign='center'>
            <Button
              w='200px'
              mt={6}
              mx='auto'
              colorScheme='orange'
              cursor='pointer'
              disabled={
                title === originalTitle && desc === originalDesc ? true : false
              }
              onClick={updatePost}
            >
              更新する
            </Button>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default TitleId;
