import React from "react";
import { useController, Control } from "react-hook-form";

interface FileInputProps {
    name: string;
    control: Control<any>;
}

const FileInput: React.FC<FileInputProps> = ({ name, control }) => {
    const {
        field: { onChange, onBlur, ref },
        fieldState: { error }
    } = useController({ name, control });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0]);
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleChange}
                onBlur={onBlur}
                ref={ref}
            />
            {error && <p>{error.message}</p>}
        </div>
    );
};

export default FileInput;
