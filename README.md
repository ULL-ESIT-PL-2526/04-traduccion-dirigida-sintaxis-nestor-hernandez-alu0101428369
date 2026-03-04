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
<<<<<<< HEAD

### Indique por qué ** debe aparecer antes que [-+*/].
- ```**``` debe aparecer antes que ```[-+*/]``` porque el analizador léxico evalúa las reglas en orden y, si ```[-+*/]``` aparece primero, el operador ```**``` sería reconocido como dos tokens ```*``` en lugar de un único token ```**```.

### Explique cuándo se devuelve EOF.
- ```EOF``` se devuelve cuando el analizador léxico alcanza el final de la entrada y ya no quedan más caracteres por leer.

### Explique por qué existe la regla . que devuelve INVALID.
- El ```.``` significa cualquier caracter que no haya sido reconocido por las reglas anteriores.

## Modifique el analizador léxico de grammar.jison para que se salte los comentarios de una línea que empiezan por //.
  - He añadido a mi grammar.json la siguiente linea:

    ```"//"[^\n]*   { /* skip single-line comment */ }```

  Lo que hace es que lo que empieza por ```//``` seguido de cualquier cosa que no sea un salto de linea, lo ignora.

## Modifique el analizador léxico de grammar.jison para que reconozca números en punto flotante como 2.35e-3, 2.35e+3, 2.35E-3, 2.35 y 23.
  - He modificado esta linea de mi grammar.json:

    ```[0-9]+   { return 'NUMBER'; }```
  - Por la siguiente:

    ```([0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?)   { return 'NUMBER'; }```
    
    Gracias a esa ampliación de la expresión regular, puede leer numeros en punto flotante en todas las formas posibles.

## Añada pruebas para las modificaciones del analizador léxico de grammar.jison.
- He añadido dos pruebas una para los comentarios de una linea y otra para los numeros en punto flotante
  ```
  describe('Comment one line tests', () => {
      test('should ignore comments', () => {
        expect(parse("// This is a comment")).toBe(null);
        expect(parse("10 // Another comment")).toBe(10);
        expect(parse("7 - 5 - 1 // Comment here")).toBe(1);
        expect(parse("3 + 5.4e+1 // Adding two numbers")).toBe(57);
        expect(parse("2**3 // Ignore this 2+3")).toBe(8);
      });
    });

    describe('Number floating point tests', () => {
      test('should handle floating point numbers', () => {
        expect(parse("3.14")).toBe(3.14);
        expect(parse("0.001")).toBe(0.001);
        expect(parse("2.5 + 1.5")).toBe(4);
        expect(parse("5.5 * 2")).toBe(11);
        expect(parse("10 / 4")).toBe(2.5);
        expect(parse("2.5e-3")).toBe(0.0025);
        expect(parse("1.2e+3")).toBe(1200);
        expect(parse("1.2E-3")).toBe(0.0012);
        expect(parse("1.2E+8")).toBe(120000000);
        expect(parse("2.4e+3/2.4e+3")).toBe(1);
      });
    });
  ```

## Definiciones del grammar
### Escriba la derivación para cada una de las frases.
``` 4.0-2.0*3.0```
- L
- ⇒ E eof
- ⇒ E op T eof
- ⇒ E op T op T eof
 - ⇒ T op T op T eof
- ⇒ number op T op T eof
- ⇒ 4.0 op T op T eof
- ⇒ 4.0 - T op T eof
- ⇒ 4.0 - number op T eof
- ⇒ 4.0 - 2.0 op T eof
- ⇒ 4.0 - 2.0 * T eof
- ⇒ 4.0 - 2.0 * number eof
- ⇒ 4.0 - 2.0 * 3.0 eof

``` 2**3**2```
- L
- ⇒ E eof
- ⇒ E op T eof
- ⇒ E op T op T eof
- ⇒ T op T op T eof
- ⇒ number op T op T eof
- ⇒ 2 ** T op T eof
- ⇒ 2 ** number op T eof
- ⇒ 2 ** 3 ** T eof
- ⇒ 2 ** 3 ** number eof
- ⇒ 2 ** 3 ** 2 eof

```7-4/2```
- L
- ⇒ E eof
- ⇒ E op T eof
- ⇒ E op T op T eof
- ⇒ T op T op T eof
- ⇒ number op T op T eof
- ⇒ 7 - T op T eof
- ⇒ 7 - number op T eof
- ⇒ 7 - 4 / T eof
- ⇒ 7 - 4 / number eof
- ⇒ 7 - 4 / 2 eof

### Escriba el árbol de análisis sintáctico (parse tree) para cada una de las frases.
``` 4.0-2.0*3.0```
```
            E
          / | \
         E  *  T
       / | \    |
      E  -  T   3.0
      |     |
      T     2.0
      |
     4.0
```
```2**3**2```
```
            E
          / | \
         E  ** T
       / | \    |
      E ** T    2
      |    |
      T    3
      |
      2
```
```7-4/2```
```
            E
          / | \
         E  /  T
       / | \     |
      E  -  T     2
      |     |
      T     4
      |
      7
```
### ¿En qué orden se evaluan las acciones semánticas para cada una de las frases? Nótese que la evaluación a la que da lugar la sdd para las frases no se corresponde con los convenios de evaluación establecidos en matemáticas y los lenguajes de programación.
``` 4.0-2.0*3.0```
1. convert(4.0)
2. convert(2.0)
3. operate('-', 4.0, 2.0) → 2.0
4. convert(3.0)
5. operate('*', 2.0, 3.0) → 6.0

```2**3**2```
1. convert(2)
2. convert(3)
3. operate('**', 2, 3) → 8
4. convert(2)
5. operate('**', 8, 2) → 64

```7-4/2```
1. convert(7)
2. convert(4)
3. operate('-', 7, 4) → 3
4. convert(2)
5. operate('/', 3, 2) → 1.5

## Modificacion del grammar para respetar la precedencia
He tenido que añadir 3 nuevos tokens y asociarlo con cada operador y despues hacer nuevas reglas respetando la precedencia por pisos(de abajo hacia arriba).

Esto es solamente lo que he añadido al grammar.
 
```
/* Lexer */
%lex
%%
"**"                  { return 'OPOW';         }
"+"|"-"               { return 'OPAD';         }
"*"|"/"               { return 'OPMU';         }
/lex

/* Parser */
%start L
%token OPAD OPMU OPOW 
%%

E
    :E OPAD T
        { $$ = operate($OPAD, $E, $T); }
    | T 
        { $$ = $T; }
    ;

T
    :T OPMU R
        { $$ = operate($OPMU, $T, $R); }
    | R 
        { $$ = $R; }
    ;

R
    :F OPOW R
        { $$ = operate($OPOW, $F, $R); }
    | F 
        { $$ = $F; }
    ;
```

## Test para la precedencia en flotantes
```const { parse } = require('../src/index.js');  

describe('Parser Failing Tests Floating Point', () => {
    test('should handle only sum and subtraction with correct precedence', () => {
        expect(parse("1.5 + 2.3 - 0.8")).toBe(3); // (1.5 + 2.3) - 0.8 = 3
        expect(parse("10.0 - 3.5 + 2.5")).toBe(9); // (10.0 - 3.5) + 2.5 = 9
        expect(parse("5.0 + 4.0 - 1.0")).toBe(8); // (5.0 + 4.0) - 1.0 = 8
        expect(parse("1.0 + 2.0 - 3.0")).toBe(0); // (1.0 + 2.0) - 3.0 = 0
        expect(parse("5.5 + 2.2 - 1.1")).toBe(6.6); // (5.5 + 2.2) - 1.1 = 6.6
        expect(parse("20.0 - 5.5 + 3.0")).toBe(17.5); // (20.0 - 5.5) + 3.0 = 17.5
        expect(parse("15.0 + 4.5 - 2.0")).toBe(17.5); // (15.0 + 4.5) - 2.0 = 17.5
    });
    test('should handle only multiplication and division with correct precedence', () => {
        expect(parse("2.0 * 3.0 / 4.0")).toBe(1.5); // (2.0 * 3.0) / 4.0 = 1.5
        expect(parse("10.0 / 2.0 * 3.0")).toBe(15); // (10.0 / 2.0) * 3.0 = 15
        expect(parse("5.3 * 2.5 / 1.0")).toBe(13.25); // (5.3 * 2.5) / 1.0 = 13.25
        expect(parse("8.8 / 4.7 * 2.0")).toBeCloseTo(3.744680851); // (8.8 / 4.7) * 2.0 = 3.744680851
        expect(parse("12.0 * 3.5 / 2.0")).toBe(21); // (12.0 * 3.5) / 2.0 = 21
        expect(parse("9.0 / 3.4 * 1.5")).toBeCloseTo(3.970588235); // (9.0 / 3.4) * 1.5 = 3.970588235
        expect(parse("7.5 * 2.0 / 5.0")).toBe(3); // (7.5 * 2.0) / 5.0 = 3
    });
    test('should handle only exponentiation with correct precedence', () => {
        expect(parse("2.0 ** 3.0 ** 2.0")).toBe(512); // 2.0 ** (3.0 ** 2.0) = 2.0 ** 9.0 = 512
        expect(parse("3.0 ** 2.0 ** 2.0")).toBe(81); // 3.0 ** (2.0 ** 2.0) = 3.0 ** 4.0 = 81
        expect(parse("2.0 ** 3.3")).toBeCloseTo(9.849); // 2.0 ** 3.3 = 9.849
        expect(parse("5.0 ** 2.5")).toBeCloseTo(55.901699437); // 5.0 ** 2.5 = 55.901699437
        expect(parse("10.0 ** 1.5")).toBeCloseTo(31.6227766017); // 10.0 ** 1.5 = 31.6227766017
        expect(parse("4.4 ** 3.0")).toBe(85.18400000000003); // 4.4 ** 3.0 = 85.18400000000003
        expect(parse("6.0 ** 2.0")).toBe(36); // 6.0 ** 2.0 = 36
    });
    test('should handle mixed operations with correct precedence', () => {
        expect(parse("1.5 + 2.3 * 4.0")).toBe(10.7); // 1.5 + (2.3 * 4.0) = 10.7
        expect(parse("10.0 - 6.0 / 2.0")).toBe(7);
        expect(parse("5.5 * 2.0 + 3.0")).toBe(14); // (5.5 * 2.0) + 3.0 = 14
        expect(parse("1.5 + 2.3 * 4.0")).toBe(10.7); // 1.5 + (2.3 * 4.0) = 10.7
        expect(parse("10.0 - 6.0 / 2.0")).toBe(7); // 10.0 - (6.0 / 2.0) = 7
        expect(parse("5.5 * 2.0 + 3.0")).toBe(14); // (5.5 * 2.0) + 3.0 = 14
        expect(parse("1.5 + 2.3 * 4")).toBe(10.7); // 1.5 + (2.3 * 4) = 10.7
        expect(parse("10.0 - 6.0 / 2")).toBe(7); // 10.0 - (6.0 / 2) = 7
        expect(parse("5.5 * 2 + 3.0")).toBe(14); // (5.5 * 2) + 3.0 = 14
    });
});
```

## Reconocer parentesis
He tenido que crear 2 nuevos tokens y asociarlo a los dos operadores nuevos que he creado y en la regla de producción 'F' he añadido una nueva para que lea los parentesis.

```
/* Lexer */
%lex
%%
"("                   { return 'LPAREN';       }
")"                   { return 'RPAREN';       }  

/lex

/* Parser */
%start L
%token LPAREN RPAREN
%%

F
    : NUMBER
        { $$ = Number(yytext); }
    | LPAREN E RPAREN
        { $$ = $E}
    ;
%%
```

## Test de los parentesis
```
const { parse } = require('../src/index.js');

describe('Parser Failing Tests Parentheses', () => {
    test('should handle parentheses with correct precedence with sum and subtraction', () => {
        expect(parse("(1 + 2) - 3")).toBe(0); // (1 + 2) - 3 = 0
        expect(parse("10 - (3 + 2)")).toBe(5); // 10 - (3 + 2) = 5
        expect(parse("(5 + 4) - 1")).toBe(8); // (5 + 4) - 1 = 8
        expect(parse("1 + (2 - 3)")).toBe(0); // 1 + (2 - 3) = 0
        expect(parse("(5 + 2) - 1")).toBe(6); // (5 + 2) - 1 = 6
        expect(parse("20 - (5 + 3)")).toBe(12); // 20 - (5 + 3) = 12
        expect(parse("(15 + 4) - 2")).toBe(17); // (15 + 4) - 2 = 17
    });
    test('should handle parentheses with correct precedence with multiplication and division', () => {
        expect(parse("(2 * 3) / 4")).toBe(1.5); // (2 * 3) / 4 = 1.5
        expect(parse("10 / (2 * 3)")).toBeCloseTo(1.6666666667); // 10 / (2 * 3) = 10 / 6 = 1.6666666667
        expect(parse("(5 * 2) / 1")).toBe(10); // (5 * 2) / 1 = 10
        expect(parse("8 / (4 * 2)")).toBe(1); // 8 / (4 * 2) = 8 / 8 = 1
        expect(parse("(12 * 3) / 2")).toBe(18); // (12 * 3) / 2 = 36 / 2 = 18
        expect(parse("9 / (3 * 1.5)")).toBe(2); // 9 / (3 * 1.5) = 9 / 4.5 = 2
        expect(parse("(7 * 2) / 5")).toBe(2.8); // (7 * 2) / 5 = 14 / 5 = 2.8
    });
    test('should handle parentheses with correct precedence with exponentiation', () => {
        expect(parse("(2 ** 3) ** 2")).toBe(64); // (2 ** 3) ** 2 = 8 ** 2 = 64
        expect(parse("3 ** (2 ** 2)")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
        expect(parse("(2 ** 3) + 1")).toBe(9); // (2 ** 3) + 1 = 8 + 1 = 9
        expect(parse("3 + (2 ** 4)")).toBe(19); // 3 + (2 ** 4) = 3 + 16 = 19
        expect(parse("(2 * 3) ** 2")).toBe(36); // (2 * 3) ** 2 = 6 ** 2 = 36
        expect(parse("10 - (2 ** 3)")).toBe(2); // 10 - (2 ** 3) = 10 - 8 = 2
    });
    test('should handle nested parentheses with correct precedence', () => {
        expect(parse("((1 + 2) * 3) - 4")).toBe(5); // ((1 + 2) * 3) - 4 = (3 * 3) - 4 = 9 - 4 = 5
        expect(parse("(10 - (3 + 2)) * 4")).toBe(20); // (10 - (3 + 2)) * 4 = (10 - 5) * 4 = 5 * 4 = 20
        expect(parse("((5 * 2) + 1) / 3")).toBe(3.6666666666666665); // ((5 * 2) + 1) / 3 = (10 + 1) / 3 = 11 / 3
        expect(parse("1 + (2 * (3 - 4))")).toBe(-1); // 1 + (2 * (3 - 4)) = 1 + (2 * -1) = 1 - 2 = -1
        expect(parse("((5 + 2) * (3 - 1)) / 2")).toBe(7); // ((5 + 2) * (3 - 1)) / 2 = (7 * 2) / 2 = 14 / 2 = 7
        expect(parse("20 - ((5 + 3) * (2 - 1))")).toBe(12); // 20 - ((5 + 3) * (2 - 1)) = 20 - (8 * 1) = 20 - 8 = 12
        expect(parse("(15 + (4 * 2)) - (2 ** 3)")).toBe(15); // (15 + (4 * 2)) - (2 ** 3) = (15 + 8) - 8 = 23 - 8 = 15  
    });
});
```
=======

### Indique por qué ** debe aparecer antes que [-+*/].
- ```**``` debe aparecer antes que ```[-+*/]``` porque el analizador léxico evalúa las reglas en orden y, si ```[-+*/]``` aparece primero, el operador ```**``` sería reconocido como dos tokens ```*``` en lugar de un único token ```**```.

### Explique cuándo se devuelve EOF.
- ```EOF``` se devuelve cuando el analizador léxico alcanza el final de la entrada y ya no quedan más caracteres por leer.

### Explique por qué existe la regla . que devuelve INVALID.
- El ```.``` significa cualquier caracter que no haya sido reconocido por las reglas anteriores.

## Modifique el analizador léxico de grammar.jison para que se salte los comentarios de una línea que empiezan por //.
  - He añadido a mi grammar.json la siguiente linea:

    ```"//"[^\n]*   { /* skip single-line comment */ }```

  Lo que hace es que lo que empieza por ```//``` seguido de cualquier cosa que no sea un salto de linea, lo ignora.

## Modifique el analizador léxico de grammar.jison para que reconozca números en punto flotante como 2.35e-3, 2.35e+3, 2.35E-3, 2.35 y 23.
  - He modificado esta linea de mi grammar.json:

    ```[0-9]+   { return 'NUMBER'; }```
  - Por la siguiente:

    ```([0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?)   { return 'NUMBER'; }```
    
    Gracias a esa ampliación de la expresión regular, puede leer numeros en punto flotante en todas las formas posibles.

## Añada pruebas para las modificaciones del analizador léxico de grammar.jison.
- He añadido dos pruebas una para los comentarios de una linea y otra para los numeros en punto flotante
  ```
  describe('Comment one line tests', () => {
      test('should ignore comments', () => {
        expect(parse("// This is a comment")).toBe(null);
        expect(parse("10 // Another comment")).toBe(10);
        expect(parse("7 - 5 - 1 // Comment here")).toBe(1);
        expect(parse("3 + 5.4e+1 // Adding two numbers")).toBe(57);
        expect(parse("2**3 // Ignore this 2+3")).toBe(8);
      });
    });

    describe('Number floating point tests', () => {
      test('should handle floating point numbers', () => {
        expect(parse("3.14")).toBe(3.14);
        expect(parse("0.001")).toBe(0.001);
        expect(parse("2.5 + 1.5")).toBe(4);
        expect(parse("5.5 * 2")).toBe(11);
        expect(parse("10 / 4")).toBe(2.5);
        expect(parse("2.5e-3")).toBe(0.0025);
        expect(parse("1.2e+3")).toBe(1200);
        expect(parse("1.2E-3")).toBe(0.0012);
        expect(parse("1.2E+8")).toBe(120000000);
        expect(parse("2.4e+3/2.4e+3")).toBe(1);
      });
    });
  ```
>>>>>>> main
