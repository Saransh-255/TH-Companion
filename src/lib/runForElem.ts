export default function runForElem(
  selector: string,
  fn: (elem) => void
) {
  const wait = () => {
    let elem = document.querySelector(selector);
    if (!elem) return setTimeout(wait, 1);
    fn(elem);
  };
  wait();
}