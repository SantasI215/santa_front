import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import config from '@/pages/api/config';
import Preloader from '@/components/Preloader';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBox, setNewBox] = useState({ name: '', description: '', price: '' });
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '', categories: [] });
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [boxes, setBoxes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    


    const handleCategorySelection = (categoryId) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    const handleCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({ ...prev, [name]: value }));
    };

    const handleBoxInputChange = (e) => {
        const { name, value } = e.target;
        setNewBox((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const createCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${config.apiUrl}/categories`,
                newCategory,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            console.log('Категория добавлена:', response.data);
            setCategories((prevCategories) => [...prevCategories, response.data]);
            setNewCategory({ name: '', description: '' });
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error.response || error.message);
        }
    };

    const createBox = async () => {
        try {
            const response = await axios.post(
                `${config.apiUrl}/boxes`,
                newBox,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );

            console.log('Box created:', response.data);
            setBoxes((prevBoxes) => [...prevBoxes, response.data.box]);
            setNewBox({ name: '', description: '', price: '' });
        } catch (error) {
            console.error('Error creating box:', error.response || error.message);
        }
    };

    const createItem = async () => {
        try {
            const response = await axios.post(
                `${config.apiUrl}/items`,
                { ...newItem, categories: selectedCategories },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );

            console.log('Товар создан:', response.data);
            setItems((prevItems) => [...prevItems, response.data.item]);
            setNewItem({ name: '', description: '', price: '' });
            setSelectedCategories([]);
        } catch (error) {
            console.error('Ошибка при добавлении товара:', error.response || error.message);
        }
    };


    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/auth/login');
    };

    const deleteUser = async (id) => {
        try {
            const response = await axios.delete(`${config.apiUrl}/admin/users/${id}/delete`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });

            console.log('User deleted:', response.data);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error.response || error.message);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${config.apiUrl}/items/${id}/delete`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });

            console.log(`Товар с ID ${id} удален`);
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error(`Ошибка при удалении товара с ID ${id}:`, error.response || error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');

            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const response = await axios.get(`${config.apiUrl}/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
                const userResponse = await axios.get(`${config.apiUrl}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(userResponse.data);

                const usersResponse = await axios.get(`${config.apiUrl}/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(usersResponse.data);

                const itemsResponse = await axios.get(`${config.apiUrl}/items`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setItems(itemsResponse.data);

                const boxesResponse = await axios.get(`${config.apiUrl}/all-boxes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBoxes(boxesResponse.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) return <Preloader />;

    return (
        <div className={styles.dashboard}>
            <h2>Профиль администратора</h2>
            <div className={styles.profileInfo}>
                {userData && (
                    <>
                        <p>Ваше имя: {userData.name}</p>
                        <p>Ваша почта: {userData.email}</p>
                        <p>Ваш ID: {userData.id}</p>
                        <p>Ваш статус: {userData.role}</p>
                        <button onClick={handleLogout} className="btn">
                            Выйти
                        </button>
                    </>
                )}
            </div>

            <h2>Список пользователей</h2>
            <div className={styles.usersList}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Почта</th>
                            <th>Действия</th>
                            <th>Роль</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {!user.isAdmin && (
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="btn"
                                            disabled={user.role === 'admin'}
                                        >
                                            Удалить
                                        </button>
                                    )}
                                </td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2>Список товаров</h2>
            <div className={styles.usersList}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Название товара</th>
                            <th>Описание</th>
                            <th>Цена</th>
                            <th>Категория</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item?.name || 'Нет названия'}</td>
                                    <td>{item?.description || 'Нет описания'}</td>
                                    <td>{item?.price || 'Нет цены'}</td>
                                    <td>
                                        {categories && categories.length > 0 ? (
                                            categories.map((category) => (
                                                <tr key={category.id}>
                                                    <td>{category.name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <span>Нет категории</span>
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => deleteItem(item.id)} className="btn">
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Товары отсутствуют</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            <h2>Добавить новый товар</h2>
            <div className={styles.configurator}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createItem();
                    }}
                    className={styles.configForm}
                >
                    <div>
                        <label>Название товара:</label>
                        <input
                            type="text"
                            name="name"
                            value={newItem.name || ''}
                            onChange={handleItemInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Описание:</label>
                        <textarea
                            name="description"
                            value={newItem.description || ''}
                            onChange={handleItemInputChange}
                        />
                    </div>
                    <div>
                        <label>Цена:</label>
                        <input
                            type="number"
                            name="price"
                            value={newItem.price || ''}
                            onChange={handleItemInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Категории:</label>
                        {categories.map((category) => (
                            <div key={category.id}>
                                <input
                                    type="checkbox"
                                    id={`category-${category.id}`}
                                    value={category.id}
                                    onChange={(e) => {
                                        const { value, checked } = e.target;
                                        setNewItem((prev) => ({
                                            ...prev,
                                            categories: checked
                                                ? [...(prev.categories || []), value]
                                                : prev.categories.filter((id) => id !== value),
                                        }));
                                    }}
                                />
                                <label htmlFor={`category-${category.id}`}>{category.name}</label>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="btn">
                        Создать
                    </button>
                </form>
            </div>

            <h2>Добавить новый бокс</h2>
            <div className={styles.configurator}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createBox();
                    }}
                    className={styles.configForm}
                >
                    <div>
                        <label>Название:</label>
                        <input
                            type="text"
                            name="name"
                            value={newBox.name}
                            onChange={handleBoxInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Описание:</label>
                        <textarea
                            name="description"
                            value={newBox.description}
                            onChange={handleBoxInputChange}
                        />
                    </div>
                    <div>
                        <label>Цена:</label>
                        <input
                            type="number"
                            name="price"
                            value={newBox.price}
                            onChange={handleBoxInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">
                        Создать
                    </button>
                </form>
            </div>

            <h2>Список всех боксов</h2>
            <div className={styles.usersList}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Цена</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boxes.map((box) => (
                            <tr key={box.id}>
                                <td>{box.name}</td>
                                <td>{box.description}</td>
                                <td>{box.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.dashboard}>
                <h2>Список категорий</h2>
                <div className={styles.categoriesList}>
                    <table className={styles.usersTable}>
                        <thead>
                            <tr>
                                <th>Название категории</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2>Добавить новую категорию</h2>
                <div className={styles.configurator}>
                    <form onSubmit={createCategory} className={styles.configForm}>
                        <div>
                            <label>Название категории:</label>
                            <input
                                type="text"
                                name="name"
                                value={newCategory.name || ''}
                                onChange={handleCategoryInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn">
                            Создать
                        </button>
                    </form>
                </div>
            </div>
            
            <h2>История заказов</h2>
        </div>
    );
};

export default Dashboard;
