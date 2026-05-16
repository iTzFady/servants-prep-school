import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import InputField from '@/components/InputField';
import { ThemeProvider } from '@/context/ThemeContext';

// Wrapper component to provide theme context
function InputFieldTestWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('InputField Component', () => {
  const defaultProps = {
    text: 'Username',
    placeholder: 'Enter username',
    onChangeText: vi.fn(),
    value: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input field with label', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} />
      </InputFieldTestWrapper>
    );

    const label = screen.getByText('Username');
    expect(label).toBeDefined();
  });

  it('should render input field with placeholder', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeDefined();
  });

  it('should call onChangeText when text is entered', () => {
    const onChangeTextMock = vi.fn();
    
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} onChangeText={onChangeTextMock} />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    fireEvent.changeText(input, 'testuser');

    expect(onChangeTextMock).toHaveBeenCalledWith('testuser');
  });

  it('should display current value in input field', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} value="currentValue" />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    expect(input.props.value).toBe('currentValue');
  });

  it('should render with custom label text', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} text="Email Address" />
      </InputFieldTestWrapper>
    );

    const label = screen.getByText('Email Address');
    expect(label).toBeDefined();
  });

  it('should handle password input with secureTextEntry', () => {
    render(
      <InputFieldTestWrapper>
        <InputField
          {...defaultProps}
          text="Password"
          placeholder="Enter password"
          secureTextEntry={true}
        />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should set correct autoCapitalize prop', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} autoCapitalize="none" />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    expect(input.props.autoCapitalize).toBe('none');
  });

  it('should set correct autoComplete prop', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} autoComplete="username" />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    expect(input.props.autoComplete).toBe('username');
  });

  it('should set correct inputMode prop', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} inputMode="text" />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    expect(input.props.inputMode).toBe('text');
  });

  it('should set keyboardType when provided', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} keyboardType="email-address" />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('should render with prefix icon', () => {
    const prefixIcon = <Text testID="prefix-icon">Icon</Text>;
    
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} prefixIcon={prefixIcon} />
      </InputFieldTestWrapper>
    );

    const icon = screen.getByTestID('prefix-icon');
    expect(icon).toBeDefined();
  });

  it('should render with suffix icon', () => {
    const suffixIcon = <Text testID="suffix-icon">ClearIcon</Text>;
    
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} suffixIcon={suffixIcon} />
      </InputFieldTestWrapper>
    );

    const icon = screen.getByTestID('suffix-icon');
    expect(icon).toBeDefined();
  });

  it('should render input field without crashing with minimal props', () => {
    render(
      <InputFieldTestWrapper>
        <InputField text="Field" onChangeText={() => {}} value="" />
      </InputFieldTestWrapper>
    );

    expect(screen.getByText('Field')).toBeDefined();
  });

  it('should update value when prop changes', () => {
    const { rerender } = render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} value="initial" />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    expect(input.props.value).toBe('initial');

    rerender(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} value="updated" />
      </InputFieldTestWrapper>
    );

    const updatedInput = screen.getByPlaceholderText('Enter username');
    expect(updatedInput.props.value).toBe('updated');
  });

  it('should have RTL text direction support', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} text="اسم المستخدم" />
      </InputFieldTestWrapper>
    );

    const label = screen.getByText('اسم المستخدم');
    expect(label).toBeDefined();
  });

  it('should set textAlignVertical to center', () => {
    render(
      <InputFieldTestWrapper>
        <InputField {...defaultProps} />
      </InputFieldTestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter username');
    expect(input.props.textAlignVertical).toBe('center');
  });
});
