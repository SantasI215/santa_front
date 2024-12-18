import { useEffect, useState } from "react";
import styles from './Filters.module.css';
import axios from "axios";
import config from "@/pages/api/config";

const Filters = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    const handleCategoryChange = (categoryId) => {
        let updatedCategories;

        if (selectedCategories.includes(categoryId)) {
            updatedCategories = selectedCategories.filter((id) => id !== categoryId);
        } else {
            updatedCategories = [...selectedCategories, categoryId];
        }

        setSelectedCategories(updatedCategories);
        onFilterChange(updatedCategories); // Передаем обновленный список в родительский компонент
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
                        {categories.map((category) => (
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
