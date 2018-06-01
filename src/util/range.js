export default (input, start, end, step) => {
  start = +start || 0;
  end = +end || 0;
  step = +step || 1;

  for(let i=start; i <= end; i += step) {
    input.push(i);
  }

  return input;
};
