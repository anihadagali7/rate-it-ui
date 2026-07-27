export const tokens = {
  colors: {
    background: "#E9F0EE",
    surface: "#FBFCFB",
    surfaceHover: "#F0F5F3",
    border: "#C9D6D1",
    borderStrong: "#9FB3AB",
    textPrimary: "#14181F",
    textSecondary: "#4A5853",
    textMuted: "#7A8C85",
    accent: "#0B6E6A",
    accentHover: "#085854",
    accentSubtle: "#D7EDEA",
    signal: "#FF5A3D",
    signalSoft: "#FFE8E2",
    ratingGold: "#E8A317",
    success: "#1F8A5B",
    danger: "#D64545",
  },
  gradients: {
    canvas: `
      radial-gradient(ellipse 90% 60% at 10% 0%, rgba(11, 110, 106, 0.16), transparent 55%),
      radial-gradient(ellipse 70% 50% at 95% 15%, rgba(255, 90, 61, 0.10), transparent 50%),
      linear-gradient(165deg, #E9F0EE 0%, #F3EFE8 48%, #E7EEF2 100%)
    `,
  },
  fonts: {
    display: '"Syne", "Avenir Next", sans-serif',
    body: '"Source Sans 3", "Segoe UI", sans-serif',
  },
  shadows: {
    soft: "0 10px 30px rgba(20, 24, 31, 0.06)",
    lift: "0 14px 36px rgba(20, 24, 31, 0.09)",
  },
  radius: {
    card: 14,
    button: 10,
    pill: 999,
  },
  motion: {
    quick: "160ms ease",
    calm: "280ms cubic-bezier(0.22, 1, 0.36, 1)",
  },
  layout: {
    feedMaxWidth: 640,
    mastheadHeight: 72,
    rightRailWidth: 280,
    authMaxWidth: 400,
    pageMaxWidth: 1120,
  },
};
