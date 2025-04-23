# Change Log

All notable changes to the cloudonix-js library will be documented in this file.

## [1.3.1] - 2025-04-23

### Fixed
- Fixed System element rendering in Converse verb (now renders as <System\> instead of <s\>)
- Added runtime solution example for System tag rendering in examples/system-tag-solution.js

## [1.3.0] - 2025-04-23

### Added
- Added the Converse verb with nested nouns (Tool, System, User, Speech, Description) for AI voice agent capabilities
- Added example demonstrating the Converse verb usage (`converse-example.js`)
- Implemented Tool nouns with Parameter functionality for LLM function calling
- Added support for different LLM providers (OpenAI, Anthropic) via the model attribute
- Updated README.md with documentation for the new Converse verb and its nouns
- Enhanced API reference to include Converse verb configuration options

## [1.2.0] - 2025-04-23

### Added
- Added the Start verb with nested Stream support for media streaming capabilities
- Added example demonstrating the Start and Stream verb usage (`start-stream-example.js`)
- Updated README.md with documentation for the new Start verb and Stream noun
- Enhanced API reference to include Start verb configuration options

## [1.1.0] - 2025-04-23

### Added
- Callback-based nesting pattern for improved readability and simpler API
- Added nesting support for the Record verb with Say, Play, and Pause verbs
- New examples demonstrating the callback approach (`callback-nesting-example.js`, `dial-consistency-example.js`, and updated `record-example.js`)
- `cxml` attribute for cleaner representation of nested elements
- Consistent verb implementation at all nesting levels
- Enhanced documentation showing both nesting approaches

### Changed
- All verb implementations now use a consistent pattern
- Top-level verbs now use the same implementation as nested verbs
- Improved parameter handling using verb modules' `create()` method
- Updated API reference in README.md to reflect the new callback pattern
- Headers in Dial elements are now always placed before other nouns

### Fixed
- Dial noun implementation now maintains proper ordering (Headers first)
- Made nested element implementations more consistent and reusable
- Standardized method signatures across all nesting levels
- Improved the internal structure for representing nested elements

## [1.0.0] - 2025-03-15

### Added
- Initial release
- Support for all CXML verbs (Response, Play, Say, Gather, Redirect, Hangup, Dial, Pause, Reject, Record, Coach)
- Support for Dial nouns (Number, Sip, Conference, Service, Header)
- Fluent API for building CXML documents
- Simple HTTP server for development and testing
- Example implementations in examples/ directory
- Basic documentation