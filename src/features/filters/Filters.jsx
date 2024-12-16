import { useEffect, useState } from "react";
import styles from './Filters.module.css';
import axios from "axios";
import config from "@/pages/api/config";

const Filters = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]); // Список категорий
    const [selectedCategories, setSelectedCategories] = useState([]); // Выбранные категории
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние выпадающего списка

    // Загружаем категории с сервера
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке категорий:", error);
            }
        };

        fetchCategories();
    }, []);

    // Обработчик изменения выбора категорий
    const handleCategoryChange = (categoryId) => {
        let updatedCategories;

        if (selectedCategories.includes(categoryId)) {
            // Убираем категорию из выбранных
            updatedCategories = selectedCategories.filter(id => id !== categoryId);
        } else {
            // Добавляем категорию в выбранные
            updatedCategories = [...selectedCategories, categoryId];
        }

        setSelectedCategories(updatedCategories);
        onFilterChange(updatedCategories); // Передаём изменения в родительский компонент
    };

    return (
        <div className={styles.filtersContainer}>
            <button
                className={styles.dropdownButton}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                Фильтры
            </button>
            {isDropdownOpen && (
                <div className={styles.dropdownContent}>
                    <h3>Выберите категории</h3>
                    <ul className={styles.filterList}>
                        {categories.map(category => (
                            <li key={category.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={category.id}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                    />
                                    {category.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Filters;
