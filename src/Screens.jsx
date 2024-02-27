import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Button, Grid, Container, Heading, Text, Box } from "@chakra-ui/react";

import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <>
      <Grid h="100vh" placeItems="center" minH="100vh">
        <Container
          maxW="400px"
          minH="400px"
          bg="teal.50"
          p="76px 2.5rem"
          rounded="16px"
          display="flex"
          alignItems="center"
          flexDirection="column"
          gap="2.5rem"
        >
          <Heading color="teal.500" fontSize="42px">
            Memory
          </Heading>
          <Text color="teal.500" fontSize="18px">
            Flip over tiles looking for pairs
          </Text>
          <Button
            variant="none"
            rounded="full"
            fontSize="23px"
            px="32px"
            py="25px"
            color="white"
            bgGradient="linear(to-b, teal.400, teal.600)"
            minW="150px"
            onClick={start}
          >
            Play
          </Button>
        </Container>
      </Grid>
    </>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti();
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <Grid alignItems="center" justifyItems="center" minH="100vh">
        <Container
          display="flex"
          flexDirection="column"
          gap="10px"
          padding="0"
          maxW="400px"
          height="fit-content"
        >
          <Box
            w="100%"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="2"
          >
            <Text color="green.600" fontSize="14px">
              Tries:
            </Text>
            <Text
              bg="green.100"
              py="2px"
              color="green.600"
              rounded="4px"
              lineHeight="16px"
              pb="0"
              px="8px"
              fontSize="12px"
              fontWeight="600"
            >
              {tryCount}
            </Text>
          </Box>
          <Grid
            templateRows="repeat(4, 1fr)"
            templateColumns="repeat(4, 1fr)"
            gap={'1rem'}
            justifyContent="center"
            justifyItems="center"
            p="2.5"
            bg="green.50"
            rounded="16px"
            h={'100%'}
            minH={'400px'}
            w={'400px'}   
          >
            {getTiles(16).map((tile, i) => (
              <Tile key={i} flip={() => flip(i)} {...tile} />
            ))}
          </Grid>
        </Container>
      </Grid>
    </>
  );
}
