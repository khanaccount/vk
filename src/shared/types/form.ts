export interface FormField {
    name: string
    label: string
    type: "text" | "number" | "date" | "email"
    required?: boolean
    validation?: {
        pattern?: RegExp
        min?: number
        max?: number
        message?: string
    }
}

export type FormData = Record<string, string | number | Date>
