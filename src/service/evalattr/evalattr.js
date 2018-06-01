export default ['$rootScope', function(root) {
  return (value) => {
    if( !value ) return value;
    if( value[0] !== '$' ) return value;

    const arr = value.split(':');
    const fnname = arr[0];
    const varname = arr[1];
    const defvalue = arr[2];
    if( fnname === '$var' ) return window[varname] || defvalue;
    if( fnname === '$hash' ) return root.$hash(varname) || defvalue;
    if( ~['$param' , '$query'].indexOf(fnname) ) return root.$query(varname) || defvalue;
    if( fnname === '$basename' ) return root.$basename() || defvalue;
    return value;
  };
}];
