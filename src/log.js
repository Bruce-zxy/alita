
global.TNT = process.env.NODE_ENV === 'development' ? console.log : () => {};
global.C4 = (val) => '';