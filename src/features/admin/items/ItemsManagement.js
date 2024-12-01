import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import styles from '../Admin.module.css';
import Pagination from "@/components/pagination/Pagination";
import Preloader from "@/components/Preloader";

// Отдельные функции для API-запросов
const fetchItems = async (page = 1) => {
    const response = await axios.get(`${config.apiUrl}/admin/items?page=${page}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
};

const fetchCategories = async () => {
    const response = await axios.get(`${config.apiUrl}/categories`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
};

const createNewItem = async (newItem, selectedCategories) => {
    const response = await axios.post(
        `${config.apiUrl}/admin/items`,
        { ...newItem, categories: selectedCategories },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
    );
    return response.data;
};

const deleteItem = async (itemId) => {
    const response = await axios.delete(`${config.apiUrl}/admin/items/${itemId}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
};

const ItemsManagement = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '' });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Загрузка товаров и категорий
    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsData = await fetchItems(currentPage);
                setItems(itemsData.data || []);
                setTotalPages(itemsData.last_page || 1);

                const categoriesData = await fetchCategories();
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setItems([]);
                setTotalPages(1);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    // Обработчики ввода
    const handleInputChange = ({ target: { name, value } }) => {
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategorySelection = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
    };

    // Создание нового товара
    const handleCreateItem = async () => {
        try {
            const createdItem = await createNewItem(newItem, selectedCategories);
            setItems((prev) => [createdItem, ...prev]); // Добавляем новый элемент в начало списка
            setNewItem({ name: '', price: '', quantity: '' });
            setSelectedCategories([]);
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    // Удаление товара
    const handleDeleteItem = async (itemId) => {
        try {
            await deleteItem(itemId);
            setItems((prev) => prev.filter((item) => item.id !== itemId)); // Удаляем товар из списка
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setLoading(true);
        }
    };

    if (loading) return <Preloader />;

    return (
        <div className={styles.content}>
            <div className={styles.container}>
                <ItemsTable items={items} onDeleteItem={handleDeleteItem} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            <NewItemForm
                newItem={newItem}
                categories={categories}
                selectedCategories={selectedCategories}
                onInputChange={handleInputChange}
                onCategorySelection={handleCategorySelection}
                onCreateItem={handleCreateItem}
            />
        </div>
    );
};

// Компонент таблицы товаров
const ItemsTable = ({ items, onDeleteItem }) => (
    <div className={styles.container}>
        <h2>Список товаров</h2>
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Количество</th>
                    <th>Категории</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.price}₽</td>
                        <td>{item.quantity}</td>
                        <td>{item.categories?.map((cat) => cat.name).join(', ')}</td>
                        <td>
                            <button onClick={() => onDeleteItem(item.id)} className={styles.deleteButton}>Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

// Компонент формы добавления товара
const NewItemForm = ({ newItem, categories, selectedCategories, onInputChange, onCategorySelection, onCreateItem }) => (
    <div className={styles.container}>
        <h2>Добавить новый товар</h2>
        <div className={styles.gridContainer}>
            <div className={styles.inputBlock}>
                <div className={styles.itemContent}>
                    <label>Название товара</label>
                    <input
                        type="text"
                        name="name"
                        value={newItem.name}
                        onChange={onInputChange}
                        placeholder="Название товара"
                    />
                </div>
                <div className={styles.itemContent}>
                    <label>Цена</label>
                    <input
                        type="number"
                        name="price"
                        value={newItem.price}
                        min={0}
                        onChange={onInputChange}
                        placeholder="Цена"
                    />
                </div>
                <div className={styles.itemContent}>
                    <label>Количество</label>
                    <input
                        type="number"
                        name="quantity"
                        value={newItem.quantity}
                        min={0}
                        onChange={onInputChange}
                        placeholder="Количество"
                    />
                </div>
            </div>
            <div className={styles.itemContent}>
                <p>Выберите категории:</p>
                <div className={styles.newItemCategoryBlock}>

                    <div className={styles.newItemCategoryContent}>
                        {categories.map((category) => (
                            <label key={category.id} className={styles.categoryLabel}>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => onCategorySelection(category.id)}
                                />
                                {category.name}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <button onClick={onCreateItem} className="btn">
            Создать товар
        </button>
    </div>
);

export default ItemsManagement;
