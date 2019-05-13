import connect from 'bookable';

let loaded;
const load = (done) => {
  if( loaded ) {
    setTimeout(() => {
      done(loaded);
    }, 0);
    return;
  }

  connect.info().exec((err, business) => {
    if( err ) console.info('[bookable] ' + err.message);
    loaded = business;
    done(business);
  });
};

const opener = {
  open: (width, height) => {
    load(business => {
      console.log(business);
      const url = business.url;
    });
  },
  popup: () => {
    load(business => {
      console.log(business);
      const url = business.url;
    });
  },
  iframe: () => {
    load(business => {
      console.log(business);
      const url = business.url;
    });
  }
};

export default { opener };

