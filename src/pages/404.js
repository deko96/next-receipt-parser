import ArrowLeftIcon from "@mui/icons-material/ArrowLeftOutlined";
import { Button, Container, Typography } from "@mui/material";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <Container
      maxWidth="md"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Oops! Resource Not Found
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        The resource you are looking for does not exist.
      </Typography>
      <div style={{ textAlign: "center" }}>
        <Link href="/">
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowLeftIcon />}
          >
            Go Back
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;
