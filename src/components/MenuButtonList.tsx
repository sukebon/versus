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
          <Box>{user.displayName}</Box>
        </Flex>
      </MenuButton>
      <MenuList>
        <Link href='/dashboard'>
          <a>
            <MenuItem minH='40px'>
              <Box as='span' mr={3} fontSize='xs'>
                ダッシュボード
              </Box>
            </MenuItem>
          </a>
        </Link>
        <MenuItem
          minH='40px'
          onClick={async () => {
            await auth.signOut();
            router.push('/login');
          }}
        >
          <Box as='span' mr={3} fontSize='xs'>
            ログアウト
          </Box>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MenuButtonList;
