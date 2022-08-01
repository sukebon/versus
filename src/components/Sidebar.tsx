import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { DragHandleIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';

const Sidebar = () => {
  return (
    <Flex
      justifyContent='center'
      alignItems={{ base: 'center', lg: 'flex-start' }}
      w={{ base: '100%', lg: '50px' }}
      h={{ base: '50px', lg: '100vh' }}
      position={{ base: 'static', lg: 'fixed' }}
      top={0}
      left={0}
      backgroundColor='facebook.400'
      zIndex={10}
    >
      <DragHandleIcon
        w={9}
        h={9}
        mt={{ base: '0', lg: '60px' }}
        p={2}
        border='1px'
        borderColor='facebook.500'
        borderRadius={3}
        backgroundColor='blue.500'
      />
    </Flex>
  );
};

export default Sidebar;
