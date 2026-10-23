import { describe, expect, it } from "vitest";
import { isBot, isRateLimited, submissionSchema } from "@/lib/submission-schema";

const base = { purpose: "business", name: "Ali", email: "ali@example.com", emailRequired: true };

describe("submission rules", () => {
  it("requires email when the purpose needs it", () => {
    expect(submissionSchema.safeParse({ ...base, email: "" }).success).toBe(false);
  });
  it("allows no email for 'just exploring'", () => {
    expect(submissionSchema.safeParse({ ...base, purpose: "exploring", email: "", emailRequired: false }).success).toBe(true);
  });
  it("treats a filled honeypot as a bot", () => {
    expect(isBot(submissionSchema.parse({ ...base, website: "spam.com" }))).toBe(true);
  });
  it("blocks the 4th request in the window, allows the 3rd", () => {
    expect(isRateLimited(2)).toBe(false);
    expect(isRateLimited(3)).toBe(true);
  });
});
