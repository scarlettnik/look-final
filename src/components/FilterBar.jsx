import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../provider/StoreContext";
import { SIZES } from "../constants";
import styles from "./ui/compilation.module.css";
import filterStyles from "./ui/filterList.module.css";
import {PriceFilter} from "./utils/filters/PriceFilter.jsx";
import {TypeFilter} from "./utils/filters/TypeFilter.jsx";
import {useNavigate} from "react-router-dom";
import {BrandFilter} from "./utils/filters/BrandFilter.jsx";
import {SizeFilter} from "./utils/filters/SizeFilter.jsx";
import {FiltersModal} from "./utils/FiltersModal.jsx";
import CustomCheckbox from "./utils/CustomCheckbox.jsx";


const AllFiltersModal = observer(({
                             filters,
                             applyAllFilters,
                             onClose
                         }) => {
    const [localFilters, setLocalFilters] = useState({
        size: [...(filters.size || [])],
        brand: [...(filters.brand || [])],
        price: { ...(filters.price || {}) },
        type: [...(filters.type || [])],
        color: [...(filters.color || [])]
    });
    const store = useStore();
    const handleFilterChange = (filterName, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [filterName]: Array.isArray(prev[filterName])
                ? prev[filterName].includes(value)
                    ? prev[filterName].filter(v => v !== value)
                    : [...prev[filterName], value]
                : value
        }));
    };

    const handlePriceChange = (min, max) => {
        setLocalFilters(prev => ({
            ...prev,
            price: { min, max }
        }));
    };

    const handleApply = () => {
        const processedFilters = {
            ...localFilters,
            size: (localFilters.size || []).flatMap(size => {
                if (size === 'NO SIZE') return ['NO SIZE'];
                if (size.includes('/')) {
                    const parts = size.split('/');
                    const name = parts[0].trim();
                    if (parts.length > 1) {
                        const rangeParts = parts[1].split('-');
                        const min = rangeParts[0]?.trim() || '';
                        const max = rangeParts[1]?.trim() || '';
                        return [name, min, max].filter(Boolean);
                    }
                    return [name];
                }
                return [size];
            })
        };

        applyAllFilters(processedFilters);
        onClose()
    };

    const [showAll, setShowAll] = useState(false);
    const types = store?.help?.metaData?.categories;
    const displayedTypes = showAll ? types : types.slice(0, 4);

    const [selectedQuick, setSelectedQuick] = useState(null);

    const quickOptions = [1500, 3000, 5000, 10000];

    const selectQuickMax = (value) => {
        setSelectedQuick(value);
        handlePriceChange(null, value);
    };

    return (
        <FiltersModal
            title="Фильтры"
            onClose={onClose}
            onApply={handleApply}
        >
            <div className={filterStyles.section}>
                <div className={filterStyles.sectionHeader}>
                    <div className={filterStyles.genderLabels}>
                        <span className={filterStyles.sectionTitle} style={{color: 'var(--dark-warm-gray'}}>Женское</span>
                        <span className={filterStyles.sectionTitle} style={{color: 'var(--light-warm-gray'}}>Мужское</span>
                    </div>
                    <button
                        className={filterStyles.showAllButton}
                        onClick={() => setShowAll(prev => !prev)}
                    >
                        {showAll ? 'Скрыть' : 'Смотреть все'}
                    </button>
                </div>
                <div className={filterStyles.typeOptions}>
                    {displayedTypes.map((type, index) => (
                        <label key={type} className={filterStyles.checkboxLabel}>
                            <CustomCheckbox
                                className={filterStyles.checkbox}
                                id={`checkbox-${index}`}
                                checked={localFilters.type.includes(type)}
                                onChange={() => handleFilterChange('type', type)}
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            <div className={filterStyles.section}>
                <p className={filterStyles.sectionTitle}>Стоимость</p>
                <div className={filterStyles.priceInputGroup}>
                    <div className={filterStyles.priceInput}>
                    <input
                        type="number"
                        placeholder="от"
                        value={localFilters.price.min || ''}
                        onChange={(e) => handlePriceChange(
                            e.target.value ? parseInt(e.target.value) : null,
                            localFilters.price.max
                        )}
                    />
                    </div>
                    <span style={{width: '4vw', height: '1px', backgroundColor: 'var(--black'}}></span>
                    <div className={filterStyles.priceInput}>
                    <input
                        type="number"
                        placeholder="до"
                        value={localFilters.price.max || ''}
                        onChange={(e) => handlePriceChange(
                            localFilters.price.min,
                            e.target.value ? parseInt(e.target.value) : null
                        )}
                    />
                    </div>
                </div>
                <div className={filterStyles.gridOptions}>
                    {quickOptions.map((option) => (
                        <button
                            key={option}
                            className={`${filterStyles.optionButton} ${(selectedQuick === localFilters.price.max) && selectedQuick === option ? filterStyles.selected : ''}`}
                            onClick={() => selectQuickMax(option)}
                        >
                            до {option.toLocaleString('ru-RU')} ₽
                        </button>
                    ))}
                </div>
            </div>

            <div className={filterStyles.section}>
                <h3 className={filterStyles.sectionTitle}>Бренд</h3>
                <div className={filterStyles.flexOptions}>
                    {store?.help?.metaData?.brands.map(brand => (
                        <button
                            key={brand}
                            className={`${filterStyles.optionButton} ${
                                localFilters.brand.includes(brand) ? filterStyles.selected : ''
                            }`}
                            onClick={() => handleFilterChange('brand', brand)}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            <div className={filterStyles.section}>
                <p className={filterStyles.sectionTitle}>Размер</p>
                <div className={filterStyles.gridOptions}>
                    {SIZES.map(size => (
                        <button
                            key={size}
                            className={`${filterStyles.optionButton} ${
                                localFilters.size.includes(size) ? filterStyles.selected : ''
                            }`}
                            onClick={() => handleFilterChange('size', size)}
                        >
                            {size === 'NO SIZE' ? 'Один размер' : size}
                        </button>
                    ))}
                </div>
            </div>


            <div className={filterStyles.section}>
                <p className={filterStyles.sectionTitle}>
                    Цвет
                    {localFilters.color.length > 0 && (
                        <span
                              className={filterStyles.colorTitle}
                              style={{marginLeft: '10px'}}>
                              {localFilters.color.slice(0, 2).join(', ')}
                              {localFilters.color.length > 2 && ` и еще ${localFilters.color.length - 2}`}
                        </span>
                    )}
                </p>


                <div className={filterStyles.gridOptions}>
                    {Object.keys(store?.help?.metaData.colors || {}).map(color => (
                        <button
                            key={color}
                            style={{backgroundColor: "transparent"}}
                            onClick={() => handleFilterChange('color', color)}
                        >
                            <span
                                className={`${filterStyles.colorCircle} ${
                                    localFilters.color.includes(color) ? filterStyles.selected : ''
                                }`}
                                style={{
                                    backgroundColor: store.help.metaData.colors[color],
                                }}
                            ></span>
                        </button>
                    ))}
                </div>

            </div>

        </FiltersModal>
    );
});


export const FilterBar = observer(({
                                       filters,
                                       setFilters,
                                       catalogStore,
                                       onFilter,
                                       onUndo,
                                       undoHighlight
                                   }) => {
    const [activeFilter, setActiveFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);

    const navigate = useNavigate();
    const handleBack = () => navigate(-1);

    const convertToApiFilters = (localFilters) => ({
        sizes: localFilters.size || [],
        brands: localFilters.brand || [],
        categories: localFilters.type || [],
        colors: localFilters.color || [],
        min_price: localFilters.price?.min || null,
        max_price: localFilters.price?.max || null
    });

    const handleApplyFilters = (updatedFilters) => {
        if (catalogStore) {
            const apiFilters = convertToApiFilters(updatedFilters);
            catalogStore.applyFilters(apiFilters);
        } else if (onFilter) {
            onFilter(updatedFilters);
        }
    };

    const openFilter = (filterName) => {
        setActiveFilter(filterName);
        setIsModalOpen(true);
    };

    const openAllFilters = () => {
        setIsAllFiltersOpen(true);
    };

    const closeFilter = () => {
        setIsModalOpen(false);
        setActiveFilter(null);
    };

    const closeAllFilters = () => {
        setIsAllFiltersOpen(false);
    };

    const applyFilter = (value) => {
        if (activeFilter) {
            const updatedFilters = {...filters};

            if (activeFilter === 'price') {
                updatedFilters.price = value;
            } else {
                updatedFilters[activeFilter] = Array.isArray(value) ? value : [value];
            }

            setFilters(updatedFilters);
            handleApplyFilters(updatedFilters);
            closeFilter();
        }
    };

    const applyAllFilters = (newFilters) => {
        setFilters(newFilters);
        handleApplyFilters(newFilters);
    };

    const clearFilter = (filterName, e) => {
        e.stopPropagation();

        const updatedFilters = { ...filters };

        if (filterName === 'price') {
            updatedFilters.price = { min: null, max: null };
        } else {
            updatedFilters[filterName] = [];
        }

        setFilters(updatedFilters);
        handleApplyFilters(updatedFilters);
    };

    const isFilterActive = (filterName) => {
        if (filterName === 'price') {
            return filters.price?.min != null || filters.price?.max != null;
        }
        return filters[filterName]?.length > 0;
    };

    const renderFilterModal = () => {
        switch (activeFilter) {
            case 'size':
                return <SizeFilter applyFilter={applyFilter} currentValue={filters.size} onClose={closeFilter} />;
            case 'brand':
                return <BrandFilter applyFilter={applyFilter} currentValue={filters.brand} onClose={closeFilter} />;
            case 'price':
                return <PriceFilter applyFilter={applyFilter} currentValue={filters.price} onClose={closeFilter} />;
            case 'type':
                return <TypeFilter applyFilter={applyFilter} currentValue={filters.type} onClose={closeFilter} />;
            default:
                return null;
        }
    };

    const isCardsPage = location.pathname.includes('cards');
    const hasActiveFilters = () => {
        return (
            filters.size.length > 0 ||
            filters.brand.length > 0 ||
            filters.type.length > 0 ||
            filters.color?.length > 0 ||
            filters.price?.min !== null ||
            filters.price?.max !== null
        );
    };
    return (
        <div className={styles.headerContainer}>
            {isCardsPage ? (
                <button onClick={onUndo} style={undoHighlight ? { zIndex: 100000 } : {}}
                        className={`${styles.filterButton} ${undoHighlight ? styles.highlightedButton : ''}`}>
                    <img src={undoHighlight ? '/subicons/arrowleftwhite.svg' : '/subicons/arrowleft.svg'}
                         alt="Назад"/>
                </button>
            ) : (
                <button onClick={handleBack} className={styles.filterButton}>
                    <img src='/subicons/arrowleft.svg' alt="Назад"/>
                </button>
            )}
            <div className={styles.filterBar}>
                <button className={styles.filterButton} onClick={openAllFilters}>
                    <img src={hasActiveFilters() ? '/subicons/activefilter.svg' : '/subicons/filter.svg'} alt="Назад"/>
                </button>

                {[
                    {key: 'type', label: 'Тип'},
                    {key: 'size', label: 'Размер'},
                    {key: 'brand', label: 'Бренд'},
                    {key: 'price', label: 'Цена'}
                ].map(({key, label}) => {
                    const active = isFilterActive(key);
                    return (
                        <button
                            key={key}
                            className={`${styles.filterButton} ${active ? styles.activeFilter : ''}`}
                            onClick={() => openFilter(key)}
                        >
                            {label}
                            {active && (
                                <span
                                    className={styles.clearFilter}
                                    onClick={(e) => clearFilter(key, e)}
                                >
                                    <img src='/subicons/close.svg' alt="Очистить"/>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {isModalOpen && renderFilterModal()}
            {isAllFiltersOpen && (
                <AllFiltersModal
                    filters={filters}
                    applyAllFilters={applyAllFilters}
                    onClose={closeAllFilters}
                />
            )}
        </div>
    );
});