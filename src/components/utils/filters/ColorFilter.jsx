import React, {useState} from "react";
import {FullScreenModal} from "../FullScreenModal.jsx";
import styles from "../../ui/compilation.module.css";
import {COLORS} from "../../../constants.js";

//не знаю почему его в итоге не окаалось в дизайне, решила добоавить

const ColorFilter = ({ applyFilter, currentValue, onClose }) => {
    const [selected, setSelected] = useState(currentValue || []);

    const toggle = (val) => setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

    return (
        <FullScreenModal
            title="Цвет"
            onClose={onClose}
            onApply={() => applyFilter(selected)}
            applyDisabled={!selected.length}
        >
            <div className={styles.gridOptions}>
                {COLORS.map((color, i) => (
                    <button
                        key={i}
                        className={`${styles.optionButton} ${selected.includes(color) ? styles.selected : ''}`}
                        onClick={() => toggle(color)}
                    >
                        {color}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};
