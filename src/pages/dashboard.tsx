import { Box, Button, Container, Flex } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/index';
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
        const querySnapshot = await getDocs(q);
        setPosts(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      } catch {
        console.log('取得できませんでした。');
      }
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {user && (
        <Layout>
          <Flex p={6}>
            <Container maxW='800px'>
              <Box as='h1'>ダッシュボード</Box>
              <Link href='/new'>
                <Button>作成する</Button>
              </Link>
              {posts.map((post: { id: string; title: string }) => (
                <Box key={post.id}>
                  <Link href={`/app/${post.id}`}>
                    <a>
                      <Box>{post.title}</Box>
                    </a>
                  </Link>
                </Box>
              ))}
            </Container>
          </Flex>
        </Layout>
      )}
    </>
  );
};

export default Dashboard;
