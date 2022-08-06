import { AddIcon, DeleteIcon, SettingsIcon, ViewIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase/index';
import Layout from '../components/Layout';

const Dashboard = () => {
  const user = auth.currentUser;
  const router = useRouter();
  const [posts, setPosts] = useState<any>([]);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('user', '==', `${user?.uid}`)
        );
        const unsub = onSnapshot(q, (querySnapshot) => {
          setPosts(
            querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
          );
        });
      } catch {
        console.log('取得できませんでした。');
      }
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postDelete = async (postId: string) => {
    const result = window.confirm('削除して宜しいでしょうか？');
    if (!result) return;
    await deleteDoc(doc(db, 'posts', postId));
    await imagesStorageDelete(postId);
  };

  //POSTIDのイメージを全て取得して削除する関数（imagesコレクション・storage）
  const imagesStorageDelete = async (postId: string) => {
    const q = query(collection(db, 'images'), where('postId', '==', postId));
    const querySnapshot = await getDocs(q);

    const images = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    images.forEach(async (image: any) => {
      await deleteDoc(doc(db, 'images', image.id));
      const desertRef = ref(storage, image.path);
      await deleteObject(desertRef);
    });
  };

  return (
    <>
      {user && (
        <Layout>
          <Flex as='main' h='100vh' pt='70px' backgroundColor='#f7f7f7'>
            <Container maxW='800px' mt={12}>
              <Box as='h1' fontSize='2xl' fontWeight='bold'>
                ダッシュボード
              </Box>
              <Box mt={6}>
                <Button
                  width='200px'
                  colorScheme='facebook'
                  disabled={posts.length >= 3 ? true : false}
                  onClick={() => router.push('/new')}
                >
                  <AddIcon mr={2} fontSize='sm' />
                  <Box as='span'>Add New App</Box>
                </Button>
              </Box>
              {posts.length >= 1 && (
                <Box p={6} mt={6} borderRadius={6} backgroundColor='white'>
                  {posts.map((post: { id: string; title: string }) => (
                    <Box
                      key={post.id}
                      w='100%'
                      borderBottom='1px'
                      borderColor='gray.100'
                    >
                      <Flex
                        w='100%'
                        flexDirection={{ base: 'column', md: 'row' }}
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <Flex flex={4}>
                          <Link href={`/app/${post.id}`}>
                            <a>
                              <Box>{post.title}</Box>
                            </a>
                          </Link>
                        </Flex>
                        <Flex flex={1} justifyContent='space-between'>
                          <a
                            href={`/app/${post.id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <Flex
                              flexDirection='column'
                              alignItems='center'
                              p={2}
                              _hover={{ opacity: 0.8 }}
                            >
                              <ViewIcon />
                              <Text fontSize='xs'>確認</Text>
                            </Flex>
                          </a>

                          <Link href={`/dashboard/${post.id}`}>
                            <a>
                              <Flex
                                flexDirection='column'
                                alignItems='center'
                                p={2}
                                _hover={{ opacity: 0.8 }}
                              >
                                <SettingsIcon />
                                <Text fontSize='xs'>設定</Text>
                              </Flex>
                            </a>
                          </Link>

                          <Flex
                            flexDirection='column'
                            alignItems='center'
                            p={2}
                            onClick={() => postDelete(post.id)}
                            cursor='pointer'
                            _hover={{ opacity: 0.8 }}
                          >
                            <DeleteIcon />
                            <Text fontSize='xs'>削除</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              )}
            </Container>
          </Flex>
        </Layout>
      )}
    </>
  );
};

export default Dashboard;
