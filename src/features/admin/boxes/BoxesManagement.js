import { useState, useEffect } from 'react';
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
    const [newBox, setNewBox] = useState({ name: '', description: '', price: '' });
    const [editBox, setEditBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка списка боксов и категорий
    useEffect(() => {
        const fetchBoxesAndCategories = async () => {
            setLoading(true);
            try {
                const [boxesResponse, categoriesResponse] = await Promise.all([
                    axios.get(`${config.apiUrl}/all-boxes`, {
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
        setNewBox((prev) => ({ ...prev, [name]: value }));
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
        setError(null);
        try {
            const response = await axios.post(
                `${config.apiUrl}/boxes`,
                { ...newBox, categories: selectedCategories },
                {
                    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
                }
            );
            setBoxes((prevBoxes) => [response.data.box, ...prevBoxes]); // Добавляем новый бокс
            setNewBox({ name: '', description: '', price: '' }); // Сброс формы
            setSelectedCategories([]); // Сброс выбранных категорий
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
        });
        setSelectedCategories(box.categories.map((category) => category.id)); // Выбор категорий
    };

    // Обновление бокса
    const updateBox = async () => {
        if (!editBox) return;
        setError(null);
        try {
            const response = await axios.put(
                `${config.apiUrl}/admin/boxes/${editBox.id}`,
                { ...newBox, categories: selectedCategories },
                {
                    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
                }
            );
            // setBoxes((prevBoxes) =>
            //     prevBoxes.map((box) => (box.id === response.data.box.id ? response.data.box : box))
            // ); // Обновляем бокс в списке
            setEditBox(null); // Сброс редактируемого бокса
            setNewBox({ name: '', description: '', price: '' });
            setSelectedCategories([]);
        } catch (error) {
            console.error('Error updating box:', error);
            setError('Не удалось обновить бокс.');
        }
    };

    // // Удаление бокса
    // const deleteBox = async (boxId) => {
    //     try {
    //         await axios.delete(`${config.apiUrl}/admin/boxes/${boxId}`, {
    //             headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    //         });
    //         setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== boxId));
    //     } catch (error) {
    //         console.error('Error deleting box:', error);
    //         setError('Не удалось удалить бокс.');
    //     }
    // };

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
                                                <td className={styles.buttonSection}>
                                                    <button
                                                        onClick={() => editBoxData(box)}
                                                        className={`${styles.button} ${styles.editButton}`}
                                                    >
                                                        <Image src={Edit} alt="" />
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

                </>
            )}
        </div>
    );
};

export default BoxesManagement;
