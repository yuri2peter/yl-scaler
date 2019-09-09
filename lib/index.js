'use strict';

(function () {
  function debounce(idle, action) {
    var last = void 0;
    return function () {
      var ctx = this,
          args = arguments;
      clearTimeout(last);
      last = setTimeout(function () {
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
  var ylScaler = function ylScaler() {
    var parts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [{ stage: 'md', value: 1440, min: 0, max: 99999 }];

    var scaler = function scaler() {
      try {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth;
        var part = parts.find(function (t) {
          return windowWidth >= t.min && windowWidth <= t.max;
        });
        if (part) {
          var target = document.getElementsByTagName('html')[0];
          target.className = target.className.split(' ').filter(function (t) {
            return parts.map(function (part) {
              return part.stage;
            }).indexOf(t) < 0;
          }).concat(part.stage).join(' ');
          target.style.transform = 'scale(' + windowWidth / part.value + ')';
          target.style.transformOrigin = '0 0';
          target.style.width = part.value + 'px';
          target.style.height = part.value / windowWidth * 100 + 'vh';
          target.style.overflowX = 'hidden';
        }
      } catch (e) {
        console.warn(e);
      }
    };
    scaler();
    return debounce(10, scaler);
  };

  ylScaler.quickStart = function () {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1440;

    window.onresize = ylScaler([{ stage: 'default', value: width, min: 0, max: 99999 }]);
  };

  try {
    module.exports = ylScaler;
  } catch (e) {
    if (window.ylScaler === undefined) {
      window.ylResponse = ylScaler;
    }
  }
})();