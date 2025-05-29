import type { ReactNode } from "react"
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material"
import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react"

type ThemeContextType = {
    isDarkMode: boolean
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => {},
})

const THEME_STORAGE_KEY = "app-theme-mode"

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme !== null) {
            return savedTheme === "dark"
        }
        // If no saved theme, check system preference
        return window.matchMedia("(prefers-color-scheme: dark)").matches
    })

    const toggleTheme = useCallback(() => {
        setIsDarkMode((prev) => {
            const newValue = !prev
            localStorage.setItem(THEME_STORAGE_KEY, newValue ? "dark" : "light")
            return newValue
        })
    }, [])

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

        const handleChange = (e: MediaQueryListEvent) => {
            // Only update if user hasn't manually set a theme
            if (localStorage.getItem(THEME_STORAGE_KEY) === null) {
                setIsDarkMode(e.matches)
            }
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? "dark" : "light",
                    primary: {
                        main: "#1976d2",
                    },
                    secondary: {
                        main: "#dc004e",
                    },
                },
                components: {
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 12,
                                boxShadow: isDarkMode
                                    ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                                    : "0 4px 20px rgba(0, 0, 0, 0.1)",
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 8,
                                },
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                textTransform: "none",
                                fontWeight: 600,
                            },
                        },
                    },
                },
            }),
        [isDarkMode]
    )

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}
