import { Box, Container } from "@mui/material";
import { TrackingMapDOM } from "../components/TrackingMapDOM";

function WithDOM() {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: "100%",
        display: "flex",
      }}
    >
      <Box sx={{ minWidth: 200 }}>DOM</Box>

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <TrackingMapDOM />
      </Box>
    </Container>
  );
}

export default WithDOM;
