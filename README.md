# Ori

Ori is my little programming language.

## Why another language ?

I am making this because I find that this is a good coding challenge for myself, and I am very interested in how programming languages work under the hood (lexer, parser and interpreter / compiler).

The purpose of this is of course not to be used in production environment. It is not finished, not stable, not optimized in any, and it is an interpreted language written in JavaScript.

> Yes, I know it is bad, but JavaScript is my main language for now. I will maybe rewrite it later in Rust if i can find the time to learn it.

But what you can do is experiment with it, I would be very happy that someone find this work interesting.

## Philosophy

My main goal and challenge for Ori is that *everything* represents a value. I know it can sound weird, so here is an explanation : anything in Ori is an expression. Variable declarations, literals, conditions, loops... And an expression, when evaluated, returns a value which can be used in an other expression.

Yes, in Ori, loops return a value.

To understand better, let's see some examples.

## Examples

```
n = 1
```
This simple code, which affect the value `1` to the variable `n`, returns the affected value. On top of that, `1` returns itself, because it is also an expression.

So the following is totally valid Ori :
```
n = m = 1
```
First, `m` takes the value of `1`, and then `n` takes the value of the assignment, which is `1`.

Now the weird part, conditions and loops :
```
ternary = if true then "yay" else "sad"

loop_result = for v in [1, 2, 3] do v * 2
```
The `ternary` is like in JavaScript (`bool ? true : false`), but the syntax of the condition is the same when there is no assignment.

For the for-loop, I decided that it returns an array containing the return value of each iteration. The while-loop returns the return value of the last iteration.

Speaking of which, there is no return-statement, because in Ori, there are only expressions. To achieve that, functions, loops and condition automatically return the value of the last expression in their body. If you cannot live without return-statement, here is a little but useless trick to add them in Ori :

```
return = fn (value) value

add = fn (a, b) {
    return(a + b)
}
```

Here, we declare a function which return its argument, and assign it to the variable `return` (function declaration are expressions). Now, you can use this in functions body's to clearly mark that a value is returned, even if it is always the case.

> To add an inline comment, you can use a semi-colon `;`

Now let's see fancy things :
```
if {
    "I am an expression"
    1 == 1 ; returns true
} {
    output('Hello') ; 'Hello' is printed
} else {
    output('Goodbye')
}

choice = 1
for v in {
    if choice == 1 then [1, 2, 3] ; choice is 1 so this is returned to the loop
    else [4, 5, 6]
} output(v) ; prints 1 then 2 then 3 

addXFactory = fn (x) fn (n) n + x ; a function that returns a function
increment = addXFactory(1)
output(increment(3))
```

## Limitations

This idea of everything is an expression, with the syntax I chose, can lead to very hard to read code. I have not figured yet how to avoid that, and I am not even sure if I want to avoid it. If you don't like unreadable code, don't write it :)

```
if if true then false else false then for v in [1..4] do output(v) else if false then 'maybe ?' else while true do output('yes')
```
This horrible one-liner is the same as :
```
if {
    if true {
        false
    } else {
        false ; false is returned
    }
} then {
    for v in [1..4] do {
        output(v)
    }
} else { ; else branch is evaluated
    if false {
        'maybe ?'
    } else {
        while true {
            output('yes') ; yes
        }
    }
}
```
I know it is not much better, please avoid complicated expressions in `if`'s condition, future you don't want to deal with this mess.

## Current implementation

The implementation i'm working on is in the `v2` folder. `v1` is for the first version (no way), which "grammar" was not how i wanted, and the parser was too advanced to modify it, so I prefered to start again from scratch.

Here is the state of the v2 :

- The lexer should be fully-implemented (I did some tests and everything seems ok).
- The parser is in very-early stage, it contains a lot of unknown bugs and misses some features yet.
- The interpreter is almost working for the `v1`, but functions calls crash and closures are not working. It does not exist fot the v2 yet.

## Features

- Data types : booleans, strings and number (floats and integer are treated the same)
- Data structures : arrays and objects
- Control flow : condition and loops (for with iterator and while)
- Functions
- Scopes

If you want to see more, you can find examples of various things in the [`examples`](examples/) folder, and examples of the features above in the [`examples/define`](examples/define/) folder, which I also use as the grammar definition for now.