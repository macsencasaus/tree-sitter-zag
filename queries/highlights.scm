(identifier) @variable

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z\\d_]*$"))

(call_expr
  function: (identifier) @Function)

(fn
  function: (identifier) @Function)

(fn
  param: (identifier) @Function
  .
  param_type: (fn_type))

(var
  .
  (identifier) @Function
  .
  (fn_type))

[
  "fn"
  "var"
  "return"
  "if"
  "else"
  "while"
  "break"
  "continue"
  "extern"
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
