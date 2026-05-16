# Unit Testing Guide

This project uses **Vitest** with **React Native Testing Library** for unit testing.

## Setup

Testing dependencies are already configured in `package.json`. To install them, run:

```bash
npm install
# or
yarn install
```

## Running Tests

### Run all tests
```bash
npm run test
```

### Watch mode (re-run tests on file changes)
```bash
npm run test:watch
```

### UI dashboard for tests
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Files Location

All test files are located in the `__tests__` directory:

```
__tests__/
├── data.test.js              # Data helpers tests (days, education_types, gender)
├── ThemeContext.test.jsx     # ThemeContext tests
├── Button.test.jsx           # Button component tests
├── InputField.test.jsx       # InputField component tests
└── utilities.test.js         # General utility tests
```

## Test Coverage

The test suite currently covers:

### Data Helpers (`data.test.js`)
- Days array structure and content
- Education types array structure and content
- Gender options array structure and content
- Validation of IDs, labels, and values

### Theme Context (`ThemeContext.test.jsx`)
- Provider functionality
- Context value availability
- Color scheme management
- Theme object provision

### Components (`Button.test.jsx`, `InputField.test.jsx`)
- Component rendering
- Prop handling
- Event handlers (onPress, onChangeText)
- Styling application
- Disabled states
- Loading states
- Icon support
- RTL support

### Utilities (`utilities.test.js`)
- Data validation
- String operations
- Type checking
- Array operations
- Object operations
- Comparison operators

## Writing New Tests

### Test Structure

```javascript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = someFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Testing React Components

```javascript
import { render, screen } from '@testing-library/react-native';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render with text', () => {
    render(<MyComponent text="Hello" />);
    
    const element = screen.getByText('Hello');
    expect(element).toBeDefined();
  });
});
```

### Testing with Context

```javascript
import { ThemeProvider } from '@/context/ThemeContext';

function TestWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('ComponentWithTheme', () => {
  it('should use theme', () => {
    render(
      <TestWrapper>
        <MyComponent />
      </TestWrapper>
    );
    
    expect(screen.getByText('Themed Content')).toBeDefined();
  });
});
```

## Common Test Patterns

### Testing Props
```javascript
it('should accept custom prop', () => {
  render(<Button text="Custom" />);
  expect(screen.getByText('Custom')).toBeDefined();
});
```

### Testing User Interactions
```javascript
it('should call handler on press', () => {
  const onPress = vi.fn();
  render(<Button onPressEvent={onPress} />);
  
  fireEvent(screen.getByText('Button'), 'press');
  expect(onPress).toHaveBeenCalled();
});
```

### Testing State Changes
```javascript
it('should update when prop changes', () => {
  const { rerender } = render(<Component value="initial" />);
  expect(screen.getByText('initial')).toBeDefined();
  
  rerender(<Component value="updated" />);
  expect(screen.getByText('updated')).toBeDefined();
});
```

## Configuration Files

- **vitest.config.js**: Main Vitest configuration
- **vitest.setup.js**: Setup file for mocking React Native modules

## Mocked Modules

The following modules are mocked in `vitest.setup.js`:
- `react-native` (Appearance, etc.)
- `expo-router`
- `@expo/vector-icons`
- `expo-constants`
- `@react-native-async-storage/async-storage`

## Debugging Tests

### VS Code Integration

The test files will be automatically recognized by VS Code with Vitest extension. You can:
- Click "Run" or "Debug" above each test
- Set breakpoints in test files
- Use `console.log()` for debugging

### CLI Debugging

```bash
# Run specific test file
npm run test -- data.test.js

# Run tests matching pattern
npm run test -- --grep "Button"

# Run with verbose output
npm run test -- --reporter=verbose
```

## Best Practices

1. **Keep tests focused**: One test should test one thing
2. **Use descriptive names**: Test names should clearly state what is being tested
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Avoid implementation details**: Test behavior, not implementation
5. **Mock external dependencies**: Keep tests isolated and fast
6. **Use meaningful assertions**: Make error messages clear

## Troubleshooting

### Tests not running
- Make sure dependencies are installed: `npm install`
- Check that test files have `.test.js` or `.test.jsx` extension
- Verify `vitest.config.js` is in the project root

### Import errors
- Verify paths use `@/` alias (configured in `vitest.config.js`)
- Check that files exist at the specified path
- Make sure imports match the actual exports

### React Native component errors
- Components should be wrapped with `ThemeProvider` if they use `ThemeContext`
- Mock any external dependencies the component relies on
- Use `@testing-library/react-native` queries for finding elements

## Further Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
