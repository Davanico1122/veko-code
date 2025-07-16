function runVeko(code, inputFunc = prompt, outputFunc = console.log) {
  const lines = code.split(/\n/).map(l => l.trim()).filter(Boolean);
  let vars = {}, i = 0;

  const parseBlock = (start) => {
    let block = [];
    let depth = 0;
    for (let j = start; j < lines.length; j++) {
      let line = lines[j];
      if (line.includes('{')) depth++;
      if (line.includes('}')) depth--;
      block.push(line);
      if (depth === 0) return [block, j];
    }
    return [block, lines.length];
  };

  const funcs = {};

  while (i < lines.length) {
    let line = lines[i];

    if (line.startsWith('print ')) {
      let msg = line.slice(6).trim().replace(/["']/g, '');
      outputFunc(msg);
    } else if (line.includes('=') && !line.startsWith('if')) {
      let [key, val] = line.split('=').map(x => x.trim());
      if (val === 'input') {
        vars[key] = inputFunc('Input for ' + key + ':');
      } else {
        vars[key] = isNaN(val) ? val.replace(/["']/g, '') : Number(val);
      }
    } else if (line.startsWith('repeat')) {
      const times = parseInt(line.split(' ')[1]);
      const [block, end] = parseBlock(i + 1);
      for (let r = 0; r < times; r++) {
        runVeko(block.slice(1, -1).join('\n'), inputFunc, outputFunc);
      }
      i = end;
    } else if (line.startsWith('if')) {
      let condition = line.slice(2, line.indexOf('{')).trim();
      const [block, end] = parseBlock(i);
      const conditionResult = eval(condition.replace(/([a-zA-Z]+)/g, (_, v) => vars[v] ?? v));
      if (conditionResult) {
        runVeko(block.slice(1, -1).join('\n'), inputFunc, outputFunc);
      } else if (lines[end + 1]?.startsWith('else')) {
        const [elseBlock, elseEnd] = parseBlock(end + 1);
        runVeko(elseBlock.slice(1, -1).join('\n'), inputFunc, outputFunc);
        i = elseEnd;
      } else {
        i = end;
      }
    } else if (line.startsWith('func ')) {
      const name = line.split(' ')[1];
      const [block, end] = parseBlock(i);
      funcs[name] = block.slice(1, -1).join('\n');
      i = end;
    } else if (line.endsWith('()') && funcs[line.slice(0, -2)]) {
      runVeko(funcs[line.slice(0, -2)], inputFunc, outputFunc);
    }

    i++;
  }
}
module.exports = { runVeko };