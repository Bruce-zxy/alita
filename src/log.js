const __logger = function() {
    this.bold = () => {
        console.log('%c' + 'This is Bold', 'font-size:20px;font-weight: bold')
    }
}

global.TNT = process.env.NODE_ENV === 'development' ? console.log : () => {};
