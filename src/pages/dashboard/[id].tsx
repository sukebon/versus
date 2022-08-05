import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../../../firebase';
import Layout from '../../components/Layout';

const DashboardId = () => {
  const router = useRouter();
  const queryId = router.query.id;
  const user = auth.currentUser;
  const [images, setImages] = useState<any>([]);
  const [fileUpload, setFileUpload] = useState<File | any>(null);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  //ファイルをアップロード
  const onfileUpload = async () => {
    const file = fileUpload[0];
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join('');
    const fileName = randomChar + '_' + file.name;
    const storageRef = ref(storage, `/images/${fileName}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(ref(storage, `/images/${fileName}`));
      const path = storageRef.fullPath;
      const docRef = await addDoc(collection(db, 'images'), {
        queryId,
        url,
        path,
        name: file.name,
      });
      setFileUpload('');
      console.log('upload success');
    } catch (error) {
      console.log(error);
    }
  };

  //ファイルデータ一覧を取得
  useEffect(() => {
    const getImages = async () => {
      try {
        const q = query(
          collection(db, 'images'),
          where('queryId', '==', `${queryId}`)
        );
        const unsub = onSnapshot(q, (querySnapshot) => {
          setImages(
            querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
          );
        });
      } catch (error) {
        console.log(error);
      }
    };
    getImages();
  }, [queryId]);

  //画像の削除
  const imageDelete = async (id: string, path: string) => {
    const desertRef = ref(storage, path);
    try {
      await deleteDoc(doc(db, 'images', `${id}`));
      await deleteObject(desertRef);
      console.log('delete success');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Box as='main' h='100vh' p={6} pt='70px' backgroundColor='#f7f7f7'>
        <Container maxW='1200px'>
          <Box>
            <FormControl isRequired>
              <FormLabel>First name</FormLabel>
              {fileUpload && fileUpload.length >= 1 && (
                <Box width='200px' height='200px'>
                  <img
                    width='100%'
                    src={window.URL.createObjectURL(fileUpload[0])}
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              )}
              <Input
                type='file'
                placeholder='First name'
                accept='image/*'
                value={fileUpload ? fileUpload.name : ''}
                onChange={(e) => setFileUpload(e.target.files)}
              />
            </FormControl>
            <Box onClick={onfileUpload}>画像をアプロード</Box>
          </Box>
        </Container>
        <Flex>
          {images.map((image: { id: string; url: string; path: string }) => (
            <Box key={image.id}>
              <img src={image.url} />
              <Button onClick={() => imageDelete(image.id, image.path)}>
                削除
              </Button>
            </Box>
          ))}
        </Flex>
      </Box>
    </Layout>
  );
};

export default DashboardId;
