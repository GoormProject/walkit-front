import React from 'react';

const DesignTokensDemo: React.FC = () => {
  // 하드코딩된 배경색 클래스 배열
  const bgClasses = [
    'bg-primary-50',
    'bg-primary-100', 
    'bg-primary-200',
    'bg-primary-300',
    'bg-primary-400',
    'bg-primary-500',
    'bg-primary-600',
    'bg-primary-700',
    'bg-primary-800',
    'bg-primary-900'
  ];

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
          {bgClasses.map((bgClass, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-lg ${bgClass}`}></div>
              <span className="text-sm text-text-secondary">Primary {50 + index * 100}</span>
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
            <div className="bg-primary-500 rounded w-xs h-xs"></div>
            <span className="ml-2 text-text-secondary">XS (4px)</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary-500 rounded w-sm h-sm"></div>
            <span className="ml-2 text-text-secondary">SM (8px)</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary-500 rounded w-md h-md"></div>
            <span className="ml-2 text-text-secondary">MD (16px)</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary-500 rounded w-lg h-lg"></div>
            <span className="ml-2 text-text-secondary">LG (24px)</span>
          </div>
          <div className="flex items-center">
            <div className="bg-primary-500 rounded w-xl h-xl"></div>
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
