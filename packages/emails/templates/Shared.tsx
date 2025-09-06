// =========================================
// File: emails/templates/shared.tsx
// =========================================
import * as React from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Heading,
  Button,
  Link,
} from "@react-email/components";

export type BaseEmailProps = {
  studentName: string;
  teacherName: string;
  meetingTime: string | Date;
  meetingLink: string;
  bookingId: string;
  recipientRole: "STUDENT" | "TEACHER";
};

export const BRAND = {
  name: "Tutorly",
  primary: "#1A73E8",
  text: "#1F2937",
  muted: "#6B7280",
  bg: "#F9FAFB",
  card: "#ffffff",
  border: "#E5E7EB",
};

export const containerStyle: React.CSSProperties = {
  margin: "0 auto",
  padding: "24px",
  backgroundColor: BRAND.bg,
};

export const cardStyle: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "560px",
  borderRadius: 16,
  backgroundColor: BRAND.card,
  border: `1px solid ${BRAND.border}`,
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  overflow: "hidden",
};

export const headerStyle: React.CSSProperties = {
  padding: "24px",
  borderBottom: `1px solid ${BRAND.border}`,
};

export const contentStyle: React.CSSProperties = {
  padding: "24px",
};

export const footerStyle: React.CSSProperties = {
  padding: "16px 24px",
  borderTop: `1px solid ${BRAND.border}`,
  color: BRAND.muted,
  fontSize: 12,
};

export function formatWhen(meetingTime: string | Date, locale = "en-IN") {
  const d = typeof meetingTime === "string" ? new Date(meetingTime) : meetingTime;
  const date = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${date} at ${time}`;
}

export const BrandHeader: React.FC<{ title: string }> = ({ title }) => (
  <Section style={headerStyle}>
    <Heading as="h2" style={{ margin: 0, color: BRAND.text }}>
      {title}
    </Heading>
    <Text style={{ marginTop: 8, color: BRAND.muted }}>
      {BRAND.name} • Booking Platform
    </Text>
  </Section>
);

export const CtaButton: React.FC<{ href: string; label?: string }> = ({
  href,
  label = "Join Meeting",
}) => (
  <Button
    href={href}
    style={{
      display: "inline-block",
      padding: "12px 16px",
      borderRadius: 10,
      backgroundColor: BRAND.primary,
      color: "#ffffff",
      textDecoration: "none",
      fontWeight: 600,
    }}
  >
    {label}
  </Button>
);

export const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <Section style={{ marginTop: 8 }}>
    <Text style={{ margin: 0, color: BRAND.muted, fontSize: 12 }}>{label}</Text>
    <Text style={{ margin: 0, color: BRAND.text, fontWeight: 600 }}>{value}</Text>
  </Section>
);

export const BrandFooter: React.FC = () => (
  <Section style={footerStyle}>
    <Text style={{ margin: 0 }}>
      Need help? Reply to this email or visit{" "}
      <Link href="https://example.com/support">Support</Link>.
    </Text>
    <Text style={{ margin: 0 }}>
      © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
    </Text>
  </Section>
);

export const EmailShell: React.FC<{
  preview: string;
  title: string;
  children: React.ReactNode;
}> = ({ preview, title, children }) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={containerStyle}>
      <Container style={cardStyle}>
        <BrandHeader title={title} />
        <Section style={contentStyle}>{children}</Section>
        <Hr style={{ borderColor: BRAND.border }} />
        <BrandFooter />
      </Container>
    </Body>
  </Html>
);
