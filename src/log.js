
global.TNT = process.env.NODE_ENV === 'development' ? console.log : () => {};
global.C4 = process.env.NODE_ENV === 'development' ? (val) => val : (val) => '';