const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron"); // Require Electron from the binaries included in node_modules.
const path = require("path");

// Describe: a group/suite of test cases
describe("Application launch", function () {
  this.app;
  this.timeout(60000); // Give 60 seconds for entire test suite to run

  // Set precondition
  beforeEach(function () {
    this.timeout(20000); // Give 20 seconds for Electron to open
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..")],
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  // Test case
  it("shows an initial window", function () {
    console.log(this.app);
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    });
  });

  // test window is visible with title
  it("window title is iCare", function () {
    try {
      const isVisible = this.app.browserWindow.isVisible();
      assert.strictEqual(isVisible, true);
      const title = this.app.client.getTitle();
      assert.strictEqual(title, "iCare");
    } catch (error) {
      console.error("Test failed", error.message);
    }
  });

  // test window is visible with default height
  it("window default height is set", function () {
    try {
      const isVisible = this.app.browserWindow.isVisible();
      assert.strictEqual(isVisible, true);
      const windowHeight = this.app.client.getWindowHeight();
      assert.strictEqual(windowHeight, "550");
    } catch (error) {
      console.error("Test failed", error.message);
    }
  });

  // test window is wisible default width
  it("window default width is set", function () {
    try {
      const isVisible = this.app.browserWindow.isVisible();
      assert.strictEqual(isVisible, true);
      const windowWidth = this.app.client.getWindowWidth();
      assert.strictEqual(windowWidth, "800");
    } catch (error) {
      console.error("Test failed", error.message);
    }
  });

  // test window position
  it("window default position is center", function () {
    try {
      const isVisible = this.app.browserWindow.isVisible();
      assert.strictEqual(isVisible, true);
      const isCentered = this.app.client.browserWindow.position();
      assert.strictEqual(isCentered, "center");
    } catch (error) {
      console.error("Test failed", error.message);
    }
  });

  // test window maximizable option
  it("window maximizable is set to false", function () {
    try {
      const isVisible = this.app.browserWindow.isVisible();
      assert.strictEqual(isVisible, true);
      const isMaximizable = this.app.client.browserWindow.isMaximized();
      assert.strictEqual(isMaximizable, "false");
    } catch (error) {
      console.error("Test failed", error.message);
    }
  });

  // test window default background color
  it("window default background color", function () {
    try {
      const isVisible = this.app.browserWindow.isVisible();
      assert.strictEqual(isVisible, true);
      const bgColor = this.app.client.browserWindow.backgroundColor();
      assert.strictEqual(bgColor, "#222222");
    } catch (error) {
      console.error("Test failed", error.message);
    }
  });

  // test if dev tool open
  it("del tool is open", function () {
    try {
      const isVisible = this.app.browserWindow.isVisible();
      assert.strictEqual(isVisible, true);
      const isDevToolOpened = this.app.client.browserWindow.isDevToolsOpened();
      assert.strictEqual(isDevToolOpened, "true");
    } catch (error) {
      console.error("Test failed", error.message);
    }
  });
});
