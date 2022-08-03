import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Image,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Box,
  Flex,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { auth } from '../../firebase';

const MenuButtonList = ({ user }: any) => {
  const router = useRouter();
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        console.log('ログアウトしました。');
        router.push('login');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant='link'
        color='white'
        _hover={{ textDecoration: 'none' }}
        _active={{ color: 'white' }}
      >
        <Flex
          flexDirection='column'
          justifyContent='center'
          alignItems='flex-start'
          fontSize='xs'
        >
          <Box>マイアカウント</Box>
          <Box>{user.email}</Box>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem minH='40px'>
          <Link href='/dashboard'>
            <a>
              <Box as='span' mr={3} fontSize='xs'>
                ダッシュボード
              </Box>
            </a>
          </Link>
        </MenuItem>
        <MenuItem minH='40px'>
          <Box as='span' mr={3} fontSize='xs' onClick={logout}>
            ログアウト
          </Box>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MenuButtonList;
