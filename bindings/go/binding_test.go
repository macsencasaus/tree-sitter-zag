package tree_sitter_zag_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_zag "github.com/macsencasaus/tree-sitter-zag/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_zag.Language())
	if language == nil {
		t.Errorf("Error loading Zag grammar")
	}
}
