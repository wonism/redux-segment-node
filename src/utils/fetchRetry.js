export default function fetchRetry(url, options = {}) {
  return new Promise((resolve, reject) => {
    let { retries = 3 } = options;

    const wrappedFetch = () => {
      global
        .fetch(url, options)
        .then(resolve)
        .catch((error) => {
          if (!retries) {
            reject(error);
          } else {
            setTimeout(() => {
              retries -= 1;
              wrappedFetch();
            }, 1000);
          }
        });
    };

    wrappedFetch(retries);
  });
}
