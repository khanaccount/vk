import { ThemeProvider } from "./providers/ThemeProvider"
import { QueryProvider } from "./providers/QueryProvider"
import { MainPage } from "@/pages/MainPage/ui/MainPage"

export const App = () => {
    return (
        <QueryProvider>
            <ThemeProvider>
                <MainPage />
            </ThemeProvider>
        </QueryProvider>
    )
}
