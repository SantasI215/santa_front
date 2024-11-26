import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import config from "@/pages/api/config";
import Preloader from "@/components/Preloader";
import Cookies from "js-cookie";
import styles from "./Profile.module.css";
import Orders from "@/features/orders/Orders";

export default function Profile() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get("token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            try {
                // Запрос данных пользователя
                const { data } = await axios.get(`${config.apiUrl}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUserData(data);

                if (data.role === "admin") {
                    router.push("/admin/dashboard");
                }
            } catch {
                Cookies.remove("token");
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/auth/login");
    };

    if (loading) return <Preloader />;
    if (!userData) return null;

    return (
        <div className="profile">
            <div className="container">
                <div className={styles.profileContent}>
                    <div className={styles.profileInfo}>
                        <h2>Профиль</h2>
                        <p>Ваше имя: {userData.name}</p>
                        <p>Ваша почта: {userData.email}</p>
                        <button onClick={handleLogout} className="btn">
                            Выйти
                        </button>
                    </div>
                    <div className={styles.profileOrder}>
                        <h2>Ваши заказы</h2>
                        <Orders />
                    </div>
                </div>
            </div>
        </div>
    );
}
