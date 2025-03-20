import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import { SignUp } from "@clerk/nextjs";

export default async function SignUpPage() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            mb: 4,
            fontWeight: 500,
            fontSize: { xs: "2rem", sm: "2.5rem" },
          }}
        >
          Sign Up
        </Typography>

        <Card
          sx={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "background.paper",
            boxShadow: 3,
            mx: 2,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              p: { xs: 2, sm: 4 },
            }}
          >
            <SignUp
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "shadow-none",
                  formButtonPrimary:
                    "bg-primary hover:bg-primary-dark focus:shadow-primary-focus",
                  formFieldInput: "w-full",
                },
              }}
              afterSignUpUrl="/dashboard"
              afterSignInUrl="/dashboard"
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
