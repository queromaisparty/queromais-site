/**
 * Constantes de animação baseadas no ref02/animationSchemas.ts (Wix Pro Gallery)
 * Adaptado para CSS transitions e keyframes
 */

// Easing curves (CSS cubic-bezier equivalents dos EASING_MAP do ref02)
export const EASING = {
  // Suaves — para hover e transições gerais
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Entrada — para animações de reveal
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',

  // Linear
  linear: 'linear',
} as const;

// Durações padrão (em ms)
export const DURATION = {
  hover: 300,
  hoverScale: 500,
  reveal: 600,
  lightbox: 400,
  stagger: 80,
  fast: 150,
  slow: 800,
} as const;

// CSS transition strings prontas para uso
export const TRANSITION = {
  hover: `all ${DURATION.hover}ms ${EASING.easeOutCubic}`,
  hoverScale: `transform ${DURATION.hoverScale}ms ${EASING.easeOutQuart}`,
  reveal: `all ${DURATION.reveal}ms ${EASING.easeOutExpo}`,
  lightbox: `all ${DURATION.lightbox}ms ${EASING.easeInOutCubic}`,
  opacity: `opacity ${DURATION.reveal}ms ${EASING.easeOutCubic}`,
} as const;

// Keyframes CSS como strings (para inserir via style tag ou inline)
export const KEYFRAMES = {
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
} as const;

// Styles inline para componentes
export function getRevealStyle(isVisible: boolean, delay: number = 0): React.CSSProperties {
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity ${DURATION.reveal}ms ${EASING.easeOutExpo} ${delay}ms, transform ${DURATION.reveal}ms ${EASING.easeOutExpo} ${delay}ms`,
  };
}
