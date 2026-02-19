import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDefined();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined();
  });

  it('renders with default type text', () => {
    render(<Input />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('renders with specified type email', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('renders password type input', () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('custom-input');
  });

  it('merges custom className with default classes', () => {
    render(<Input className="mt-2" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('mt-2');
    expect(input.className).toContain('flex');
  });

  it('has standard styling classes', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('h-10');
    expect(input.className).toContain('w-full');
    expect(input.className).toContain('rounded-md');
    expect(input.className).toContain('border');
  });

  it('forwards ref to input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('handles onChange events', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('renders as disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('disabled input has disabled styling classes', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('disabled:cursor-not-allowed');
    expect(input.className).toContain('disabled:opacity-50');
  });

  it('passes value prop correctly', () => {
    const onChange = vi.fn();
    render(<Input value="initial value" onChange={onChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial value');
  });

  it('passes aria-label attribute', () => {
    render(<Input aria-label="Search field" />);
    expect(screen.getByRole('textbox', { name: 'Search field' })).toBeDefined();
  });

  it('passes data attributes through', () => {
    render(<Input data-testid="custom-input" />);
    expect(screen.getByTestId('custom-input')).toBeDefined();
  });

  it('has text-sm class', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('text-sm');
  });

  it('renders number type input', () => {
    const { container } = render(<Input type="number" />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('number');
  });

  it('passes maxLength attribute', () => {
    render(<Input maxLength={50} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.maxLength).toBe(50);
  });
});
