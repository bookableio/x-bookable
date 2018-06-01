export default () => location.pathname.replace(/\\/g,'/').replace( /.*\//, '' );
