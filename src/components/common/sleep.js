export function sleep(delay) {
  let promise = new Promise((res, rej) => {
    setTimeout(() => { res(true); }, delay);
  })
  return promise;
}
