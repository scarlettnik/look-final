import React, {useState} from "react";
import styles from "../../ui/compilation.module.css";
import {FullScreenModal} from "../FullScreenModal.jsx";

export const PriceFilter = ({ applyFilter, currentValue, onClose }) => {
    const [min, setMin] = useState(currentValue?.min || '');
    const [max, setMax] = useState(currentValue?.max || '');

    const quickOptions = [3000, 5000, 10000];
    const selectedQuick = quickOptions.find((val) => !min && parseInt(max) === val);

    const apply = () => {
        applyFilter({
            min: min ? parseInt(min) : null,
            max: max ? parseInt(max) : null,
        });
    };

    const selectQuickMax = (value) => {
        setMin('');
        setMax(value.toString());
    };

    return (
        <FullScreenModal
            title="Стоимость"
            onClose={onClose}
            onApply={apply}
            applyDisabled={!min && !max}
        >
            <div className={styles.priceInputGroup}>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.priceInput}
                        type="number"
                        placeholder="от"
                        value={min}
                        onChange={(e) => setMin(e.target.value)}
                    />
                </div>

                <span>-</span>

                <div className={styles.inputWrapper}>
                    <input
                        className={styles.priceInput}
                        type="number"
                        placeholder="до"
                        value={max}
                        onChange={(e) => setMax(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.gridOptions}>
                {quickOptions.map((option) => (
                    <button
                        key={option}
                        className={`${styles.optionButton} ${selectedQuick === option ? styles.selected : ''}`}
                        onClick={() => selectQuickMax(option)}
                    >
                        до {option.toLocaleString('ru-RU')} ₽
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};
