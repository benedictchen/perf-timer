PerfTimer
=========
 
A simple performance recorder.  Please note that debugMode must be on
or else nothing will happen.

Usage:

 ```javascript
 PerfTimer.debugMode(true);  // <-- Important!
 PerfTimer.start(`My random task`);
 doStuff();
 PerfTimer.stop(`My random task`);

 // Write the results to file (/tmp/performance.log) and console.
 PerfTimer.printReport();

 ```
 
 
Created by Benedict Chen. If you like it, you can buy me a beer with PayPal.

*Donate via Paypal*
[Donate](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WXQKYYKPHWXHS)
 
 
