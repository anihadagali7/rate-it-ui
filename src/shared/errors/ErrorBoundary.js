import React from "react";
import { Box, Container, Typography } from "@mui/material";
import PrimaryButton from "../buttons/PrimaryButton";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Something went wrong
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              An unexpected error occurred. You can try reloading the page.
            </Typography>
            <PrimaryButton variant="contained" onClick={this.handleReset}>
              Try again
            </PrimaryButton>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
