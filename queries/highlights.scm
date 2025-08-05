(identifier) @variable

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z\\d_]*$"))

(call_expr
  function: (identifier) @Function)

(fn
  function: (identifier) @Function)

[
  "fn"
  "var"
  "return"
  "if"
  "while"
  "break"
  "continue"
] @keyword

[
  "-"
  "~"
  "!"
  "&"
  "++"
  "--"
  "="
  "|"
  "^"
  "&"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "<<"
  ">>"
  "+"
  "*"
  "/"
  "%"
] @operator

(int_literal) @number
(string_literal) @string
(char_literal) @string

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

[
  ","
  ";"
  ":"
  "..."
] @punctuation.delimeter

(primitive_type) @type

(comment) @comment @spell
