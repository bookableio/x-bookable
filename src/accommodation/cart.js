var cart;

var load = function() {
  var o = localStorage['bookable.accommodation.rooms'];
  try {
    cart = (o && JSON.parse(o)) || {};
  } catch(e) {}
  
  return cart;
};

var save = function() {
  localStorage['bookable.accommodation.rooms'] = JSON.stringify(cart);
};


module.exports = {
  get: function() {
    if( !cart ) load();
    return cart;
  },
  get rooms() {
    if( !cart ) load();
    return cart.rooms || [];
  },
  set rooms(rooms) {
    if( !cart ) load();
    cart.rooms = rooms || [];
  },
  clear: function() {
    cart = {};
    save();
  },
  save: function() {
    save();
    return this;
  },
  merge: function(newrooms) {
    if( !newrooms || !Array.isArray(newrooms) ) return console.error('argument must be an array');
    if( !cart ) load();
    
    var map = {};
    cart.rooms = (cart.rooms || []).concat(newrooms).reverse().filter(function(room) {
      if( !room.id || !room.date ) return false;
      var id = room.date + room.id;
      if( map[id] ) return false;
      map[id] = true;
      return true;
    });
    
    save();
    return this;
  }
};