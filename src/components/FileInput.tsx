import React from "react";
import { useController, Control } from "react-hook-form";

interface FileInputProps {
    name: string;
    control: Control<any>;
}

const FileInput: React.FC<FileInputProps> = ({ name, control }) => {
    const {
        field: { onChange, onBlur, ref, value },
        fieldState: { error }
    } = useController({ name, control });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onChange(Array.from(e.target.files));
        }
    };

    return (
        <div>
            <input
                type="file"
                multiple
                onChange={handleChange}
                onBlur={onBlur}
                ref={ref}
            />
            {error && <p>{error.message}</p>}
            {value && Array.isArray(value) && (
                <div>
                    {value.map((file: File, index: number) => (
                        <div key={index}>{file.name}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileInput;
