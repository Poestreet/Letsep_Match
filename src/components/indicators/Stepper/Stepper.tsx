import React from 'react';
import '../../../tokens.css';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'var(--typography-fontfamily2)',
      width: '100%',
    }}
  >
    {steps.map((step, idx) => {
      const isCompleted = idx < currentStep;
      const isActive = idx === currentStep;

      return (
        <React.Fragment key={step}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacings-base-1)',
              flex: '0 0 auto',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                background: isCompleted
                  ? 'var(--background-interactive)'
                  : isActive
                  ? 'var(--background-interactive)'
                  : 'var(--background-default-alt)',
                color: isCompleted || isActive
                  ? 'var(--foreground-interactive)'
                  : 'var(--carbon-fiber-50)',
                border: isActive
                  ? '2px solid var(--border-accent)'
                  : 'none',
                transition: 'background 0.2s',
              }}
            >
              {isCompleted ? '✓' : idx + 1}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500,
                color: isActive
                  ? 'var(--foreground-accent)'
                  : isCompleted
                  ? 'var(--foreground-default)'
                  : 'var(--carbon-fiber-40)',
                whiteSpace: 'nowrap',
              }}
            >
              {step}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: '2px',
                background: idx < currentStep
                  ? 'var(--background-interactive)'
                  : 'var(--border-default)',
                margin: '0 var(--spacings-base-2)',
                marginBottom: '18px',
                transition: 'background 0.2s',
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);
