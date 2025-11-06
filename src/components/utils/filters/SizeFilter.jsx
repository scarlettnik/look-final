import React, {useState} from "react";
import {FullScreenModal} from "../FullScreenModal.jsx";
import styles from "../../ui/compilation.module.css";
import {SIZES} from "../../../constants.js";

export const SizeFilter = ({ applyFilter, currentValue, onClose }) => {
    const [selected, setSelected] = useState(currentValue || []);

    const toggleSize = (size) => {
        setSelected(prev =>
            prev.includes(size)
                ? prev.filter(v => v !== size)
                : [...prev, size]
        );
    };

    const handleApply = () => {
        const flattenedSizes = selected.flatMap(size => {
            if (size === 'NO SIZE') return ['NO SIZE'];
            if (size.includes('/')) {
                const [name, range] = size.split('/').map(s => s.trim());
                const [min, max] = range.split('-').map(s => s.trim());
                return [name, min.toString(), max.toString()];
            }
            return [size];
        });

        applyFilter(flattenedSizes);
        onClose();
    };

    return (
        <FullScreenModal
            title="Размер"
            onClose={onClose}
            onApply={handleApply}
            applyDisabled={!selected.length}
        >
            <div className={styles.gridOptions}>
                {SIZES.map(size => (
                    <button
                        key={size}
                        className={`${styles.optionButton} ${
                            selected.includes(size) ? styles.selected : ''
                        }`}
                        onClick={() => toggleSize(size)}
                    >
                        {size === 'NO SIZE' ? 'Один размер' : size}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};
