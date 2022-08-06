import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Fade,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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
  const { id } = router.query;
  const user = auth.currentUser;
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<any>([]);
  const [fileUpload, setFileUpload] = useState<File | any>(null);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  //postを取得
  useEffect(() => {
    const getPost = async () => {
      const docRef = doc(db, 'posts', `${id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTitle(docSnap.data().title);
        console.log('Document data:', docSnap.data());
      } else {
        console.log('postデータはありません。');
      }
    };
    getPost();
  }, [id]);

  //ファイルをアップロード
  const onfileUpload = async () => {
    if (!fileUpload) return;
    const file = fileUpload[0];
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join('');
    const fileName = randomChar + '_' + file.name; //保存するファイルの名前
    const imagePath = `/images/${id}/${fileName}`; //保存するstorageのpath
    const storageRef = ref(storage, imagePath);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(ref(storage, imagePath));
      const path = storageRef.fullPath;
      await addDoc(collection(db, 'images'), {
        postId: id,
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

  //イメージ画像データ一覧を取得
  useEffect(() => {
    const getImages = async () => {
      try {
        const q = query(
          collection(db, 'images'),
          where('postId', '==', `${id}`)
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
  }, [id]);

  //画像の削除
  const imageDelete = async (imageId: string, path: string) => {
    const result = window.confirm('削除して宜しいでしょうか?');
    if (!result) return;
    const desertRef = ref(storage, path);
    try {
      await deleteDoc(doc(db, 'images', `${imageId}`));
      await deleteObject(desertRef);
      console.log('delete success');
    } catch (error) {
      console.log(error);
    }
  };
  console.log(fileUpload);
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
              cursor='pointer'
              fontSize='xs'
              transition='0.5s'
              _hover={{ color: 'gray.500' }}
            >
              アプリを確認
            </Box>
          </a>
        </Flex>
        <Container maxW='800px' mt={12}>
          <Box as='h1' fontSize='2xl' fontWeight='bold'>
            設定画面
          </Box>

          <Box mt={6}>
            <FormControl w='200px'>
              <FormLabel
                m={0}
                py={2}
                px={3}
                color='white'
                backgroundColor='facebook.700'
                borderRadius={6}
                _hover={{ opacity: '0.9' }}
                cursor='pointer'
              >
                <Flex alignItems='center' justifyContent='center'>
                  <AddIcon mr={2} fontSize='sm' />
                  アップロード
                </Flex>
              </FormLabel>
              <Input
                type='file'
                placeholder='First name'
                accept='image/*'
                value={fileUpload ? fileUpload.name : ''}
                onChange={(e) => setFileUpload(e.target.files)}
              />
            </FormControl>
          </Box>
          {images.length === 0 ? (
            <Flex mt={12} w='100%' justifyContent='center'>
              <Box>画像が登録されていません。</Box>
            </Flex>
          ) : (
            <TableContainer
              mt={6}
              p={6}
              backgroundColor='white'
              borderRadius={6}
              display={images.length === 0 ? 'none' : 'block'}
            >
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>画像</Th>
                    <Th>ファイル名</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {images.map(
                    (image: {
                      id: string;
                      postId: string;
                      url: string;
                      path: string;
                      name: string;
                    }) => (
                      <Tr key={image.id}>
                        <Td>
                          <Box w='150px'>
                            <img src={image.url} />
                          </Box>
                        </Td>
                        <Td>{image.name}</Td>
                        <Td isNumeric>
                          <Button
                            colorScheme='red'
                            onClick={() => imageDelete(image.id, image.path)}
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Container>

        {fileUpload && fileUpload.length >= 1 && (
          <Flex
            w='100%'
            h='100%'
            backgroundColor='rgba(0,0,0,0.5)'
            position='fixed'
            top='0'
            left='0'
            zIndex={1000}
          >
            <Flex
              p={3}
              width={{ base: '95%', lg: 'auto' }}
              // maxW='500px'
              flexDirection='column'
              alignItems='center'
              position='absolute'
              top='50%'
              left='50%'
              transform='translate(-50%,-50%)'
            >
              <Box maxH='500px'>
                <img
                  className='mediaImg'
                  src={window.URL.createObjectURL(fileUpload[0])}
                  style={{
                    objectFit: 'cover',
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                  }}
                />
              </Box>
              <Flex mt={6}>
                <Button onClick={onfileUpload} mr={3}>
                  OK
                </Button>
                <Button onClick={() => setFileUpload('')}>キャンセル</Button>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Box>
    </Layout>
  );
};

export default DashboardId;
