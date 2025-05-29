import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"
import { jest } from "@jest/globals"

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder

// Mock IntersectionObserver
class MockIntersectionObserver {
    observe = jest.fn()
    disconnect = jest.fn()
    unobserve = jest.fn()
}

Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
})

// Mock clipboard API
Object.defineProperty(navigator, "clipboard", {
    writable: true,
    value: {
        writeText: jest.fn(),
    },
})
