import chai from 'chai';
import chaiStats from 'chai-stats';
chai.use(chaiStats);
import PerfTimer from '../lib/PerfTimer';

var expect = chai.expect;

describe('PerfTimer', () => {
  it('should support basic start/stop of timer.', (done) => {
   PerfTimer.debugMode(true);
   PerfTimer.start(`My random task`);
   var resultSession = null;
   setTimeout(() => {
      var resultSession = PerfTimer.stop(`My random task`);
      expect(resultSession.getDurationSeconds()).to.almost.equal(0.3, 2);
      done();
   }, 300);
  });
});
