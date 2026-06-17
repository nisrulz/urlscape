.PHONY: help install serve test test-headed test-ui

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  install       Install dependencies"
	@echo "  serve         Start dev server (port 8765)"
	@echo "  test          Run E2E tests (headless)"
	@echo "  test-headed   Run E2E tests (visible browser)"
	@echo "  test-ui       Run E2E tests (Playwright UI mode)"

install:
	npm install

serve:
	npx -y serve .

test:
	npm test

test-headed:
	npx playwright test --headed

test-ui:
	npx playwright test --ui
