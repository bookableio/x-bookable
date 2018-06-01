export default (script) =>
  eval('(function(event) { ' + (script || '') + '\n})');
