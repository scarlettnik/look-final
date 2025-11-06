import React, {useState} from "react";
import {FullScreenModal} from "../FullScreenModal.jsx";
import filterStyles from "../../ui/filterList.module.css";
import CustomCheckbox from "../CustomCheckbox.jsx";
import store from "../../../store.js";

export const TypeFilter = ({ applyFilter, currentValue, onClose }) => {
    const [selected, setSelected] = useState(currentValue || []);

    const toggle = (val) => setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

    return (
        <FullScreenModal
            title="Тип"
            onClose={onClose}
            onApply={() => applyFilter(selected)}
            applyDisabled={!selected.length}
        >
            <div className={filterStyles.typeOptions}>
                {store?.help?.metaData?.categories.map((type, index) => (
                    <label key={type} className={filterStyles.checkboxLabel}>
                        <CustomCheckbox
                            className={filterStyles.checkbox}
                            id={`checkbox-${index}`}
                            checked={selected.includes(type)}
                            onChange={() => toggle(type)}
                        />
                        {type}
                    </label>
                ))}
            </div>
        </FullScreenModal>
    );
};
