import { Box, Container, Typography } from "@suid/material";
import { Component } from "solid-js";

const Privacy: Component<{}> = (props) => {
  return (
    <>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Effective Date:</strong> 20-09-2024
        </Typography>
        <Box mt={2}>
          <Typography variant="h6">1. Introduction</Typography>
          <Typography variant="body1">
            This Privacy Policy explains how Auth-learning ("we," "us," or
            "our") collects, uses, discloses, and protects your information when
            you use our web application.
          </Typography>

          <Typography variant="h6">2. Information We Collect</Typography>
          <Typography variant="body1">
            - <strong>Personal Information:</strong> When you sign up or log in
            using OAuth services, we may collect personal information such as
            your name, email address, and profile picture.
          </Typography>
          <Typography variant="body1">
            - <strong>Content:</strong> You may upload images, videos, and
            messages. We store this content on our servers.
          </Typography>
          <Typography variant="body1">
            - <strong>Usage Data:</strong> We may collect information about how
            you access and use the application, including your IP address,
            browser type, and device information.
          </Typography>

          <Typography variant="h6">3. How We Use Your Information</Typography>
          <Typography variant="body1">
            We may use your information for the following purposes:
          </Typography>
          <Typography variant="body1">
            - To provide and maintain our service.
          </Typography>
          <Typography variant="body1">
            - To communicate with you, including sending updates and
            notifications.
          </Typography>
          <Typography variant="body1">
            - To improve our service and develop new features.
          </Typography>

          <Typography variant="h6">4. Sharing Your Information</Typography>
          <Typography variant="body1">
            We do not sell or rent your personal information. We may share your
            information with third-party service providers to assist with our
            operations.
          </Typography>

          <Typography variant="h6">5. Security</Typography>
          <Typography variant="body1">
            We take reasonable measures to protect your information from
            unauthorized access, disclosure, alteration, and destruction.
          </Typography>

          <Typography variant="h6">6. Your Rights</Typography>
          <Typography variant="body1">
            You have the right to access, update, or delete your personal
            information. You can also opt-out of receiving promotional
            communications.
          </Typography>

          <Typography variant="h6">7. Changes to This Policy</Typography>
          <Typography variant="body1">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on our
            application.
          </Typography>

          <Typography variant="h6">8. Contact Us</Typography>
          <Typography variant="body1">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a target="blank" href="mailto:diazlezdo@gmail.com">
              diazlezdo@gmail.com
            </a>
            .
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Privacy;
