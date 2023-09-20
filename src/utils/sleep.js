export const sleep = async (delay) => {
  if (!delay) {
    delay = (Math.random() * 2 + 4) * 1000;
  }

  return new Promise((resolve) => setTimeout(resolve, delay));
};
