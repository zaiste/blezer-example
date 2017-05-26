const { Task } = require('blezer');

class LoopTask extends Task {
  async perform(args) {
    this.log('-- LoopTask');
    this.log(`Running inside: ${process.pid}`);
    this.log(`Args: ${args}`);

    let progress = 0;
    for (var i = 0; i < 1e9; i++) {
      if (i % 1e7 == 0) {
        this.log(i)
        this.progress(progress, 100);
        progress++;
      }
    }

    this.log('-- end');
  }
}

module.exports = LoopTask
