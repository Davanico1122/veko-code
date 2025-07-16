# 🦊 Veko Programming Language

**Veko** is a beginner-friendly interpreted language with custom syntax and browser support.

## 🚀 Features
- Simple syntax (`print`, `let`, `repeat`, `if`, `func`)
- Web-based playground
- CLI interpreter
- MIT License

## 📦 Installation
```bash
npm install -g .
veko examples/hello.vk
```

## 📄 Example Code (hello.vk)
```vk
let name = input("What is your name?")
print "Hello, " + name

repeat 3 {
  print "Learning Veko is fun!"
}

let age = 17
if age >= 17 {
  print "You can vote!"
} else {
  print "Too young to vote."
}

func greet {
  print "Hi from Veko!"
}
greet()
```

## 🌐 Try Online
https://Davanico1122.github.io/Veko