import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '@/pages/api/config';
import Preloader from "@/components/Preloader";
import styles from "@/features/admin/Admin.module.css";

const BoxAssembly = () => {
    const router = useRouter();
    const { id } = router.query;
    const [boxData, setBoxData] = useState(null);
    const [suggestedItems, setSuggestedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [allItemsAdded, setAllItemsAdded] = useState(false);
    const [isAssembled, setIsAssembled] = useState(false);

    useEffect(() => {
        if (id) {
            initializeBox();
        }
    }, [id]);

    // Проверяем, все ли товары добавлены
    useEffect(() => {
        if (!isAssembled) {
            const notAddedItems = suggestedItems.filter(item => item.status === 'Не добавлен');
            setAllItemsAdded(notAddedItems.length === 0);
        }
    }, [suggestedItems, isAssembled]);

    const initializeBox = async () => {
        try {
            // Получаем информацию о боксе
            const boxResponse = await axios.get(`${config.apiUrl}/boxes/${id}/items`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });

            setBoxData(boxResponse.data.box);
            setIsAssembled(boxResponse.data.is_assembled);

            if (boxResponse.data.is_assembled) {
                // Если бокс уже собран, показываем его содержимое
                setSuggestedItems(boxResponse.data.box_items);
                setTotalPrice(boxResponse.data.box_items.reduce((sum, item) =>
                    sum + (item.item.price * item.quantity), 0
                ));
            } else {
                // Если бокс не собран, получаем предложения
                const suggestionsResponse = await axios.get(`${config.apiUrl}/boxes/${id}/suggestions`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });

                setSuggestedItems(suggestionsResponse.data.suggestions);
                setTotalPrice(suggestionsResponse.data.total_price);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error initializing box:', error);
            setLoading(false);
        }
    };

    const handleItemToggle = (itemId) => {
        if (isAssembled) return;

        setSuggestedItems(prevItems =>
            prevItems.map(item => {
                if (item.item_id === itemId) {
                    const newStatus = item.status === 'Добавлен' ? 'Не добавлен' : 'Добавлен';
                    return { ...item, status: newStatus };
                }
                return item;
            })
        );
    };

    const handleSave = async () => {
        if (!allItemsAdded) {
            alert('Необходимо добавить все товары в бокс перед сохранением');
            return;
        }

        try {
            await axios.post(`${config.apiUrl}/boxes/${id}/save`, {
                items: suggestedItems
            }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            router.push('/admin/dashboard');
        } catch (error) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                console.error('Error saving box:', error);
            }
        }
    };

    if (loading) return <Preloader />;
    if (!boxData) return <div>Бокс не найден</div>;

    return (
        <div className={styles.boxAssemblyContainer}>
            <div className={styles.infoContainer}>
                <div className={styles.content}>
                    <div>
                        <h2>Сборка бокса {isAssembled ? '(Собран)' : ''}</h2>
                        <h3>Информация о боксе:</h3>
                        <div className={styles.boxAssemblyInfo}>
                            <p>Название: {boxData.box.name}</p>
                            <p>Максимальная цена: {boxData.box.price}₽</p>
                            <p>Текущая сумма: {totalPrice}₽</p>
                        </div>
                    </div>


                    <div className={styles.container}>
                        <h3>Товары для сборки:</h3>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Цена</th>
                                    <th>Количество</th>
                                    <th>Стоимость</th>
                                    <th>Действие</th>
                                </tr>
                                </thead>
                                <tbody>
                                {suggestedItems.map(item => (
                                    <tr key={item.item_id}>
                                        <td>{item.item.name}</td>
                                        <td>{item.item.price}₽</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.item.price * item.quantity}₽</td>
                                        <td>
                                            {!isAssembled && (
                                                <button
                                                    onClick={() => handleItemToggle(item.item_id)}
                                                    style={{
                                                        backgroundColor: item.status === 'Добавлен' ? '#4d9aff' : '#ff4d4d',
                                                    }}
                                                    className={`btn ${styles.addButton}`}
                                                >
                                                    {item.status}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        {!isAssembled && (
                            <button
                                onClick={handleSave}
                                disabled={!allItemsAdded}
                                style={{
                                    backgroundColor: allItemsAdded ? '#2196F3' : '#cccccc',
                                }}
                                className="btn"
                            >
                                Сохранить
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxAssembly;
