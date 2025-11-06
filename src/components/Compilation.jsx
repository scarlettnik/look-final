import React, {useEffect, useMemo, useState} from 'react';
import {Link, useParams, useNavigate, useLocation} from 'react-router-dom';
import styles from './ui/compilation.module.css';
import Sidebar from './Sidebar';
import Modal from './utils/Modal.jsx'
import { observer } from "mobx-react-lite";
import { useStore } from '../provider/StoreContext';
import Share from "./utils/Share.jsx";
import AddList from "./AddList.jsx";
import CustomSkeleton from "./utils/CustomSkeleton.jsx";
import {FilterBar} from "./FilterBar.jsx";
import FullScreenButton from "./utils/FullScrinButton.jsx";
import {AUTH_TOKEN, HOST_URL} from "../constants.js";
import ButtonWrapper from "./utils/ButtonWrapper.jsx";
import CustomCheckbox from "./utils/CustomCheckbox.jsx";

const Compilation = observer(() => {
    const { id } = useParams();
    const location = useLocation();
    const { collectionStore } = useStore();
    const [isSave, setIsSave] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [filters, setFilters] = useState({
        size: [],
        brand: [],
        price: { min: null, max: null },
        type: [],
        color: []
    });

    useEffect(() => {
        const isSaveCollection = location.pathname.includes('/save/');
        setIsSave(isSaveCollection);
        collectionStore.loadCollection(id, isSaveCollection);
    }, [id, location.pathname, collectionStore]);

    const { currentCollection: save, loading, error } = collectionStore;

    const applyFilters = (updatedFilters) => {
        console.log("Filters applied:", updatedFilters);
    };

    const filteredProducts = useMemo(() => {
        if (!save?.products) return [];

        return save.products.filter(product => {
            if (filters.size.length > 0) {
                const productSizes = product.sizes || [];
                const hasSizeMatch = productSizes.some(productSize => {
                    if (Array.isArray(productSize)) {
                        const [sizeName, sizeMin, sizeMax] = productSize;
                        return (
                            filters.size.includes(sizeName) ||
                            filters.size.includes(sizeMin) ||
                            filters.size.includes(sizeMax)
                        );
                    }
                    return filters.size.includes(productSize);
                });

                if (!hasSizeMatch) return false;
            }
            if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
                return false;
            }
            const productPrice = product.discount_price || product.price;
            if (filters.price.min !== null && productPrice < filters.price.min) {
                return false;
            }
            if (filters.price.max !== null && productPrice > filters.price.max) {
                return false;
            }
            if (filters.color.length > 0 && !filters.color.includes(product.color_name)) {
                return false;
            }
            if (filters.type.length > 0 && !filters.type.includes(product.type)) {
                return false;
            }

            return true;
        });
    }, [save?.products, filters]);

    const handleDeleteItems = async (productIds) => {
        try {
            await collectionStore.removeProductsFromCollection(id, productIds);
        } catch (error) {
            console.error('Ошибка удаления товаров:', error);
        }
    };

    console.log(error)
    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorIcon}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#666" strokeWidth="2"/>
                                <path d="M15 9L9 15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M9 9L15 15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>

                        <h1 className={styles.errorTitle}>Ничего не найдено</h1>

                        <p className={styles.errorDescription}>
                            К сожалению, мы не смогли найти то, что вы искали.
                            Возможно, страница была удалена или перемещена.
                        </p>

                    </div>
                </div>
                <Sidebar />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.scrollContent}>
                <Banner
                    id={id}
                    save={save}
                    isSave={isSave}
                    loading={loading}
                    onEnterEditMode={() => setIsEditMode(true)}
                />
                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    products={save?.products || []}
                    onFilter={applyFilters}
                />

                <ItemGrid
                    items={filteredProducts}
                    loading={loading}
                    isEditMode={isEditMode}
                    onDeleteItems={handleDeleteItems}
                    onCancelEdit={() => setIsEditMode(false)}
                />
            </div>
            <Sidebar />
        </div>
    );
});

export default Compilation;


export const Banner = observer(({ save, isSave = false, loading, id, onEnterEditMode }) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const store = useStore();

    const handleCloseShare = () => setIsShareOpen(false);

    const handleCreateCollection = (name, coverUrl) => {
        store.createCollection(name, coverUrl);
        setIsModalOpen(false);
    };

    const handleUpdateCollection = async (name, coverUrl) => {
        if (editingCollection) {
            try {
                const response = await fetch(`${HOST_URL}/v1/collection/${editingCollection.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `tma ${AUTH_TOKEN}`
                    },
                    body: JSON.stringify({
                        "name": name,
                        "cover_image_url": coverUrl
                    })
                });

                if (!response.ok) {
                    throw new Error('Ошибка при обновлении коллекции на сервере');
                }

                store.collectionStore.updateCollectionLocal(editingCollection.id, {
                    name,
                    cover_image_url: coverUrl
                });

                setIsModalOpen(false);
                setEditingCollection(null);

            } catch (error) {
                console.error('Ошибка при обновлении коллекции:', error);
            }
        }
    };
    const handleEditCollection = () => {
        setEditingCollection(save);
        setIsEditMode(true);
    };

    const handleEditProducts = () => {
        onEnterEditMode?.();
        setIsEditMode(false);
    };
    const handleCancelEdit = () => {
        setIsEditMode(false);
    };

    if (loading) {
        return (
            <div className={styles.bannerContainer}>
                <div className={styles.banner}>
                    <CustomSkeleton className={styles.bannerImage} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.bannerContainer}>
            <div className={styles.banner}>
                <img
                    src={save?.cover_image_url || '/placeholder-banner.jpg'}
                    alt={save?.name}
                    className={styles.bannerImage}
                    onError={(e) => {
                        e.target.src = '/placeholder-banner.jpg';
                    }}
                />
                <div className={styles.bannerText}>{save?.name === '__FAVOURITES__' ? 'Лайки' : save?.name}</div>

                <button onClick={() => setIsShareOpen(true)}>
                    <img className={styles.shareIcon} src='/subicons/share.svg' alt="Поделиться"/>
                </button>

                {isSave && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditCollection();
                        }}
                    >
                        <img className={styles.editIcon} src='/subicons/edit.svg' alt="Редактировать"/>
                    </button>
                )}

                {isEditMode && (
                    <div className={styles.editOverlay}>
                        <FullScreenButton
                            color='var(--white)'
                            textColor='var(--black'
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsEditMode(false);
                            }}
                        >
                            Переименовать
                        </FullScreenButton>
                        <FullScreenButton
                            color='var(--white)'
                            textColor='var(--black'
                            onClick={handleEditProducts}
                        >
                            Удалить товары из подборки
                        </FullScreenButton>
                        <FullScreenButton
                            onClick={handleCancelEdit}
                        >
                            Отменить
                        </FullScreenButton>
                    </div>
                )}

                <Modal isOpen={isShareOpen} onClose={handleCloseShare}>
                    <Share id={id}/>
                </Modal>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <AddList
                        onCreate={handleCreateCollection}
                        onUpdate={handleUpdateCollection}
                        collection={editingCollection}
                        coverImage={save?.cover_image_url}
                    />
                </Modal>
            </div>
        </div>
    );
});

const ItemGrid = observer(({ items, loading, isEditMode, onDeleteItems, onCancelEdit }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (!isEditMode) {
            setSelectedItems([]);
        }
    }, [isEditMode]);

    const toggleItemSelection = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleDelete = async () => {
        if (selectedItems.length === 0) return;
        await onDeleteItems(selectedItems);
        setSelectedItems([]);
        onCancelEdit();
    };

    if (loading) {
        return (
            <div className={styles.itemsGrid}>
                {[...Array(8)].map((_, i) => (
                    <CustomSkeleton
                        key={i}
                        className={styles.itemImage}
                        style={{ height: '200px' }}
                    />
                ))}
            </div>
        );
    }

    if (!loading && (!items || items.length === 0)) {
        return (
            <div style={{width:'92vw', margin: '2vw', backgroundColor: 'var(--beige)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2vw', borderRadius: '8px'}}>
                <p style={{fontSize: '16px'}}>
                    Нет доступных товаров
                </p>
            </div>
        );
    }

    return (
        <div className={styles.itemsGrid}>
            {isEditMode && (
                <ButtonWrapper>
                    <FullScreenButton
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={selectedItems.length === 0}
                    >
                        Удалить выбранные
                    </FullScreenButton>
                    <FullScreenButton
                        className={styles.cancelButton}
                        onClick={onCancelEdit}
                    >
                        Отменить
                    </FullScreenButton>
                </ButtonWrapper>
            )}

            {items?.map(item => (
                <div key={item?.id} className={styles.itemContainer}>
                    {isEditMode && (
                        <div
                            className={styles.checkboxContainer}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleItemSelection(item.id);
                            }}
                        >
                            <CustomCheckbox
                                id={`item-${item.id}`}
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItemSelection(item.id)}
                                className={styles.itemCheckbox}
                            />

                        </div>
                    )}
                    <Link to={`product/${item?.id}`} className={styles.itemLink}>
                        <img
                            src={item?.image_urls?.[0]}
                            alt={item.name}
                            className={styles.itemImage}
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                            }}
                        />
                    </Link>
                </div>
            ))}
        </div>
    );
});
