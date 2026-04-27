function fb(n: number) {
  if (n < 2) {
    return n;
  }
  return fb(n - 1) + fb(n - 2);
}

// parentPort?.on('message', ({ n, id }) => {
//   const result = fb(n);
//   parentPort?.postMessage({ result, id });
// });

module.exports = (n: number) => {
  return fb(n);
};
