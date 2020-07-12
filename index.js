var robot = require("robotjs");

function main() {
  console.log("Starting the bot..\n");

  // Allowing 5 seconds to move over to game screen
  sleep(5000);

  while (true) {
    var tree = findTree();
    if (tree == false) {
      rotateGamecamera();
      continue;
    }

    robot.moveMouseSmooth(tree.x, tree.y);
    robot.mouseClick();
    sleep(3000);

    dropInv();
  }
}

// Function used to drop chopped log from inventory
function dropInv() {
  var invX = 1882;
  var invY = 830;
  var invLogColor = "765b37";

  var pixelColor = robot.getPixelColor(invX, invY);

  var waitTime = 0;
  var maxWaitTime = 9;

  while (pixelColor != invLogColor && waitTime < maxWaitTime) {
    sleep(1000);
    pixelColor = robot.getPixelColor(invX, invY);
    waitTime++;
  }

  if (pixelColor == invLogColor) {
    robot.moveMouse(invX, invY);
    robot.mouseClick("right");
    sleep(300);
    robot.moveMouse(invX, invY + 70);
    robot.mouseClick();
    sleep(1000);
  }
}

// Screen Capture
function screenCap() {
  var img = robot.screen.capture(0, 0, size, size);
}

// Function created to find tree
function findTree() {
  var x = 300,
    y = 300,
    width = 1300,
    height = 400;
  var img = robot.screen.capture(x, y, width, height);

  var treeColor = ["5b462a", "60492c", "6a5138", "705634", "6d5432", "574328"];

  for (var i = 0; i < 100; i++) {
    random_x = randomInt(0, width - 1);
    random_y = randomInt(0, height - 1);
    var sampleColor = img.colorAt(random_x, random_y);

    if (treeColor.includes(sampleColor)) {
      var screen_x = random_x + x;
      var screen_y = random_y + y;

      if (confirmedTree(screen_x, screen_y)) {
        console.log(
          "Found a tree at: " +
            screen_x +
            ", " +
            screen_y +
            " color " +
            sampleColor
        );
        return {
          x: screen_x,
          y: screen_y,
        };
      } else {
        console.log(
          "Did not find a tree at: " +
            screen_x +
            ", " +
            screen_y +
            " color " +
            sampleColor
        );
      }
    }
  }
  // Tree not found
  return false;
}

// Function created to rotate camera in order to find tree
function rotateGamecamera() {
  console.log("Rotating camera..");
  robot.keyToggle("right", "down");
  sleep(1000);
  robot.keyToggle("right", "up");
}

// Function created to chop down a confirmed tree, and not click on a stump or another log 
function confirmedTree(screen_x, screen_y) {
  robot.moveMouse(screen_x, screen_y);
  sleep(300);
  var checkX = 103;
  var checkY = 63;
  var pixelColor = robot.getPixelColor(checkX, checkY);

  return pixelColor == "00ffff";
}

// Sleep function
function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// Random number function used to find random pixels within Screen Capture
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();
