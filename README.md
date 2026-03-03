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