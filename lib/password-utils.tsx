"use client"

import { Check, X } from "lucide-react"

export interface PasswordComplexity {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
    isValid: boolean
}

export function checkPasswordComplexity(password: string): PasswordComplexity {
    const minLength = 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
        minLength: password.length >= minLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecialChar,
        isValid: password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    }
}

interface PasswordRequirementProps {
    label: string
    isValid: boolean
}

export function PasswordRequirement({ label, isValid }: PasswordRequirementProps) {
    return (
        <div className="flex items-center text-xs space-x-1.5 transition-colors duration-200">
            {isValid ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <X className="h-4 w-4 text-red-500" />
            )}
            <span className={isValid ? "text-green-400" : "text-neutral-400"}>
                {label}
            </span>
        </div>
    )
}

export function PasswordRequirementsGrid({ complexity }: { complexity: PasswordComplexity }) {
    return (
        <div className="mt-3 grid grid-cols-2 gap-2">
            <PasswordRequirement label="8 characters minimum" isValid={complexity.minLength} />
            <PasswordRequirement label="One uppercase letter" isValid={complexity.hasUppercase} />
            <PasswordRequirement label="One lowercase letter" isValid={complexity.hasLowercase} />
            <PasswordRequirement label="One number" isValid={complexity.hasNumber} />
            <PasswordRequirement label="One special character" isValid={complexity.hasSpecialChar} />
        </div>
    )
}
