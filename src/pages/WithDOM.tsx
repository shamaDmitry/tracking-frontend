import { Box, Container, Typography } from "@mui/material";
import { TrackingMapDOM } from "../components/TrackingMapDOM";

function WithDOM() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 2 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          With DOM Leaflet Markers
        </Typography>

        <Typography component="p" variant="body1" gutterBottom>
          This page demonstrates the tracking map implemented using DOM Leaflet
          markers. DOM markers provide native onClick and onHover events, making
          them suitable for interactive applications. However, they can be less
          performant when rendering a large number of markers simultaneously,
          compared to Canvas-based rendering.
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
        <TrackingMapDOM />
      </Box>
    </Container>
  );
}

export default WithDOM;
