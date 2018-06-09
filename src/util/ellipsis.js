export default (value, limit = 50) => value && value.length > limit ? (value.slice(0,limit) + '...') : value;
