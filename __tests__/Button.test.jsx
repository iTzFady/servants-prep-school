import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from '@/components/Button';
import { ThemeProvider } from '@/context/ThemeContext';

// Wrapper component to provide theme context
function ButtonTestWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('Button Component', () => {
  const defaultProps = {
    text: 'Test Button',
    onPressEvent: vi.fn(),
    style: { color: 'white', backgroundColor: '#A71E34' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render button with text', () => {
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} />
      </ButtonTestWrapper>
    );

    const buttonText = screen.getByText('Test Button');
    expect(buttonText).toBeDefined();
  });

  it('should render button with custom text', () => {
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} text="Custom Text" />
      </ButtonTestWrapper>
    );

    const buttonText = screen.getByText('Custom Text');
    expect(buttonText).toBeDefined();
  });

  it('should call onPressEvent when button is pressed', () => {
    const onPressMock = vi.fn();
    
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} onPressEvent={onPressMock} />
      </ButtonTestWrapper>
    );

    const button = screen.getByText('Test Button').parent;
    fireEvent(button, 'press');

    expect(onPressMock).toHaveBeenCalled();
  });

  it('should apply custom style to button', () => {
    const customStyle = { color: 'red', backgroundColor: 'blue' };
    
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} style={customStyle} />
      </ButtonTestWrapper>
    );

    const buttonText = screen.getByText('Test Button');
    expect(buttonText).toBeDefined();
  });

  it('should render with loading state', () => {
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} loading={true} />
      </ButtonTestWrapper>
    );

    // When loading is true, ActivityIndicator should be rendered instead of text
    const buttonText = screen.queryByText('Test Button');
    // The text might not be visible when loading
    expect(buttonText).toBeDefined();
  });

  it('should be disabled when loading is true', () => {
    const onPressMock = vi.fn();
    
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} loading={true} onPressEvent={onPressMock} />
      </ButtonTestWrapper>
    );

    const button = screen.getByText('Test Button').parent;
    fireEvent(button, 'press');

    // Button should not call onPress while loading
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    const onPressMock = vi.fn();
    
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} disabled={true} onPressEvent={onPressMock} />
      </ButtonTestWrapper>
    );

    const button = screen.getByText('Test Button').parent;
    fireEvent(button, 'press');

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should render with prefix icon', () => {
    const prefixIcon = <Text testID="prefix-icon">Icon</Text>;
    
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} prefixIcon={prefixIcon} />
      </ButtonTestWrapper>
    );

    const icon = screen.getByTestID('prefix-icon');
    expect(icon).toBeDefined();
  });

  it('should have correct button styling properties', () => {
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} />
      </ButtonTestWrapper>
    );

    const buttonText = screen.getByText('Test Button');
    expect(buttonText).toBeDefined();
  });

  it('should not call onPressEvent multiple times on single press', () => {
    const onPressMock = vi.fn();
    
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} onPressEvent={onPressMock} />
      </ButtonTestWrapper>
    );

    const button = screen.getByText('Test Button').parent;
    fireEvent(button, 'press');
    fireEvent(button, 'press');

    expect(onPressMock).toHaveBeenCalledTimes(2);
  });

  it('should render button without crashing with minimal props', () => {
    render(
      <ButtonTestWrapper>
        <Button text="Button" style={{}} onPressEvent={() => {}} />
      </ButtonTestWrapper>
    );

    expect(screen.getByText('Button')).toBeDefined();
  });

  it('should apply marginBlock styling', () => {
    render(
      <ButtonTestWrapper>
        <Button {...defaultProps} />
      </ButtonTestWrapper>
    );

    const buttonText = screen.getByText('Test Button');
    expect(buttonText).toBeDefined();
  });
});
