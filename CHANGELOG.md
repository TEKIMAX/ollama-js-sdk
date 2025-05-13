# Changelog

All notable changes to @tekimax/ollama-sdk will be documented in this file.

## [1.5.0] - 2023-05-13

### Fixed
- Fixed model pull command to properly handle streaming responses
- Fixed model remove command to correctly handle API responses and verify deletion
- Fixed inconsistent error handling in CLI commands

### Added
- Added comprehensive command documentation to the README
- Added detailed command reference to CLI help output
- Added extensive documentation for the interactive tutorial mode
- Created dedicated documentation files in the docs/ directory:
  - tutorial.md - Complete guide to the interactive tutorial
  - getting-started.md - Basic setup and usage guide
  - api-reference.md - Detailed API documentation
  - openai-compatibility.md - Guide to using the OpenAI compatibility layer
  - configuration.md - Advanced configuration options
- Added troubleshooting section to README with common issues and solutions
- Added insecure flag option documentation for pull command

## [1.4.0] - 2023-05-10

### Added
- OpenAI compatibility layer for easy migration from OpenAI API
- Support for chat completions, embeddings, and models endpoints
- Streaming response support for chat completions
- Vision API support for multimodal models

### Changed
- Improved error handling across all API endpoints
- Enhanced TypeScript definitions for better developer experience

## [1.3.0] - 2023-04-20

### Added
- CLI interface for common operations
- Interactive tutorial mode for onboarding new users
- Support for model retrieval and management
- Vector similarity calculations for embeddings

## [1.2.0] - 2025-05-17

### Added
- Interactive tutorial command (`tutorial`) for guided learning experience
- Step-by-step walkthrough of basic SDK features
- User input prompts for customized tutorial experience

### Fixed
- Ensured ASCII art banner is consistently displayed for all commands
- Improved error handling in CLI functions
- Better command parsing and feedback

## [1.1.0] - 2025-05-16

### Added
- Extended CLI functionality with model management commands:
  - `pull` command for downloading new models
  - `show` command for viewing model details
  - `remove` command for deleting models
- Advanced generation parameters support in CLI:
  - Temperature control via `--temperature` or `-t` flag
  - Top-p sampling via `--top-p` flag
- Comprehensive CLI documentation in README with examples for all commands
- Expanded model management examples in documentation

## [1.0.9] - 2025-05-15

### Fixed
- Updated README badges to correctly reference the scoped package name
- Fixed installation instructions to use the correct package name
- Updated CLI examples with proper package reference

## [1.0.8] - 2025-05-15

### Changed
- Updated CLI banner with retro-style colors (amber/blue/cyan) instead of rainbow gradient

## [1.0.7] - 2025-05-15

### Added
- Modern styled README with badges and improved documentation
- Enhanced CLI with colorful output using chalk
- Visual improvements with ASCII art banner using figlet
- Loading animations with ora spinners
- Gradient text effects for better visual appeal

### Fixed
- Resolved ESM compatibility issues with CLI dependencies
- Fixed TypeScript linter errors
- Clarified API key requirements in documentation
- Improved CLI output formatting with template literals

## [1.0.6] - 2025-05-13

### Added
- Comprehensive CLI command reference with examples
- Step-by-step CLI tutorial in README
- Advanced usage examples for CLI integration with shell pipelines

## [1.0.1] - 2023-06-12

### Changed
- Updated repository URLs in package.json
- Fixed npm publishing configuration

## [1.0.0] - 2023-06-10

### Added
- Initial release of the Ollama SDK
- Full client implementation for the Ollama API
- Model management (list, pull, push, create, delete)
- Text generation and chat completion
- Embeddings generation and similarity comparison
- Fine-tuning module for customizing models
- CLI tool for interacting with Ollama
- Streaming support for text generation and chat
- Comprehensive documentation and examples 