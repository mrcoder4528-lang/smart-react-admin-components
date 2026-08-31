import { render, screen, fireEvent } from '@testing-library/react';
import { SmartAvatar, SmartAvatarGroup } from './SmartAvatar';

describe('SmartAvatar component', () => {
  test('renders initials from name when src is not provided', () => {
    render(<SmartAvatar name="Sarah Connor" />);
    expect(screen.getByText('SC')).toBeInTheDocument();
  });

  test('renders image when src is provided', () => {
    render(<SmartAvatar src="https://example.com/avatar.jpg" alt="Sarah" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(img).toHaveAttribute('alt', 'Sarah');
  });

  test('renders status indicator dot', () => {
    const { container } = render(<SmartAvatar name="John Doe" status="online" />);
    expect(container.querySelector('.sra-avatar__status--online')).toBeInTheDocument();
  });

  test('handles click events and preview modal', () => {
    const handleClick = jest.fn();
    render(
      <SmartAvatar
        src="https://example.com/avatar.jpg"
        name="John Doe"
        preview={true}
        onClick={handleClick}
      />,
    );

    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('SmartAvatarGroup component', () => {
  test('renders multiple avatars and overflow count', () => {
    render(
      <SmartAvatarGroup max={2}>
        <SmartAvatar name="Alice" />
        <SmartAvatar name="Bob" />
        <SmartAvatar name="Charlie" />
        <SmartAvatar name="David" />
      </SmartAvatarGroup>,
    );

    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(screen.getByText('BO')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
