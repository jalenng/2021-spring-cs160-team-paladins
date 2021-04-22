const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron"); // Require Electron from the binaries included in node_modules
const path = require("path");

/* Describe: a group/suite of test cases */
describe("Application launch", function () {
  this.app;
  this.timeout(60000); // Give 60 seconds for entire test suite to run

  /* Set precondition */
  beforeEach(function () {
    this.timeout(20000); // Give 20 seconds for Electron to open
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..")],
      requireName: 'electronRequire'
    });
    return this.app.start();
  });

  /* Test case */
  it("shows an initial window", function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.strictEqual(count, 1);
    });
  });

  /* test window is visible with title */
  it("window title is iCare", async function () {
    const isVisible = await this.app.browserWindow.isVisible();
    assert.strictEqual(isVisible, true);
    const title = await this.app.browserWindow.getTitle();
    assert.strictEqual(title, "iCare");
  });

  /* test window size */
  it("window size is set", async function () {
    const isVisible = await this.app.browserWindow.isVisible();
    assert.strictEqual(isVisible, true);
    const windowBounds = await this.app.browserWindow.getBounds();
    assert.strictEqual(windowBounds.height >= 550, true);
    assert.strictEqual(windowBounds.width >= 860, true);
  });

  /* test window maximizable option */
  it("window maximizable option is false", async function () {
    const isVisible = await this.app.browserWindow.isVisible();
    assert.strictEqual(isVisible, true);
    const isMaximizable = await this.app.browserWindow.isMaximizable();
    assert.strictEqual(isMaximizable, false);
  });

  /* test window minimizable option */
  it("window minimizable option is true", async function () {
    const isVisible = await this.app.browserWindow.isVisible();
    assert.strictEqual(isVisible, true);
    const isMinimizable = await this.app.browserWindow.isMinimizable();
    assert.strictEqual(isMinimizable, true);
  });

  /* test window is closable */
  it("window is closable", async function () {
    const isVisible = await this.app.browserWindow.isVisible();
    assert.strictEqual(isVisible, true);
    const isClosed = await this.app.browserWindow.isClosable();
    assert.strictEqual(isClosed, true);
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });
});
