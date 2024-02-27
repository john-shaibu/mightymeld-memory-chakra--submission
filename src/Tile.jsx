import { Box } from "@chakra-ui/react";

export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Box
          onClick={flip}
          display="inline-grid"
          width={'100%'}
          height={'100%'}
          textAlign="center"
          alignSelf={"stretch"}
          bg="green.300"
          rounded="8px"
          justifyContent="center"
          justifyItems="center"
        ></Box>
      );
    case "flipped":
      return (
        <Box
           width={'100%'}
          height={'100%'}
          textAlign="center"
          color="white"
          bg="green.600"
          rounded="8px"
          padding="8px"
          h={"100%"}
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Box>
      );
    case "matched":
      return (
        <Box
          display="inline-block"
          width={'100%'}
          height={'100%'}
          textAlign="center"
          color={"green.100"}
          p={"4px"}
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Box>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}
