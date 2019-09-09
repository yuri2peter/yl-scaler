(() => {
  function debounce (idle, action){
    let last;
    return function(){
      const ctx = this, args = arguments;
      clearTimeout(last);
      last = setTimeout(function(){
        action.apply(ctx, args);
      }, idle);
    };
  }

  /**
   *
   * @param {array} parts: defines media parts
   * looks like [ { stage: 'md', value: 1680, min: 0, max: 99999 }, {...} ]
   * default set to [] means using 1440px scale
   * @return {Function} scaler(10ms debounced)
   * e.x 'window.onresize = ylScaler()'
   */
  const ylScaler = function (parts = [ { stage: 'md', value: 1440, min: 0, max: 99999 } ]) {
    const scaler = () => {
      try {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        const part = parts.find(t => windowWidth >= t.min && windowWidth <= t.max);
        if (part) {
          const target = document.getElementsByTagName('html')[0];
          target.className = target.className.split(' ')
            .filter((t) => parts.map(part => part.stage).indexOf(t) < 0)
            .concat(part.stage).join(' ');
          target.style.transform = `scale(${windowWidth / part.value})`;
          target.style.transformOrigin = '0 0';
          target.style.width = `${part.value}px`;
          target.style.height = `${part.value / windowWidth * 100}vh`;
          target.style.overflowX = 'hidden';
        }
      } catch (e) {
        console.warn(e);
      }
    };
    scaler();
    return debounce(10, scaler);
  };

  ylScaler.quickStart = (width = 1440) => {
    window.onresize = ylScaler([ { stage: 'default', value: width, min: 0, max: 99999 } ]);
  };

  try {
    module.exports = ylScaler;
  } catch (e) {
    if (window.ylScaler === undefined) {
      window.ylResponse = ylScaler;
    }
  }
})();
