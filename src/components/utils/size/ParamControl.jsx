import styles from "../../ui/profile.module.css";
import React, { useState } from "react";

const ParamControl = ({ label, value, onChange, min = 0, max = 200 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());

    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };


    const handleValueClick = () => {
        setInputValue(value.toString());
        setIsEditing(true);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleInputConfirm = () => {
        let numericValue = parseInt(inputValue, 10);

        if (isNaN(numericValue)) {
            numericValue = value;
        } else {
            numericValue = Math.max(min, Math.min(max, numericValue));
        }

        if (numericValue !== value) {
            onChange(numericValue);
        }
        setIsEditing(false);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleInputConfirm();
        }
    };

    const renderValue = () => {
        if (isEditing) {
            return (
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onKeyDown={handleInputKeyDown}
                    className={styles.valueInput}
                    autoFocus
                    min={min}
                    max={max}
                />
            );
        } else {
            return (
                <span onClick={handleValueClick} style={{ cursor: 'pointer' }}>
                    {value}
                </span>
            );
        }
    }

    return (
        <div className={styles.paramControl}>
            <div className={styles.inputGroup}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                        className={styles.decrementButton}
                        onClick={handleDecrement}
                        disabled={value <= min}
                    >
                        -
                    </button>

                    <div className={styles.valueContainer}>
                        {renderValue()}
                        <label>{label}</label>
                    </div>

                    <button
                        className={styles.incrementButton}
                        onClick={handleIncrement}
                        disabled={value >= max}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParamControl;