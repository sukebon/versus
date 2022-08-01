import { Box, Button, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  const [leftImage, setLeftImage] = useState('');
  const [rightImage, setRightImage] = useState('');
  const [toggle, setToggle] = useState(true);

  const images = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
  ];

  const [imagesArray, setImagesArray] = useState(images);

  const onStartClick = () => {
    if (leftImage === '') {
      const firstImage = imagesArray.shift();
      firstImage && setLeftImage(firstImage);
    }
    if (rightImage === '') {
      const secondImage = imagesArray.shift();
      secondImage && setRightImage(secondImage);
    }
    setImagesArray(imagesArray);
    setToggle(false);
  };

  const onResetClick = () => {
    setImagesArray(images);
    setLeftImage('');
    setRightImage('');
    setToggle(true);
  };

  const leftSelectClick = () => {
    const image = imagesArray.shift();
    image ? setRightImage(image) : setRightImage('');
  };

  const rightSelectClick = () => {
    const image = imagesArray.shift();
    image ? setLeftImage(image) : setLeftImage('');
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>
        <Box as='main' w='100%'>
          <Flex
            w='100%'
            maxW='1000px'
            mt={12}
            mx='auto'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
          >
            <Box as='h1' textAlign='center'>
              どちらがいいですか？
              <br />
              好きな方をクリックしてください
            </Box>
            <Box>
              {toggle && (
                <Button mt={6} onClick={onStartClick}>
                  スタート
                </Button>
              )}
              {imagesArray.length === 0 && (!leftImage || !rightImage) && (
                <Button mt={6} onClick={onResetClick}>
                  リセット
                </Button>
              )}
            </Box>
            <Flex mt={6} w='100%' justifyContent='center'>
              {leftImage && (
                <Flex
                  justifyContent='center'
                  cursor='pointer'
                  onClick={leftSelectClick}
                  width='100%'
                >
                  <Image src={leftImage} alt={''} width={500} height={500} />
                </Flex>
              )}
              {rightImage && (
                <Flex
                  justifyContent='center'
                  cursor='pointer'
                  onClick={rightSelectClick}
                  width='100%'
                >
                  <Image src={rightImage} alt={''} width={500} height={500} />
                </Flex>
              )}
            </Flex>
          </Flex>
        </Box>
      </Layout>
    </>
  );
};

export default Home;