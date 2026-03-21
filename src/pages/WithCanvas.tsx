import { Box, Container, Typography } from "@mui/material";
import { TrackingMapCanvas } from "../components/TrackingMapCanvas";

function WithCanvas() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">With Canvas</Typography>
      </Box>

      <Box
        sx={{
          height: "700px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <TrackingMapCanvas />
      </Box>
    </Container>
  );
}

export default WithCanvas;
