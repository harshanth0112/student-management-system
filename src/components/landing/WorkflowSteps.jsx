import React, { useState, useEffect } from 'react';
import { Container } from '../ui/Container';
import { WorkflowPreview } from './WorkflowPreview';
import { landingContent } from '../../data/landingContent';

export function WorkflowSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { workflow } = landingContent;

  const currentStep = workflow.steps[activeStep] || workflow.steps[0];

  // Auto-advance ~6s per step; pauses on hover or reduced motion
  useEffect(() => {
    if (isPaused) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflow.steps.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, workflow.steps.length]);

  return (
    <section id="how-it-works" className="py-20 border-b border-hairline border-border">
      <Container>
        <div className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            {workflow.sectionNumber} // {workflow.sectionTitle}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Three Steps. Zero Leaks.
          </h2>
        </div>

        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Left Column: Interactive Vertical Steps */}
          <div className="lg:col-span-6 space-y-4">
            {workflow.steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  aria-expanded={isSelected}
                  className={`w-full text-left p-6 border-hairline transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-surface opacity-100'
                      : 'border-border bg-background opacity-40 hover:opacity-80'
                  }`}
                  style={{ borderRadius: '2px' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-primary">
                      {step.id}.
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>

                  <p className="font-sans text-xs text-muted leading-relaxed pl-7">
                    {step.description}
                  </p>

                  {/* 2px Scanline Progress Indicator for active step */}
                  {isSelected && (
                    <div className="mt-4 w-full h-[2px] bg-border overflow-hidden relative">
                      <div 
                        className="h-full bg-primary transition-all duration-[6000ms] ease-linear"
                        style={{ width: isPaused ? '100%' : '100%' }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Sticky Mock UI Preview */}
          <div className="lg:col-span-6 sticky top-24">
            <div aria-live="polite">
              <WorkflowPreview stepId={currentStep.id} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
