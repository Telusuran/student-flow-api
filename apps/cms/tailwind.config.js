/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "neutral-bg": "#E6F0FA",
                "neutral-card": "#F5F5DC",
                "secondary-accent": "#8A9A8A",
                "accent-nav": "#8A9A8A",
                "cta": "#E6B325",
                "dynamic-cta": "#E6B325",
                "primary": "#E6B325",
                "primary-hover": "#d4a015",
                "error": "#FF6B6B",
                "dynamic-error": "#FF6B6B",
                "surface": "#FFFFFF",
                "text-main": "#2D3748",
                "text-muted": "#718096",
                "card-beige": "#F5F5DC",
                "surface-beige": "#F5F5DC",
                "cta-gold": "#E6B325",
                "background-light": "#E6F0FA",
                "background-dark": "#211d11",
                "card-bg": "#F5F5DC",
                "accent-sage": "#8A9A8A",
                "custom-beige": "#F5F5DC",
                "beige-card": "#F5F5DC",
                "alert": "#FF6B6B",
                "modal-bg": "#F5F5DC",
                "panel-light": "#F5F5DC",
                "custom-card": "#F5F5DC",
                "custom-back": "#8A9A8A",
                "custom-create": "#E6B325",
                "custom-gold": "#E6B325",
                "custom-red": "#FF6B6B",
                "text-sub": "#887e63",
                "fokus-dark": "#2E4A3D",
                "background-page": "#E6F0FA",
                "background-card": "#F5F5DC",
                "calendar-bg": "#F5F5DC",
                "app-bg": "#E6F0FA",
                "text-primary": "#181611",
                "text-secondary": "#887e63",
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"],
            },
            boxShadow: {
                "soft": "0 10px 40px -10px rgba(0,0,0,0.08)",
                "glow": "0 0 20px rgba(230, 179, 37, 0.3)",
                "card": "0 2px 10px rgba(0,0,0,0.03)",
                "digital": "0 10px 40px -10px rgba(0, 0, 0, 0.08)",
                "digital-lg": "0 10px 15px -3px rgba(138, 154, 138, 0.1), 0 4px 6px -2px rgba(138, 154, 138, 0.05)",
                "glow-cta": "0 0 15px rgba(230, 179, 37, 0.4)",
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
                    '50%': { transform: 'scale(1.2)', opacity: '1' },
                },
                rotateSun: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                breathe: 'breathe 4s ease-in-out infinite',
                'spin-slow': 'rotateSun 10s linear infinite',
                'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }
        },
    },
    plugins: [],
}
