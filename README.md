# Veko Language (Yellow Theme)

**Veko** is a completely original programming language with its own syntax and style.

## 🔤 Syntax Examples

```veko
say: "Hello"
x <- 10
name <- ask

loop 3 times {
  say: "Looping"
}

when x > 5 {
  say: "Big"
} else {
  say: "Small"
}

fn greet {
  say: "Hey!"
}
call greet
```

## 📦 Run CLI

```bash
npm install -g .
veko examples/hello.vk
```

## 🌐 Playground

Open `web/index.html` to run Veko in browser.
