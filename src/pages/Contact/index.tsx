import SocialLinks from "@/components/SocialLinks";
import { Alert, Box, Button, Container, Group, SimpleGrid, Text, TextInput, Textarea, Title, rem } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ContactIconsList } from "./icons";
import classes from "./index.module.css";

export function Contact() {
  const form = useForm({
    initialValues: {
      email: "",
      fullName: "",
      message: "",
      "g-recaptcha-response": "",
    },
    validate: {
      email: isEmail("Invalid email."),
      fullName: isNotEmpty("Enter your name."),
      message: isNotEmpty("Enter your message."),
    },
  });

  const [messageSending, setMessageSending] = useState(false);
  const [messageSent, setMessageSent] = useState<boolean | null>(null);

  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Container className={classes.wrapper}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={50}>
        <div>
          <Title className={classes.title}>Contact me</Title>
          <Text className={classes.description} mt="sm" mb={30}>
            Leave your email and I will get back to you within 24 hours
          </Text>

          <ContactIconsList />

          <Group mt="xl">
            <SocialLinks color="black" size={30} page="contact" variant="transparent" style={{ width: rem(30), height: rem(30) }} />
          </Group>
        </div>
        <Box
          className={classes.form}
          component="form"
          onSubmit={form.onSubmit(async () => {
            setMessageSending(true);
            try {
              const response = await fetch("https://webemail.bennynguyen.dev/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(form.values),
              });
              setMessageSending(false);
              setMessageSent(response.ok);
            } catch (error) {
              setMessageSending(false);
              setMessageSent(false);
            }
          })}
        >
          <TextInput
            disabled={messageSent != null}
            label="Full name"
            autoComplete="name"
            placeholder="John Doe"
            required
            classNames={{ input: classes.input, label: classes.inputLabel }}
            {...form.getInputProps("fullName")}
          />
          <TextInput
            disabled={messageSent != null}
            mt="md"
            label="Email"
            autoComplete="email"
            placeholder="your@email.com"
            required
            classNames={{ input: classes.input, label: classes.inputLabel }}
            {...form.getInputProps("email")}
          />
          <Textarea
            disabled={messageSent != null}
            required
            label="Your message"
            placeholder="I want to talk with you about..."
            minRows={4}
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
            {...form.getInputProps("message")}
          />
          {messageSent == null && (
            <ReCAPTCHA
              sitekey="6LdnCkIpAAAAAKGhynf4oAl_6wzJapkYWNQYhDbg"
              onChange={(value) => form.setFieldValue("g-recaptcha-response", value as string)}
              style={{
                marginTop: "var(--mantine-spacing-md)",
                transform: isMobile ? "scale(0.8)" : "scale(1)",
                transformOrigin: "0 0",
              }}
            />
          )}
          <Group justify="flex-end" mt="md">
            <Button type="submit" disabled={messageSent != null} loading={messageSending}>
              Send message
            </Button>
          </Group>
          {messageSent != null &&
            (messageSent ? (
              <Alert variant="light" mt="md" color="green" title="Message sent!" icon={<IconInfoCircle />}>
                Your message has been sent successfully!
              </Alert>
            ) : (
              <Alert variant="light" mt="md" color="red" title="Error!" icon={<IconInfoCircle />}>
                Something went wrong, please try again later.
              </Alert>
            ))}
        </Box>
      </SimpleGrid>
    </Container>
  );
}
