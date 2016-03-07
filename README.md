PerfTimer
=========

[![Build Status](https://travis-ci.org/benedictchen/perf-timer.svg?branch=master)](https://travis-ci.org/benedictchen/perf-timer)

A simple performance recorder.  Please note that debugMode must be on
or else nothing will happen.

Usage:
------

 ```javascript
  
 PerfTimer.debugMode(true);  // <-- Important!
 PerfTimer.start(`My random task`);
 doStuff();
 PerfTimer.stop(`My random task`);

 // Write the results to file (/tmp/performance.log) and console.
 PerfTimer.printReport('/my/path/performance.log');

 ```
 
PerfTimer
---------
- static start(name: String)
    - Starts timing a session of a specific name.
- static stop(name: String)
    - Stops timing a session with a specific name.
- static reset()
    - Clears all previous sessions.
- static printReport(filePath: String) 
    - Prints the reports to a file at the path defined.

 Development
 -----------
 - Dev-mode - `gulp devwatch` - this mode will watch your files, run tests, lint your code, and compile them as you code.
 - Tests - `gulp test` or `npm test`
 
 
Created by Benedict Chen. If you like it, you can buy me a beer with PayPal.

*Donate via Paypal*
-------------------
If you enjoy this repo, please support me. [Donate](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WXQKYYKPHWXHS)
 
Please support us! 
