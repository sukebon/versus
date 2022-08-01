import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const Header = () => {
  return (
    <Flex
      alignItems='center'
      p={3}
      w='100%'
      h='50px'
      position='sticky'
      top={0}
      backgroundColor='facebook.500'
      zIndex={100}
    >
      <Text color='white' fontWeight='bold'>
        DAIMARU HAKUI
      </Text>
    </Flex>
  );
};

export default Header;
