export default (value) => typeof value === 'string' ? value.split('\n').join('<br>') : value;
