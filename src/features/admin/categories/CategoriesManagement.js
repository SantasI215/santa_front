import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import styles from '../Admin.module.css';

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '' });
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
        setNewCategory((prev) => ({ ...prev, [name]: value }));
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

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                <div className={styles.inputBlock}>
                    <h2>Добавить новую категорию</h2>
                    <div className={styles.itemContent}>
                        <label>Название категории</label>
                        <input
                            type="text"
                            name="name"
                            value={newCategory.name}
                            onChange={handleCategoryInputChange}
                            placeholder="Название категории"
                        />
                    </div>
                    <button onClick={createCategory} className="btn">
                        Создать категорию
                    </button>
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
                            </tr>
                            </thead>
                            <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
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
