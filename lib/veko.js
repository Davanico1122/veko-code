// Veko Language Interpreter (Original Syntax)
const fs = require("fs");
const readline = require("readline");

function runVekoCode(code) {
  const lines = code.split(/\r?\n/);
  const vars = {};
  const funcs = {};

  function evalExpr(expr) {
    return Function(...Object.keys(vars), "return " + expr)(...Object.values(vars));
  }

  function executeBlock(blockLines) {
    for (let i = 0; i < blockLines.length; i++) {
      let line = blockLines[i].trim();
      if (line.startsWith("say:")) {
        const output = line.slice(4).trim();
        console.log(evalExpr(output.replace(/\+/g, '+')));
      } else if (line.includes("<- ask")) {
        const varName = line.split("<-")[0].trim();
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question("Input " + varName + ": ", (answer) => {
          vars[varName] = answer;
          rl.close();
        });
      } else if (line.includes("<-")) {
        const [varName, value] = line.split("<-").map(s => s.trim());
        vars[varName] = evalExpr(value);
      } else if (line.startsWith("loop")) {
        const times = parseInt(line.match(/loop (\d+) times/)[1]);
        const loopBlock = [];
        i++;
        while (i < blockLines.length && !blockLines[i].trim().startsWith("}")) {
          loopBlock.push(blockLines[i++]);
        }
        for (let j = 0; j < times; j++) executeBlock(loopBlock);
      } else if (line.startsWith("when")) {
        const condition = line.match(/when (.*) {/)[1];
        const trueBlock = [];
        const falseBlock = [];
        i++;
        while (i < blockLines.length && !blockLines[i].trim().startsWith("}")) {
          trueBlock.push(blockLines[i++]);
        }
        i++;
        if (blockLines[i] && blockLines[i].trim().startsWith("else")) {
          i++;
          while (i < blockLines.length && !blockLines[i].trim().startsWith("}")) {
            falseBlock.push(blockLines[i++]);
          }
        }
        if (evalExpr(condition)) executeBlock(trueBlock);
        else executeBlock(falseBlock);
      } else if (line.startsWith("fn")) {
        const fnName = line.split(" ")[1];
        const body = [];
        i++;
        while (i < blockLines.length && !blockLines[i].trim().startsWith("}")) {
          body.push(blockLines[i++]);
        }
        funcs[fnName] = body;
      } else if (line.startsWith("call")) {
        const fnName = line.split(" ")[1];
        if (funcs[fnName]) executeBlock(funcs[fnName]);
      }
    }
  }

  executeBlock(lines);
}

if (process.argv.length < 3) {
  console.log("Usage: veko <filename.vk>");
  process.exit(1);
}

const file = process.argv[2];
const code = fs.readFileSync(file, "utf-8");
runVekoCode(code);
