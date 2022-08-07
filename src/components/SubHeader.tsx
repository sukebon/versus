import { Box, Flex } from '@chakra-ui/react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  id: string | string[] | undefined;
};

const SubHeader: NextPage<Props> = ({ id }) => {
  const router = useRouter();
  return (
    <Box as='section'>
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
              mr={6}
              cursor='pointer'
              fontSize='xs'
              transition='0.5s'
              _hover={{ color: 'gray.500' }}
            >
              メディア設定
            </Box>
          </a>
        </Link>

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
      </Flex>
    </Box>
  );
};

export default SubHeader;
