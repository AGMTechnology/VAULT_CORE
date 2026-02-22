/** @type {import("tailwindcss").Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "var(--ds-color-surface-0)",
        surface: "var(--ds-color-surface-1)",
        "surface-muted": "var(--ds-color-surface-2)",
        primary: "var(--ds-color-primary)",
        "primary-strong": "var(--ds-color-primary-strong)",
        success: "var(--ds-color-success)",
        warning: "var(--ds-color-warning)",
        error: "var(--ds-color-error)",
        info: "var(--ds-color-info)",
        text: {
          DEFAULT: "var(--ds-color-text-default)",
          muted: "var(--ds-color-text-muted)",
          soft: "var(--ds-color-text-soft)"
        },
        border: {
          DEFAULT: "var(--ds-color-border-default)",
          subtle: "var(--ds-color-border-subtle)",
          strong: "var(--ds-color-border-strong)"
        }
      },
      borderRadius: {
        sm: "var(--ds-radius-sm)",
        md: "var(--ds-radius-md)",
        lg: "var(--ds-radius-lg)",
        xl: "var(--ds-radius-xl)"
      },
      fontFamily: {
        sans: "var(--ds-font-sans)",
        mono: "var(--ds-font-mono)"
      },
      boxShadow: {
        sm: "var(--ds-shadow-sm)",
        md: "var(--ds-shadow-md)",
        lg: "var(--ds-shadow-lg)"
      }
    }
  }
};
