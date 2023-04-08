const { Transform } = require('stream');

const SPLIT_SEQUENCE = '}{';

module.exports = () =>
  new Transform({
    objectMode: true,
    // eslint-disable-next-line consistent-return
    write(chunk: any, enc: any, cb: any) {
      const possibleMessages = chunk.toString().split(SPLIT_SEQUENCE);

      for (let i = 0; i < possibleMessages.length - 1; i += 1) {
        possibleMessages[i] = `${possibleMessages[i]}}`;
      }

      for (let i = 1; i < possibleMessages.length; i += 1) {
        possibleMessages[i] = `{${possibleMessages[i]}`;
      }

      while (possibleMessages.length > 0) {
        try {
          const m = JSON.parse(possibleMessages[0]);
          this.push(m);
        } catch (e) {
          if (possibleMessages.length > 1) {
            possibleMessages[0] = possibleMessages[0]
              .concat(possibleMessages.splice(1, 1))
              .join(SPLIT_SEQUENCE);
          } else {
            return cb(e);
          }
        }

        possibleMessages.splice(0, 1);
      }

      cb();
    },
  });
