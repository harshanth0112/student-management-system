import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { HeroWireframeGraphic } from './HeroWireframeGraphic';
import { landingContent } from '../../data/landingContent';
import { ROUTES } from '../../constants/routes';
import { KeyRound, ArrowDown } from 'lucide-react';

export function Hero({ onOpenCredentialsModal }) {
  const { hero } = landingContent;

  const scrollToAccess = () => {
    const el = document.getElementById('request-access');
    if (el) {
      el.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 border-b border-hairline border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Prototype Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 border-hairline border-border bg-surface font-mono text-[10px] uppercase tracking-widest text-muted"
              style={{ borderRadius: '2px' }}
            >
              <span className="w-2 h-2 bg-primary" />
              <span>{hero.badge}</span>
            </div>

            {/* Space Grotesk 8xl Headline */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.92]">
              {hero.titleLine1} <br />
              <span className="text-primary font-bold">{hero.titleLine2}</span>
            </h1>

            {/* Subtext with Vertical 1px Line */}
            <div className="flex items-start gap-4 pl-4 border-l border-primary">
              <p className="font-mono text-xs sm:text-sm uppercase tracking-wider text-muted leading-relaxed max-w-xl">
                {hero.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="primary">
                    {hero.primaryCta}
                  </Button>
                </Link>
                <Button variant="outline" onClick={scrollToAccess}>
                  {hero.secondaryCta}
                </Button>
              </div>

              {/* Demo Credentials Modal Link */}
              <div>
                <button
                  type="button"
                  onClick={onOpenCredentialsModal}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-primary" />
                  <span className="border-b border-dotted border-muted hover:border-foreground">{hero.credentialsLabel}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Wireframe Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroWireframeGraphic />
          </div>
        </div>
      </Container>
    </section>
  );
}
