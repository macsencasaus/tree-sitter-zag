import XCTest
import SwiftTreeSitter
import TreeSitterZag

final class TreeSitterZagTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_zag())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Zag grammar")
    }
}
