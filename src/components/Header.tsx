import { Box, Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { auth } from '../../firebase';
import MenuButtonList from './MenuButtonList';

const Header = () => {
  const user = auth.currentUser;
  const router = useRouter();

  return (
    <Flex
      as='header'
      alignItems='center'
      justifyContent='space-between'
      p={3}
      w='100%'
      h='70px'
      position='fixed'
      top={0}
      backgroundColor='facebook.500'
      zIndex={100}
    >
      <Text color='white' fontWeight='bold'>
        DAIMARU HAKUI
      </Text>
      <Box>
        {user ? (
          <MenuButtonList user={user} />
        ) : (
          <>
            <Link href='/login'>
              <a>
                <Button size='sm' colorScheme='facebook' mr={3}>
                  ログイン
                </Button>
              </a>
            </Link>
            <Link href='/signup'>
              <a>
                <Button size='sm' colorScheme='facebook'>
                  新規登録
                </Button>
              </a>
            </Link>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Header;
