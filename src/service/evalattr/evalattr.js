export default ['$rootScope', function(root) {
  return (value) => {
    if( !value || value[0] !== '$' ) return value;

    const arr = value.split('|');
    let defvalue = arr[1];
    const body = (arr[0] || '').split(':');
    let fnname = body[0];
    let varname = body[1];

    fnname = fnname && fnname.trim();
    varname = varname && varname.trim();
    defvalue = defvalue && defvalue.trim();

    //console.log(fnname, varname, defvalue);

    if( fnname === '$var' ) return window[varname] || defvalue;
    if( fnname === '$hash' ) return root.$hash(varname) || defvalue;
    if( ~['$param' , '$query'].indexOf(fnname) ) return root.$query(varname) || defvalue;
    if( fnname === '$basename' ) return root.$basename(+varname) || defvalue;
    return value;
  };
}];
