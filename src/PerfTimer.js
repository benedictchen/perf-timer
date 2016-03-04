var _debugMode = false;

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

import fs from 'fs';

/**
 * @type {Object.<String:PerfSession>}
 */
var _sessions = {};



class PerfSession {

  /**
   * @param {String} name Name of the task to record.
   * @param {(Array.<String>)=} [startTime] An optional start time to record.
   */
  constructor(name, startTime) {
    if (!name) {
      throw new Error(`name is missing`);
    }
    this.name = name;

    this.date = new Date();

    this.startTime = startTime || process.hrtime();
    this.duration = null;
  }

  /**
   * Stops the timer for the process.
   */
  stop() {
    if (!this.startTime) {
      throw new Error(`No start time.`);
    }
    this.duration = process.hrtime(this.startTime);
  }

  /**
   * Returns the float representation of the entire duration or null.
   * @return {?Number} The duration in seconds that it took to complete.
   */
  getDurationSeconds() {
    var diff = this.duration;
    if (!diff) {
      return null;
    }
    return diff[0] + (diff[1] / 1e9);
  }

  /** @override */
  toString() {
    var diff = this.duration;
    var timeString = `Started at: ${this.startTime}. Still running...`;
    if (diff) {
      timeString = `${this.getDurationSeconds()} seconds.`;
    }
    return `[${this.date}] - <"${this.name}"> : ${timeString}`;
  }
}



export default class PerfTimer {

  /**
   * When debugMode is off, nothing will happen so that PerfTimer can be put
   * anywhere within your project without slowing it down.
   * @param {Boolean} turnOn Whether to turn on debug mode or not.
   */
  static debugMode(turnOn) {
    if (turnOn === true) {
      _debugMode = true;
    }
    else if (turnOn === false) {
      _debugMode = false;
    }
    else {
      throw new Error('We require a boolean to turn debug on or off.');
    }
  }

  /**
   * Starts recording a task by a given name.
   * @param  {String} name The name of the task to record.
   */
  static start(name) {
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
  static stop(name) {
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
  static printReport(optOutputPath) {
    if (!_debugMode) {
      return;
    }
    var header = `\n`;
    for (var i = 0; i < 80; i++) {
      header += '-';
    }
    header += '\n';
    var text = `\n` + Object.values(_sessions)
                .sort((a, b) => {
                  var tDiff = b.getDurationSeconds() - a.getDurationSeconds();
                  if (isNaN(tDiff)) {
                    return a.date - b.date;
                  }
                  return tDiff;
                }).map((session) => {
                  return session.toString();
                }).join('\n');
    console.error('\n\nPERFORMANCE REPORT FOR EMBODIED DIALOG:\n' + text);
    var outputDir = optOutputPath || __dirname + '/../tmp/performance.log';
    fs.appendFile(outputDir, header + text, function (err) {
      if (err) {
        console.error(`Could not write to performance logs.`);
        console.error(err);
      } else {
        console.warn(`Performance logs written to ${outputDir}`);
      }
    });
  }

}
