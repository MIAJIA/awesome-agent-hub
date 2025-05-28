const { validateAgentData } = require("../validate");

describe("Agent Data Validation", () => {
  const baseValidData = {
    name: "Test Agent",
    slug: "test-agent",
    description: "A test agent.",
    repository: "https://github.com/user/test-agent",
    stars: 100,
    category: "experimental",
  };

  test("should validate correct data", () => {
    const data = { ...baseValidData };
    expect(validateAgentData(data)).toBeNull();
  });

  test("should invalidate data with missing required fields", () => {
    const data = { ...baseValidData };
    delete data.name;
    const errors = validateAgentData(data);
    expect(errors).not.toBeNull();
    expect(errors[0].message).toBe("must have required property 'name'");
  });

  test("should invalidate data with incorrect slug pattern", () => {
    const data = { ...baseValidData, slug: "Invalid Slug With Spaces" };
    const errors = validateAgentData(data);
    expect(errors).not.toBeNull();
    expect(errors[0].instancePath).toBe("/slug");
    expect(errors[0].message).toBe("must match pattern \"^[a-z0-9-]+$\"");
  });

  test("should invalidate data with incorrect stars type", () => {
    const data = { ...baseValidData, stars: "100" }; // Stars as string
    const errors = validateAgentData(data);
    expect(errors).not.toBeNull();
    expect(errors[0].instancePath).toBe("/stars");
    expect(errors[0].message).toBe("must be integer");
  });

  test("should invalidate data with stars less than minimum", () => {
    const data = { ...baseValidData, stars: 49 };
    const errors = validateAgentData(data);
    expect(errors).not.toBeNull();
    expect(errors[0].instancePath).toBe("/stars");
    expect(errors[0].message).toBe("must be >= 50");
  });

  test("should validate data with stars equal to minimum", () => {
    const data = { ...baseValidData, stars: 50 };
    expect(validateAgentData(data)).toBeNull();
  });

  test("should invalidate data with invalid category enum", () => {
    const data = { ...baseValidData, category: "invalid-category" };
    const errors = validateAgentData(data);
    expect(errors).not.toBeNull();
    expect(errors[0].instancePath).toBe("/category");
    expect(errors[0].message).toBe("must be equal to one of the allowed values");
  });

  test("should validate data with optional fields present", () => {
    const data = {
      ...baseValidData,
      purpose: "To test validation",
      originator: "Test Corp",
      principle: "Test everything",
      stack: ["Jest", "Node.js"],
      tags: ["testing", "validation"],
      reusability: "Highly reusable for testing",
      limitations: "Only for testing purposes",
      status: "alpha",
      open_source: true,
      license: "MIT",
      demo_links: ["https://example.com/demo"],
      badge: "experimental",
      security_grade: "A",
      license_grade: "A",
      quality_grade: "A",
      last_updated: "2023-10-27",
      language: "JavaScript",
      platforms: ["Node.js"],
      maintainer_verified: true,
    };
    expect(validateAgentData(data)).toBeNull();
  });

  test("should invalidate data with incorrect uri format for repository", () => {
    const data = { ...baseValidData, repository: "not-a-uri" };
    const errors = validateAgentData(data);
    expect(errors).not.toBeNull();
    expect(errors[0].instancePath).toBe("/repository");
    expect(errors[0].message).toBe('must match format "uri"');
  });

  test("should invalidate data with incorrect date format for last_updated", () => {
    const data = { ...baseValidData, last_updated: "27-10-2023" }; // DD-MM-YYYY
    const errors = validateAgentData(data);
    expect(errors).not.toBeNull();
    expect(errors[0].instancePath).toBe("/last_updated");
    expect(errors[0].message).toBe('must match format "date"');
  });

 test("should validate data with an empty array for optional array types (e.g. stack)", () => {
    const data = { ...baseValidData, stack: [] };
    expect(validateAgentData(data)).toBeNull();
  });

  test("should invalidate data with non-string items in stack array", () => {
    const data = { ...baseValidData, stack: ["Node.js", 123] };
    const errors = validateAgentData(data);
    expect(errors).not.toBeNull();
    expect(errors[0].instancePath).toBe("/stack/1");
    expect(errors[0].message).toBe("must be string");
  });
});