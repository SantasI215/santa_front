import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import styles from '../Admin.module.css';
import Preloader from "@/components/Preloader";
import Delete from '@/assets/img/Delete.svg';
import Edit from '@/assets/img/Edit.svg';
import Image from "next/image";

const BoxesManagement = () => {
    const [boxes, setBoxes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newBox, setNewBox] = useState({ name: '', description: '', price: '', active: '' });
    const [editBox, setEditBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const formRef = useRef(null);

    // Загрузка списка боксов и категорий
    useEffect(() => {
        const fetchBoxesAndCategories = async () => {
            setLoading(true);
            try {
                const [boxesResponse, categoriesResponse] = await Promise.all([
                    axios.get(`${config.apiUrl}/admin/all-boxes`, {
                        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
                    }),
                    axios.get(`${config.apiUrl}/categories`, {
                        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
                    }),
                ]);
                setBoxes(boxesResponse.data || []);
                setCategories(categoriesResponse.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Не удалось загрузить данные.');
            } finally {
                setLoading(false);
            }
        };

        fetchBoxesAndCategories();
    }, []);

    // Обработка ввода для нового бокса или редактирования
    const handleBoxInputChange = (e) => {
        const { name, value } = e.target;
        setNewBox((prev) => ({
            ...prev,
            [name]: name === 'active' ? value : value, // Отправляем строку 'true' или 'false'
        }));
    };

    // Обработка выбора категорий
    const onCategorySelection = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Создание нового бокса
    const createBox = async () => {
        try {
            const response = await axios.post(
                `${config.apiUrl}/boxes`,
                {
                    ...newBox,
                    categories: selectedCategories,
                },
                { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
            );
            // Обновление списка боксов
            setBoxes((prevBoxes) => [response.data.box, ...prevBoxes]);
        } catch (error) {
            console.error('Error creating box:', error);
            setError('Не удалось создать бокс.');
        }
    };

    // Редактирование бокса
    const editBoxData = (box) => {
        setEditBox(box);
        setNewBox({
            name: box.name,
            description: box.description,
            price: box.price,
            active: box.active,
        });
        setSelectedCategories(box.categories.map((category) => category.id));
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Обновление бокса
    const updateBox = async () => {
        if (!editBox) return;
        try {
            const response = await axios.put(
                `${config.apiUrl}/admin/boxes/${editBox.id}`,
                {
                    ...newBox,
                    categories: selectedCategories,
                },
                { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
            );

            // setBoxes((prevBoxes) =>
            //     prevBoxes.map((box) => (box.id === response.data.box.id ? response.data.box : box))
            // );
        } catch (error) {
            console.error('Error updating box:', error);
            setError('Не удалось обновить бокс.');
        }
    };

    return (
        <div className={styles.content}>
            {/* Прелоадер */}
            {loading ? (
                <Preloader />
            ) : (
                <>
                    {/* Список боксов */}
                    <div className={styles.container}>
                        <h2>Список боксов</h2>
                        {boxes.length > 0 ? (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Название</th>
                                            <th>Описание</th>
                                            <th>Цена</th>
                                            <th>Категории</th>
                                            <th>Статус</th>
                                            <th>Действие</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boxes.map((box) => (
                                            <tr key={box.id}>
                                                <td>{box.name}</td>
                                                <td>{box.description}</td>
                                                <td>{box.price}₽</td>
                                                <td>
                                                    {box.categories?.map((category) => category.name).join(', ') || 'Нет категорий'}
                                                </td>
                                                <td>
                                                    {box.active}
                                                </td>
                                                <td className={styles.buttonSection}>
                                                    <button
                                                        onClick={() => editBoxData(box)}
                                                        className={`${styles.button} ${styles.editButton}`}
                                                    >
                                                        <Image src={Edit} alt="Редактировать" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>Боксов пока нет.</p>
                        )}
                    </div>

                    {/* Ошибки */}
                    {error && <p className={styles.error}>{error}</p>}

                    {/* Форма для добавления или редактирования бокса */}
                    <div ref={formRef}>
                        <div className={styles.container}>
                            <h2>{editBox ? 'Редактировать бокс' : 'Добавить новый бокс'}</h2>
                            <div className={styles.gridContainer}>
                                <div className={styles.inputBlock}>
                                    <div className={styles.itemContent}>
                                        <label>Название бокса</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newBox.name}
                                            onChange={handleBoxInputChange}
                                            placeholder="Название бокса"
                                        />
                                    </div>
                                    <div className={styles.itemContent}>
                                        <label>Описание бокса</label>
                                        <textarea
                                            name="description"
                                            value={newBox.description}
                                            onChange={handleBoxInputChange}
                                            placeholder="Описание бокса"
                                            disabled={!!editBox} // Заблокировать при редактировании
                                        />
                                    </div>
                                    <div className={styles.itemContent}>
                                        <label>Цена</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={newBox.price}
                                            onChange={handleBoxInputChange}
                                            placeholder="Цена"
                                            disabled={!!editBox} // Заблокировать при редактировании
                                        />
                                    </div>
                                    <div className={styles.itemContent}>
                                        <label>Статус</label>
                                        <select
                                            name="active"
                                            value={newBox.active}
                                            onChange={handleBoxInputChange}
                                        >
                                            <option value="Активный">Активный</option>
                                            <option value="Неактивный">Неактивный</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.itemContent}>
                                    <p>Выберите категории:</p>
                                    <div className={styles.newItemCategoryBlock}>
                                        <div className={styles.newItemCategoryContent}>
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <label key={category.id} className={styles.categoryLabel}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(category.id)}
                                                            onChange={() => onCategorySelection(category.id)}
                                                            disabled={!!editBox} // Заблокировать при редактировании
                                                        />
                                                        {category.name}
                                                    </label>
                                                ))
                                            ) : (
                                                <p>Категорий пока нет.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={editBox ? updateBox : createBox} className="btn">
                                {editBox ? 'Обновить бокс' : 'Создать бокс'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BoxesManagement;
