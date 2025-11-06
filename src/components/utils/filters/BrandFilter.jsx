import React, {useState} from "react";
import {FullScreenModal} from "../FullScreenModal.jsx";
import styles from "../../ui/compilation.module.css";
import {useStore} from "../../../provider/StoreContext.jsx";
import {observer} from "mobx-react";

export const BrandFilter = observer(({ applyFilter, currentValue, onClose }) => {
    const [selected, setSelected] = useState(currentValue || []);
    const store = useStore();
    console.log("store", store);
    const toggle = (val) => setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

    return (
        <FullScreenModal
            title="Бренд"
            onClose={onClose}
            onApply={() => applyFilter(selected)}
            applyDisabled={!selected.length}
        >
            <div className={styles.gridOptions}>
                {store?.help?.metaData?.brands?.map((brand, i) => (
                    <button
                        key={i}
                        className={`${styles.optionButton} ${selected.includes(brand) ? styles.selected : ''}`}
                        onClick={() => toggle(brand)}
                    >
                        {brand}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
});
