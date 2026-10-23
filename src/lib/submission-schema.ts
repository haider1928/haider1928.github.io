import { z } from "zod";

export const PURPOSE_KEY = /^[a-z0-9_-]{1,40}$/;

export const submissionSchema = z
  .object({
    purpose: z.string().regex(PURPOSE_KEY),
    name: z.string().trim().min(1, "Please tell me your name").max(100),
    email: z.union([z.literal(""), z.string().trim().email("That email doesn't look right").max(200)]),
    phone: z.string().trim().max(30).regex(/^[+0-9 ()-]*$/, "Use digits only").optional().default(""),
    services: z.array(z.string().regex(/^[a-z0-9-]{1,60}$/)).max(12).default([]),
    answers: z.record(z.string().max(60), z.union([z.string().max(4000), z.array(z.string().max(200)).max(20)])).default({}),
    emailRequired: z.boolean().default(true),
    website: z.string().max(200).optional().default(""), // honeypot
    sourcePath: z.string().max(200).optional().default(""),
  })
  .refine((d) => !d.emailRequired || d.email.length > 0, { message: "Email is required", path: ["email"] });

export type SubmissionInput = z.input<typeof submissionSchema>;
export type Submission = z.output<typeof submissionSchema>;

/** Honeypot filled = bot. */
export const isBot = (s: Pick<Submission, "website">) => s.website.trim().length > 0;

/** Max submissions allowed per visitor in the rate-limit window. */
export const RATE_LIMIT_MAX = 3;
export const RATE_LIMIT_WINDOW_MINUTES = 10;
export const isRateLimited = (recentCount: number) => recentCount >= RATE_LIMIT_MAX;
