# Syntax Directed Translation with Jison

Jison is a tool that receives as input a Syntax Directed Translation and produces as output a JavaScript parser  that executes
the semantic actions in a bottom up ortraversing of the parse tree.
 

## Compile the grammar to a parser

See file [grammar.jison](./src/grammar.jison) for the grammar specification. To compile it to a parser, run the following command in the terminal:
``` 
➜  jison git:(main) ✗ npx jison grammar.jison -o parser.js
```

## Use the parser

After compiling the grammar to a parser, you can use it in your JavaScript code. For example, you can run the following code in a Node.js environment:

```
➜  jison git:(main) ✗ node                                
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> p = require("./parser.js")
{
  parser: { yy: {} },
  Parser: [Function: Parser],
  parse: [Function (anonymous)],
  main: [Function: commonjsMain]
}
> p.parse("2*3")
6
```

## Definiciones del lexer
### Describa la diferencia entre /* skip whitespace */ y devolver un token.
- ```/* skip whitespace */``` indica que el analizador léxico reconoce los espacios en blanco pero los ignora, es decir, no genera ningún token para ellos.
En cambio, devolver un token significa que el analizador reconoce un patrón y lo envía al parser como una unidad significativa del lenguaje.

### Escriba la secuencia exacta de tokens producidos para la entrada 123**45+@.
- Token 1: NUMBER (123)
- Token 2: OP (**)
- Token 3: NUMBER (45)
- Token 4: OP (+)
- Token 5: INVALID (@)
- Token 6: EOF

### Indique por qué ** debe aparecer antes que [-+*/].
- ```**``` debe aparecer antes que ```[-+*/]``` porque el analizador léxico evalúa las reglas en orden y, si ```[-+*/]``` aparece primero, el operador ```**``` sería reconocido como dos tokens ```*``` en lugar de un único token ```**```.

### Explique cuándo se devuelve EOF.
- ```EOF``` se devuelve cuando el analizador léxico alcanza el final de la entrada y ya no quedan más caracteres por leer.

### Explique por qué existe la regla . que devuelve INVALID.
- El ```.``` significa cualquier caracter que no haya sido reconocido por las reglas anteriores.