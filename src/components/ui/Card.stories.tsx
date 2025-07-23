import type { Meta, StoryObj } from '@storybook/react';
import Card, { CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter } from './Card';
import Button from './Button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
    interactive: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 카드
export const Default: Story = {
  args: {
    children: 'This is a basic card with some content.',
  },
};

// 제목이 있는 카드
export const WithTitle: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardSubtitle>This is a subtitle for the card</CardSubtitle>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. It can contain any type of content including text, images, or other components.</p>
      </CardContent>
    </Card>
  ),
};

// 완전한 카드 구조
export const Complete: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Complete Card Example</CardTitle>
        <CardSubtitle>This card shows all available sections</CardSubtitle>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card. You can put any content here including:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Text content</li>
          <li>Images</li>
          <li>Forms</li>
          <li>Other components</li>
        </ul>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button variant="primary">Primary Action</Button>
          <Button variant="outline">Secondary Action</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

// 다양한 variant
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a default card with border.</p>
        </CardContent>
      </Card>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has elevation with shadow.</p>
        </CardContent>
      </Card>
      
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Outlined Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has a thicker border.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// 패딩 옵션
export const PaddingOptions: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card padding="none">
        <CardContent>
          <p>No padding</p>
        </CardContent>
      </Card>
      
      <Card padding="sm">
        <CardContent>
          <p>Small padding</p>
        </CardContent>
      </Card>
      
      <Card padding="md">
        <CardContent>
          <p>Medium padding (default)</p>
        </CardContent>
      </Card>
      
      <Card padding="lg">
        <CardContent>
          <p>Large padding</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// 인터랙티브 카드
export const Interactive: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card interactive onClick={() => alert('Card clicked!')}>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Click this card to see the interaction effect. It has hover and active states.</p>
        </CardContent>
      </Card>
      
      <Card variant="elevated" interactive onClick={() => alert('Elevated card clicked!')}>
        <CardHeader>
          <CardTitle>Interactive Elevated</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This elevated card is also interactive with enhanced shadow effects.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// 간단한 콘텐츠 카드
export const SimpleContent: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Simple Card</h3>
          <p>Just some simple content without header or footer.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Icon Card</h3>
            <p>Card with an icon and centered content.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-success font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Users:</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span className="text-text-secondary">2 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}; 
