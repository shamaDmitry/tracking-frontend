import { Box, Container, Typography } from "@mui/material";
import { TrackingMapCanvas } from "../components/TrackingMapCanvas";

function WithCanvas() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 2 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          With Canvas
        </Typography>

        <Typography component="p" variant="body1" gutterBottom>
          This page demonstrates the tracking map implemented using the HTML5
          Canvas API. The canvas allows for efficient rendering of many objects
          simultaneously, making it ideal for real-time tracking applications.
          One trade-off with Canvas is that the drawings do not have native
          onClick or onHover events like standard DOM markers do.
        </Typography>
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
