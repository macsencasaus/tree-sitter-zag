/**
 * @file Zag Grammar
 * @author Macsen Casaus <macsencasaus@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  assign: 1,
  bor: 2,
  xor: 3,
  band: 4,
  eq: 5,
  cmp: 6,
  shift: 7,
  add: 8,
  mult: 9,
  postfix: 10,
  prefix: 11,
  call: 12,
  primary: 100,
};

module.exports = grammar({
  name: "zag",

  extras: ($) => [/\s/, $.comment],

  rules: {
    program: ($) => repeat($._statement),

    _statement: ($) => choice(
      $.fn,
      $.var,
      $.return,
      $.if,
      $.block,
      $.while,
      $.break,
      $.continue,
      $._expr_statement,
    ),
    
    _fn_qualifier: (_) => "extern",

    _fn_decl: ($) =>
      seq(
        optional($._fn_qualifier),
        "fn",
        field("function", $.identifier),
        "(",
        field("params", sep(choice(seq($.identifier, ":", $._type), "..."), ",")),
        ")",
        field("ret_type", $._type),
      ),

    fn: ($) => seq($._fn_decl, choice(";", $.block)),

    var: ($) => seq("var", $.identifier, optional(seq(":", $._type)), optional(seq("=", $._expr)), ";"),

    return: ($) => seq("return", $._expr, ";"),

    if: ($) => prec.right(
      seq(
        "if", 
        field("condition", $._expr), 
        $._statement, 
        optional(seq("else", $._statement))
      )),

    block: ($) => seq("{", repeat($._statement), "}"),

    while: ($) => seq(
      "while", 
      field("condition", $._expr), 
      $._statement
    ),

    break: (_) => seq("break", ";"),
    continue: (_) => seq("continue", ";"),

    _expr_statement: ($) => seq($._expr, ";"),
    
    _expr: ($) => choice(
      $.identifier,
      $.char_literal,
      $.int_literal,
      $.string_literal,
      $.list_literal,
      $.prefix_expr,
      $.postfix_expr,
      $.call_expr,
      $.index_expr,
      $._group_expr,
      $.infix_expr,
    ),

    identifier: (_) => prec(PREC.primary, /[A-Za-z_][A-Za-z0-9_]*/),
    char_literal: (_) => prec(PREC.primary, /'([^\\'\n]|\\[abfnrtv\\'"0-7xuU])'/),
    int_literal: (_) => prec(PREC.primary, /\d+/),
    string_literal: (_) => prec(PREC.primary, /"(?:\\.|[^"\\])*"/),
    list_literal: ($) => prec(PREC.primary, seq("[", optional(field("length", $.int_literal)), "]", $._type, "{", sep($._expr, ","), "}")),

    _prefix_operator: (_) => choice("-", "!", "~", "--", "++", "*", "&"),
    prefix_expr: ($) => prec(PREC.prefix, seq($._prefix_operator, field("right", $._expr))),
    postfix_expr: ($) => prec(PREC.postfix, seq($._expr, choice("++", "--"))),

    call_expr: ($) => prec(PREC.call, seq(field("function", $._expr), "(", sep($._expr, ","), ")")),
    index_expr: ($) => prec(PREC.call, seq($._expr, "[", $._expr, "]")),
    _group_expr: ($) => seq("(", $._expr, ")"),

    infix_expr: ($) => {
      const table = [
        [PREC.assign, "="],
        [PREC.bor, "|"],
        [PREC.xor, "^"],
        [PREC.band, "&"],
        [PREC.eq, choice("==", "!=")],
        [PREC.cmp, choice("<", ">", "<=", ">=")],
        [PREC.shift, choice("<<", ">>")],
        [PREC.add, choice("+", "-")],
        [PREC.mult, choice("*", "/", "%")],
      ];

      return choice(
        ...table.map(([precedence, operator]) =>
          (precedence === PREC.assign ? prec.left : prec.right)(
            precedence,
            seq(
              field("left", $._expr),
              operator,
              field("right", $._expr),
            ),
          ),
        ),
      );
    },

    _type: ($) => choice(
      $.primitive_type,
      $.ptr_type,
      $.arr_type,
      $.fn_type,
    ),

    primitive_type: ($) => choice(
      "i8",
      "u8",
      "i16",
      "u16",
      "i32",
      "u32",
      "i64",
      "u64",
    ),

    ptr_type: ($) => seq("*", $._type),
    arr_type: ($) => seq("[", $.int_literal, "]", $._type),
    fn_type: ($) => seq("fn", "(", sep(choice($._type, "..."), ","), ")", $._type),

    comment: (_) => token(/\/\/.*/),
  }
});

function sep(rule, seperator) {
  return seq(repeat(seq(rule, seperator)), optional(rule));
}
