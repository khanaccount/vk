import { IconButton, Tooltip } from "@mui/material"
import { DarkMode, LightMode } from "@mui/icons-material"
import { useTheme } from "@/app/providers/ThemeProvider"

export const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme()

    return (
        <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton onClick={toggleTheme} color="inherit">
                {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
        </Tooltip>
    )
}
