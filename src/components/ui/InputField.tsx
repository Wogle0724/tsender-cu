import React from 'react';

interface InputFieldProps {
    label: string;
    placeholder?: string;
    value: string;
    type?: string;
    large?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function InputField({
    label,
    placeholder,
    value,
    type = 'text',
    large = false,
    onChange,
}: InputFieldProps) {
    const baseClass = `
        w-full px-4 rounded-lg border border-gray-300 bg-white text-black
        focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent
        py-2
    `;

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            {large ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={6}
                    className={baseClass}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={baseClass}
                />
            )}
        </div>
    );
}