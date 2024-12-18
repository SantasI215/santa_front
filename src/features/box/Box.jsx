// BoxList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import config from "@/pages/api/config";
import styles from "./Box.module.css";
import Filters from "./../filters/Filters";
import BoxImage from "@/assets/img/Box.png";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { Sorting } from "../sorting/Sorting";
import { BoxSkelet } from "./boxSkelet/BoxSkelet";

const BoxList = ({ apiEndpoint, title }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inCart, setInCart] = useState([]); // Список ID добавленных боксов
    const [boxes, setBoxes] = useState([]); // Отфильтрованные боксы
    const [categories, selectCategories] = useState([]);
    const [sorting, selectSorting] = useState("created_at");
    const [sortingDirection, setSortingDirection] = useState("desc");

    const fetchBoxes = async () => {
        setLoading(true);
        try {
            const params =
                categories.length > 0
                    ? {
                          categories: categories.join(","),
                          sort_by: sorting,
                          sort_order: sortingDirection,
                      }
                    : { sort_by: sorting, sort_order: sortingDirection };

            const response = await axios.get(
                `${config.apiUrl}/${apiEndpoint}`,
                { params }
            );

            setBoxes(response.data);
        } catch (err) {
            setError("Ошибка при загрузке боксов");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoxes();
    }, [apiEndpoint, categories, sorting, sortingDirection]);

    const addToCart = async (id) => {
        try {
            const token = Cookies.get("token");

            const response = await axios.post(
                `${config.apiUrl}/cart/add/${id}`,
                { box_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Успешно!");
            if (response.status === 200 && response.data.cartItemId) {
                setInCart([...inCart, response.data.cartItemId]);
            }
        } catch (err) {
            console.error("Ошибка при добавлении товара в корзину:", err);
            setError("Не удалось добавить товар в корзину");
        }
    };

    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h2>{title}</h2>
            <div
                className={
                    apiEndpoint === "new-boxes" ? styles.box : styles.boxWrapper
                }
            >
                {apiEndpoint !== "new-boxes" && (
                    <div className={styles.filtersBlock}>
                        <Filters onFilterChange={selectCategories} />
                    </div>
                )}
                <div>
                    <Sorting
                        params={{
                            created_at: "Новинки",
                            name: "Название",
                            price: "По цене",
                        }}
                        selectSorting={selectSorting}
                        sortingDirection={sortingDirection}
                        setSortingDirection={setSortingDirection}
                        selectedItem={sorting}
                    />
                    <ul className={styles.boxContent}>
                        {!loading
                            ? boxes.map((box) => (
                                  <li key={box.id} className={styles.boxItem}>
                                      <Link href={`/boxes/${box.id}`}>
                                          <div className={styles.boxInfo}>
                                              <Image
                                                  src={
                                                      box.image
                                                          ? `${config.url}/storage/${box.image}`
                                                          : BoxImage
                                                  }
                                                  alt={box.name}
                                                  width={200}
                                                  height={200}
                                              />
                                              <p>{box.name}</p>
                                          </div>
                                      </Link>
                                      <div className={styles.boxPrice}>
                                          <h3>{box.price} ₽</h3>
                                          <button
                                              className="btn"
                                              onClick={() => addToCart(box.id)}
                                          >
                                              Купить
                                          </button>
                                      </div>
                                  </li>
                              ))
                            : Array.from({ length: 4 }, (_, i) => (
                                <BoxSkelet />
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BoxList;

export function OurBoxes() {
    return (
        <div className="box">
            <BoxList apiEndpoint="index-all" title="Наши боксы" />
        </div>
    );
}

export function OurBoxesNew() {
    return <BoxList apiEndpoint="new-boxes" title="Новые боксы" />;
}
