import styles from "../../ui/profile.module.css";
import React from "react";
import {sizeRanges} from "../../../constants.js";

const SizeGrid = ({ params, updateParam, color = 'var(--white)' }) => {
    const handleChange = (value) => {
        updateParam("clothing_size", value);
    };

    return (
        <div className={styles.sizesGrid}>
            {Object.keys(sizeRanges).map(size => (
                <div
                    style={{backgroundColor: color}}
                    key={size}
                    className={`${styles.sizeBox} ${params?.clothing_size === size ? styles.selectedSize : styles.unSelectedSize}`}
                    onClick={() => handleChange(size)}
                >
                    {size}
                    <span className={styles.subText}>{sizeRanges[size]}</span>
                </div>
            ))}
        </div>
    );
};

export default SizeGrid;