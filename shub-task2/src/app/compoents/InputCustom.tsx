"use client";

import React, { useRef, forwardRef } from 'react';
import { IoMdCalendar } from 'react-icons/io';

interface CustomInputProps {
    label: string;
    type: string;
    id: string;
    refProp?: React.RefObject<HTMLInputElement>;
    datepicker?: boolean;
    onClickCalendar?: () => void;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({
    label,
    type,
    id,
    refProp,
    datepicker = false,
    onClickCalendar,
    value,
    onChange,
    ...rest
}, ref) => {
    const localRef = useRef<HTMLInputElement | null>(null);
    const inputRef = refProp || localRef;

    return (
        <div className="flex h-14 p-2 w-full items-center border border-gray-300 rounded-xl">
            <div className="flex-1 flex flex-col">
                <label htmlFor={id} className="text-gray-500 text-xs">
                    {label}
                </label>
                <input
                    type={type}
                    id={id}
                    className="text-sm pt-1 outline-none"
                    ref={(e) => {
                        if (typeof ref === 'function') {
                            ref(e);
                        } else if (ref) {
                            ref.current = e;
                        }
                        inputRef.current = e;
                    }}
                    value={value}
                    onChange={onChange}
                    {...rest}
                />
            </div>
            {datepicker && (
                <span
                    className="cursor-pointer text-2xl text-gray-600"
                    onClick={onClickCalendar}
                >
                    <IoMdCalendar />
                </span>
            )}
        </div>
    );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;