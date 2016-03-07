'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiStats = require('chai-stats');

var _chaiStats2 = _interopRequireDefault(_chaiStats);

var _libPerfTimer = require('../lib/PerfTimer');

var _libPerfTimer2 = _interopRequireDefault(_libPerfTimer);

_chai2['default'].use(_chaiStats2['default']);

var expect = _chai2['default'].expect;

describe('PerfTimer', function () {

  it('should support basic start/stop of timer.', function (done) {
    _libPerfTimer2['default'].debugMode(true);
    _libPerfTimer2['default'].start('My random task');
    var resultSession = null;
    setTimeout(function () {
      resultSession = _libPerfTimer2['default'].stop('My random task');
      expect(resultSession.getDurationSeconds()).to.almost.equal(0.3, 2);
      done();
    }, 300);
  });

  describe('.printReport', function () {
    it('should run without error.', function () {
      _libPerfTimer2['default'].debugMode(true);
      _libPerfTimer2['default'].start('My random task');
      _libPerfTimer2['default'].stop('My random task');
      var result;
      expect(function () {
        result = _libPerfTimer2['default'].printReport('/tmp/blah.log');
      }).to.not['throw']();
      expect(typeof result === 'string').to.be['true'];
    });
  });
});
//# sourceMappingURL=PerfTimer.test.js.map