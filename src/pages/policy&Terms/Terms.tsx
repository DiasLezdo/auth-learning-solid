import { Box, Container, Typography } from "@suid/material";
import { Component } from "solid-js";

const Terms: Component<{}> = (props) => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Terms and Conditions
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Effective Date:</strong> 20-09-2024
      </Typography>
      <Box mt={2}>
        <Typography variant="h6">1. Acceptance of Terms</Typography>
        <Typography variant="body1">
          By using Auth-learning ("Service"), you agree to be bound by these
          Terms and Conditions.
        </Typography>

        <Typography variant="h6">2. Eligibility</Typography>
        <Typography variant="body1">
          You must be at least 18+ years old to use our Service.
        </Typography>

        <Typography variant="h6">3. User Accounts</Typography>
        <Typography variant="body1">
          To use certain features of our Service, you must create an account.
          You are responsible for maintaining the confidentiality of your
          account information.
        </Typography>

        <Typography variant="h6">4. User Content</Typography>
        <Typography variant="body1">
          You retain ownership of any content you upload. By uploading content,
          you grant us a non-exclusive, worldwide license to use, modify, and
          distribute your content.
        </Typography>

        <Typography variant="h6">5. Prohibited Conduct</Typography>
        <Typography variant="body1">You agree not to:</Typography>
        <Typography variant="body1">
          - Upload content that is unlawful, harmful, or offensive.
        </Typography>
        <Typography variant="body1">
          - Use the Service for any fraudulent or unauthorized purpose.
        </Typography>
        <Typography variant="body1">
          - Attempt to gain unauthorized access to any part of the Service.
        </Typography>

        <Typography variant="h6">6. Termination</Typography>
        <Typography variant="body1">
          We reserve the right to suspend or terminate your access to the
          Service at our discretion, without notice, for conduct that we believe
          violates these Terms.
        </Typography>

        <Typography variant="h6">7. Disclaimers</Typography>
        <Typography variant="body1">
          The Service is provided on an "as is" basis. We do not warrant that
          the Service will be uninterrupted or error-free.
        </Typography>

        <Typography variant="h6">8. Limitation of Liability</Typography>
        <Typography variant="body1">
          In no event shall we be liable for any indirect, incidental, or
          consequential damages arising from your use of the Service.
        </Typography>

        <Typography variant="h6">9. Changes to Terms</Typography>
        <Typography variant="body1">
          We may update these Terms from time to time. Your continued use of the
          Service after any changes constitutes acceptance of the new Terms.
        </Typography>

        <Typography variant="h6">10. Governing Law</Typography>
        <Typography variant="body1">
          These Terms shall be governed by and construed in accordance with the
          laws of India.
        </Typography>

        <Typography variant="h6">11. Contact Us</Typography>
        <Typography variant="body1">
          For any questions regarding these Terms, please contact us at{" "}
          <a target="blank" href="mailto:diazlezdo@gmail.com">
            diazlezdo@gmail.com
          </a>
          .
        </Typography>
      </Box>
    </Container>
  );
};

export default Terms;
