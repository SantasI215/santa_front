import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import styles from '../Admin.module.css';
import Pagination from '@/components/pagination/Pagination';
import Preloader from '@/components/Preloader';
import Image from "next/image";
import Edit from "@/assets/img/Edit.svg";
import Delete from "@/assets/img/Delete.svg";

// API-запросы
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
    const [editItem, setEditItem] = useState(null);
    const formRef = useRef(null);

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsData = await fetchItems(currentPage);
                setItems(itemsData.data || []);
                setTotalPages(itemsData.last_page || 1);

                const categoriesData = await fetchCategories();
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    // Обработчики событий
    const handleEditItem = (item) => {
        setEditItem(item);
        setNewItem({ name: item.name, price: item.price, quantity: item.quantity });
        setSelectedCategories(item.categories.map(cat => cat.id));

        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleUpdateItem = async () => {
        // Проверяем, что все обязательные поля заполнены
        if (!newItem.name.trim() || !newItem.price || !newItem.quantity) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const updatedItem = await axios.put(
                `${config.apiUrl}/admin/items/${editItem.id}`,
                { ...newItem, categories: selectedCategories },
                { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
            );
            setItems((prev) => prev.map((item) => (item.id === updatedItem.data.id ? updatedItem.data : item)));
            resetForm();
        } catch (error) {
            console.error('Ошибка при обновлении товара:', error);
        }
    };

    const handleInputChange = ({ target: { name, value } }) => {
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategorySelection = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
    };

    const handleCreateItem = async () => {
        // Проверяем, что все обязательные поля заполнены
        if (!newItem.name.trim() || !newItem.price || !newItem.quantity) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const createdItem = await createNewItem(newItem, selectedCategories);
            setItems((prev) => [createdItem, ...prev]);
            resetForm();
        } catch (error) {
            console.error('Ошибка при создании товара:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await deleteItem(itemId);
            setItems((prev) => prev.filter((item) => item.id !== itemId));
            alert("Успех");
        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setLoading(true);
        }
    };

    const resetForm = () => {
        setEditItem(null);
        setNewItem({ name: '', price: '', quantity: '' });
        setSelectedCategories([]);
    };

    if (loading) return <Preloader />;

    return (
        <div className={styles.content}>
            <div className={styles.container}>
                <ItemsTable items={items} onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
            {/* Привязываем реф к блоку формы */}
            <div ref={formRef}>
                <NewItemForm
                    newItem={newItem}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onInputChange={handleInputChange}
                    onCategorySelection={handleCategorySelection}
                    onCreateItem={editItem ? handleUpdateItem : handleCreateItem}
                    editMode={!!editItem}
                />
            </div>
        </div>
    );
};

const ItemsTable = ({ items, onEditItem, onDeleteItem }) => (
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
                            <td className={styles.buttonSection}>
                                <button
                                    onClick={() => onEditItem(item)}
                                    className={`${styles.button} ${styles.editButton}`}
                                >
                                    <Image src={Edit} alt="" />
                                </button>
                                <button
                                    onClick={() => onDeleteItem(item.id)}
                                    className={`${styles.button} ${styles.deleteButton}`}
                                >
                                    <Image src={Delete} alt="" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const NewItemForm = ({
    newItem,
    categories,
    selectedCategories,
    onInputChange,
    onCategorySelection,
    onCreateItem,
    editMode
}) => (
    <div className={styles.container}>
        <h2>{editMode ? 'Редактировать товар' : 'Добавить новый товар'}</h2>
        <div className={styles.gridContainer}>
            <div className={styles.inputBlock}>
                <label>Название товара</label>
                <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={onInputChange}
                    placeholder="Название товара"
                />
                <label>Цена</label>
                <input
                    type="number"
                    name="price"
                    value={newItem.price}
                    min={0}
                    onChange={onInputChange}
                    placeholder="Цена"
                />
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
            <div>
                <p>Выберите категории:</p>
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
        <button onClick={onCreateItem} className="btn">
            {editMode ? 'Сохранить изменения' : 'Создать товар'}
        </button>
    </div>
);

export default ItemsManagement;
