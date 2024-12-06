import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import styles from '../Admin.module.css';

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [editCategory, setEditCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/categories`, {
                    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
                });
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryInputChange = (e) => {
        const { name, value } = e.target;
        if (editCategory) {
            setEditCategory((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewCategory((prev) => ({ ...prev, [name]: value }));
        }
    };

    const createCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${config.apiUrl}/admin/categories`,
                newCategory,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            setCategories((prevCategories) => [...prevCategories, response.data]);
            setNewCategory({ name: '' });
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const startEditCategory = (category) => {
        setEditCategory({ ...category });
    };

    const saveEditCategory = async () => {
        try {
            const response = await axios.put(
                `${config.apiUrl}/admin/categories/${editCategory.id}`,
                { name: editCategory.name },
                {
                    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
                }
            );
            setCategories((prevCategories) =>
                prevCategories.map((cat) =>
                    cat.id === editCategory.id ? response.data : cat
                )
            );
            setEditCategory(null);
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const deleteCategory = async (id) => {
        try {
            await axios.delete(`${config.apiUrl}/admin/categories/${id}`, {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });
            setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                <div className={styles.inputBlock}>
                    <h2>{editCategory ? 'Редактировать категорию' : 'Добавить новую категорию'}</h2>
                    <div className={styles.itemContent}>
                        <label>Название категории</label>
                        <input
                            type="text"
                            name="name"
                            value={editCategory ? editCategory.name : newCategory.name}
                            onChange={handleCategoryInputChange}
                            placeholder="Название категории"
                        />
                    </div>
                    {editCategory ? (
                        <button onClick={saveEditCategory} className="btn">
                            Сохранить изменения
                        </button>
                    ) : (
                        <button onClick={createCategory} className="btn">
                            Создать категорию
                        </button>
                    )}
                </div>

                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <div className={styles.itemContent}>
                        <h2>Список категорий</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            <button className={styles.deleteButton} onClick={() => startEditCategory(category)}>Редактировать</button>
                                            <button className={styles.deleteButton} onClick={() => deleteCategory(category.id)}>Удалить</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesManagement;
