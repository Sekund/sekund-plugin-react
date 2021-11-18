function toTest(path) {
  return path.startsWith("__sekund__") ? path.split("/").slice(2).join("/") : path;
}

describe("Test originalPath", () => {
  it("should remove technical path", () => {
    const originalFile = toTest("__sekund__/lksjdflskdj/bonjour/le monde.md");
    console.log("originalFile", originalFile);
    expect(originalFile).toBe("bonjour/le monde.md");
  });
});
