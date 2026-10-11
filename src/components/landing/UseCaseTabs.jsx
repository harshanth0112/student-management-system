import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { CornerMarkers } from '../ui/CornerMarkers';
import { landingContent } from '../../data/landingContent';
import { GraduationCap, Shield } from 'lucide-react';

export function UseCaseTabs() {
  const [activeTab, setActiveTab] = useState('teachers');
  const { roles } = landingContent;

  const currentRoleData = activeTab === 'teachers' ? roles.teachers : roles.students;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      setActiveTab((prev) => (prev === 'teachers' ? 'students' : 'teachers'));
    }
  };

  return (
    <section id="roles" className="py-20 border-b border-hairline border-border">
      <Container>
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {roles.sectionNumber} // {roles.sectionTitle}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Strict Role Segregation
          </h2>
        </div>

        {/* Rectangular Bordered Tab List */}
        <div 
          className="flex justify-center mb-8"
          role="tablist"
          aria-label="Target Role Perspectives"
          onKeyDown={handleKeyDown}
        >
          <div className="inline-flex border-hairline border-border bg-background p-1" style={{ borderRadius: '2px' }}>
            <button
              role="tab"
              id="tab-teachers"
              aria-controls="panel-teachers"
              aria-selected={activeTab === 'teachers'}
              onClick={() => setActiveTab('teachers')}
              className={`px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                activeTab === 'teachers'
                  ? 'bg-primary text-[var(--color-primary-text)] font-bold'
                  : 'text-muted hover:text-foreground'
              }`}
              style={{ borderRadius: '2px' }}
            >
              FOR TEACHERS
            </button>

            <button
              role="tab"
              id="tab-students"
              aria-controls="panel-students"
              aria-selected={activeTab === 'students'}
              onClick={() => setActiveTab('students')}
              className={`px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                activeTab === 'students'
                  ? 'bg-primary text-[var(--color-primary-text)] font-bold'
                  : 'text-muted hover:text-foreground'
              }`}
              style={{ borderRadius: '2px' }}
            >
              FOR STUDENTS
            </button>
          </div>
        </div>

        {/* Tab Panel Card with 240px Ghost Icon Background */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="relative border-hairline border-border bg-surface p-8 sm:p-14 overflow-hidden"
          style={{ borderRadius: '2px' }}
        >
          <CornerMarkers size={12} strokeWidth={2} />

          {/* 240px Ghost Icon in Background at 5% opacity */}
          <div 
            className="absolute -right-8 -bottom-8 pointer-events-none opacity-[0.05] select-none"
            aria-hidden="true"
          >
            {activeTab === 'teachers' ? (
              <Shield className="w-64 h-64 text-foreground stroke-[1]" />
            ) : (
              <GraduationCap className="w-64 h-64 text-foreground stroke-[1]" />
            )}
          </div>

          <div className="relative z-10 space-y-8">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {currentRoleData.title}
              </h3>
              <p className="font-sans text-sm text-muted mt-1">
                {currentRoleData.subtitle}
              </p>
            </div>

            {/* 3-Column Benefit Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
              {currentRoleData.benefits.map((benefit, i) => (
                <div key={i} className="space-y-2">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary" />
                    <span>{benefit.title}</span>
                  </div>
                  <p className="font-sans text-xs text-muted leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
