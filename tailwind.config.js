module.exports = {
  purge: { enabled: process.env.environment === "production", content: ["**/*.tsx", "src/**/*.tsx"] },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        display: ["bely"],
        body: ["hero-new"],
      },
      minWidth: {
        0: "0",
        sm: "12rem",
        md: "24rem",
        lg: "36rem",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%",
        400: "400px",
      },
      width: {
        "1/2": ".125rem",
      },
      backgroundColor: {
        "accent-0": "var(--accent-0)",
        "accent-1": "var(--accent-1)",
        "accent-2": "var(--accent-2)",
        "accent-3": "var(--accent-3)",
        "accent-4": "var(--accent-4)",
        primary: "var(--color-bg-primary)",
        body: "var(--color-bg-body)",
        accent: "var(--color-bg-accent)",
        "accent-inverted": "var(--color-text-accent)",
        secondary: "var(--color-bg-secondary)",
      },
      ringColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        accent: "var(--color-text-accent)",
        "accent-inverted": "var(--color-bg-accent)",
      },
      borderColor: {
        accent: "var(--color-text-accent)",
        "accent-inverted": "var(--color-bg-accent)",
        themed: "var(--border)",
      },
      textColor: {
        accent: "var(--color-text-accent)",
        "accent-0": "var(--accent-0)",
        "accent-1": "var(--accent-1)",
        "accent-2": "var(--accent-2)",
        "accent-3": "var(--accent-3)",
        "accent-4": "var(--accent-4)",
        "accent-inverted": "var(--color-bg-accent)",
        primary: "var(--color-text-primary)",
        disabled: "var(--color-text-disabled)",
        placeholder: "var(--color-text-placeholder)",
        secondary: "var(--color-text-secondary)",
      },
      spacing: {
        "sait-2": "max(env(safe-area-inset-top), 0.5rem)",
        "sair-2": "max(env(safe-area-inset-right), 0.5rem)",
        "saib-2": "max(env(safe-area-inset-bottom), 0.5rem)",
        "sail-2": "max(env(safe-area-inset-left), 0.5rem)",
        "sait-4": "max(env(safe-area-inset-top), 1rem)",
        "sair-4": "max(env(safe-area-inset-right), 1rem)",
        "saib-4": "max(env(safe-area-inset-bottom), 1rem)",
        "sail-4": "max(env(safe-area-inset-left), 1rem)",
        xl: "36rem",
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
