import React from 'react';

const DesignTokensDemo: React.FC = () => {
  return (
    <div className="p-8 bg-bg-primary">
      <h1 className="text-4xl font-bold text-text-primary mb-8">
        Design Tokens Demo
      </h1>
      
      {/* Color Tokens Demo */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Color Tokens
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="text-center">
              <div 
                className={`w-16 h-16 mx-auto mb-2 rounded-lg bg-primary-${shade}`}
                style={{ backgroundColor: `var(--color-primary-${shade})` }}
              ></div>
              <span className="text-sm text-text-secondary">Primary {shade}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Tokens Demo */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Typography Tokens
        </h2>
        <div className="space-y-2">
          <p className="text-xs text-text-primary">Font Size XS (12px)</p>
          <p className="text-sm text-text-primary">Font Size SM (14px)</p>
          <p className="text-base text-text-primary">Font Size Base (16px)</p>
          <p className="text-lg text-text-primary">Font Size LG (18px)</p>
          <p className="text-xl text-text-primary">Font Size XL (20px)</p>
          <p className="text-2xl text-text-primary">Font Size 2XL (24px)</p>
          <p className="text-3xl text-text-primary">Font Size 3XL (30px)</p>
          <p className="text-4xl text-text-primary">Font Size 4XL (36px)</p>
        </div>
      </section>

      {/* Spacing Tokens Demo */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Spacing Tokens
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-primary-500 rounded" style={{ width: 'var(--spacing-xs)', height: 'var(--spacing-xs)' }}></div>
            <span className="ml-2 text-text-secondary">XS (4px)</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary-500 rounded" style={{ width: 'var(--spacing-sm)', height: 'var(--spacing-sm)' }}></div>
            <span className="ml-2 text-text-secondary">SM (8px)</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary-500 rounded" style={{ width: 'var(--spacing-md)', height: 'var(--spacing-md)' }}></div>
            <span className="ml-2 text-text-secondary">MD (16px)</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary-500 rounded" style={{ width: 'var(--spacing-lg)', height: 'var(--spacing-lg)' }}></div>
            <span className="ml-2 text-text-secondary">LG (24px)</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary-500 rounded" style={{ width: 'var(--spacing-xl)', height: 'var(--spacing-xl)' }}></div>
            <span className="ml-2 text-text-secondary">XL (32px)</span>
          </div>
        </div>
      </section>

      {/* Semantic Colors Demo */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Semantic Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-success text-white rounded-lg text-center">
            Success
          </div>
          <div className="p-4 bg-warning text-white rounded-lg text-center">
            Warning
          </div>
          <div className="p-4 bg-error text-white rounded-lg text-center">
            Error
          </div>
          <div className="p-4 bg-info text-white rounded-lg text-center">
            Info
          </div>
        </div>
      </section>

      {/* Shadow Tokens Demo */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Shadow Tokens
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <p className="text-center text-text-primary">Shadow SM</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-center text-text-primary">Shadow MD</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="text-center text-text-primary">Shadow LG</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <p className="text-center text-text-primary">Shadow XL</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignTokensDemo; 
