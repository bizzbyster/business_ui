import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 8 
      }}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 4,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontWeight: 500
          }}
        >
          Sign In
        </Typography>
        
        <Card sx={{ 
          maxWidth: 'sm', 
          width: '100%',
          backgroundColor: 'background.paper',
          boxShadow: 3
        }}>
          <CardContent sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            p: 4 
          }}>
            <SignIn 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "shadow-none",
                  formButtonPrimary: 
                    "bg-primary hover:bg-primary-dark focus:shadow-primary-focus",
                }
              }}
              redirectUrl="/onboarding"  // This ensures regular sign-ins go to dashboard
              afterSignInUrl="/onboarding"  // Double ensuring dashboard redirect
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}