'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * @fileOverview
 *
 *  PerfTimer
 *  =========
 *  A simple performance recorder.  Please note that debugMode must be on
 *  or else nothing will happen.
 *
 *  Usage:
 *
 *      ```
 *      PerfTimer.debugMode(true);  // <-- Important!
 *      PerfTimer.start(`My random task`);
 *      doStuff();
 *      PerfTimer.stop(`My random task`);
 *
 *      // Write the results to file (/tmp/performance.log) and console.
 *      PerfTimer.printReport();
 *
 *      ```
 *
 *
 * Created by Benedict Chen. If you like it, you can buy me a beer with PayPal.
 * [Donate]{@link https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WXQKYYKPHWXHS}
 *
 */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

/**
 * @type {Object.<String:PerfSession>}
 */
var _debugMode = false;var _sessions = {};

var PerfSession = (function () {

  /**
   * @param {String} name Name of the task to record.
   * @param {(Array.<String>)=} [startTime] An optional start time to record.
   */

  function PerfSession(name, startTime) {
    _classCallCheck(this, PerfSession);

    if (!name) {
      throw new Error('name is missing');
    }
    this.name = name;

    this.date = new Date();

    this.startTime = startTime || process.hrtime();
    this.duration = null;
  }

  /**
   * Stops the timer for the process.
   */

  _createClass(PerfSession, [{
    key: 'stop',
    value: function stop() {
      if (!this.startTime) {
        throw new Error('No start time.');
      }
      this.duration = process.hrtime(this.startTime);
    }

    /**
     * Returns the float representation of the entire duration or null.
     * @return {?Number} The duration in seconds that it took to complete.
     */
  }, {
    key: 'getDurationSeconds',
    value: function getDurationSeconds() {
      var diff = this.duration;
      if (!diff) {
        return null;
      }
      return diff[0] + diff[1] / 1e9;
    }

    /** @override */
  }, {
    key: 'toString',
    value: function toString() {
      var diff = this.duration;
      var timeString = 'Started at: ' + this.startTime + '. Still running...';
      if (diff) {
        timeString = this.getDurationSeconds() + ' seconds.';
      }
      return '[' + this.date + '] - <"' + this.name + '"> : ' + timeString;
    }
  }]);

  return PerfSession;
})();

var PerfTimer = (function () {
  function PerfTimer() {
    _classCallCheck(this, PerfTimer);
  }

  _createClass(PerfTimer, null, [{
    key: 'debugMode',

    /**
     * When debugMode is off, nothing will happen so that PerfTimer can be put
     * anywhere within your project without slowing it down.
     * @param {Boolean} turnOn Whether to turn on debug mode or not.
     */
    value: function debugMode(turnOn) {
      if (turnOn === true) {
        _debugMode = true;
      } else if (turnOn === false) {
        _debugMode = false;
      } else {
        throw new Error('We require a boolean to turn debug on or off.');
      }
    }

    /**
     * Starts recording a task by a given name.
     * @param  {String} name The name of the task to record.
     */
  }, {
    key: 'start',
    value: function start(name) {
      if (!_debugMode) {
        return;
      }
      if (!name) {
        throw new Error('Must provide a name for a task to record.');
      }
      _sessions[name] = new PerfSession(name);
    }

    /**
     * Stops a timer by a given name.
     * @param {String} name The name of the timer task to stop.
     * @return {PerfSession} The session that was stopped.
     */
  }, {
    key: 'stop',
    value: function stop(name) {
      if (!_debugMode) {
        return;
      }
      var session = _sessions[name];
      if (!session) {
        throw new Error('Session not found: ' + name);
      }
      session.stop();
      return session;
    }

    /**
     * Generates performance reports and writes to file.
     * @param {String=} [optOutputPath] An optional output path to write the file
     *   to.  Defaults to the current project's `tmp` folder.
     */
  }, {
    key: 'printReport',
    value: function printReport(optOutputPath) {
      if (!_debugMode) {
        return;
      }
      var header = '\n';
      for (var i = 0; i < 80; i++) {
        header += '-';
      }
      header += '\n';
      var text = '\n' + Object.values(_sessions).sort(function (a, b) {
        var tDiff = b.getDurationSeconds() - a.getDurationSeconds();
        if (isNaN(tDiff)) {
          return a.date - b.date;
        }
        return tDiff;
      }).map(function (session) {
        return session.toString();
      }).join('\n');
      console.error('\n\nPERFORMANCE REPORT FOR EMBODIED DIALOG:\n' + text);
      var outputDir = optOutputPath || __dirname + '/../tmp/performance.log';
      _fs2['default'].appendFile(outputDir, header + text, function (err) {
        if (err) {
          console.error('Could not write to performance logs.');
          console.error(err);
        } else {
          console.warn('Performance logs written to ' + outputDir);
        }
      });
    }
  }]);

  return PerfTimer;
})();

exports['default'] = PerfTimer;
module.exports = exports['default'];
//# sourceMappingURL=PerfTimer.js.map