function allocateMemory(size) {
  // Simulate allocation of bytes
  const numbers = size / 8;
  const arr = [];
  arr.length = numbers;
  for (let i = 0; i < numbers; i++) {
    arr[i] = i;
  }
  return arr;
}

const path = require("path");
const fs = require("fs");
const os = require("os");

const memoryLeakAllocations = [];

const field = "heapUsed";
const allocationStep = 10000 * 1024; // 10MB

const TIME_INTERVAL_IN_MSEC = 40;

setInterval(() => {
  const allocation = allocateMemory(allocationStep);

  memoryLeakAllocations.push(allocation);

  const mu = process.memoryUsage();
  // # bytes / KB / MB / GB
  const gbNow = mu[field] / 1024 / 1024 / 1024;
  const gbRounded = Math.round(gbNow * 100) / 100;

  const start = Date.now();
  const LOG_FILE = path.join(__dirname, "memory-usage.csv");

  const elapsedTimeInSecs = (Date.now() - start) / 1000;
  const timeRounded = Math.round(elapsedTimeInSecs * 100) / 100;

  fs.appendFile(LOG_FILE, timeRounded + "," + gbRounded + os.EOL, () => {});
  console.log(`Heap allocated ${gbRounded} GB`);
}, TIME_INTERVAL_IN_MSEC);
