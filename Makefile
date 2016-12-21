E2E_TESTS = integration_tests/*.js
e2e:
	@mocha --timeout 5000 --reporter nyan $(E2E_TESTS)

.PHONY: e2e
TESTS = unit_tests/*.js
unit:
	@mocha --timeout 5000 --reporter nyan $(TESTS)

.PHONY: unit
