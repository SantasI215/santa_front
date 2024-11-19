import styles from './CreateBox.module.css'
import {useRouter} from "next/router";

export default function CreateBox() {
    const router = useRouter()

    const goConfigurator = () => {
        router.push('/configurator')
    }

    return (
        <div className="create-box">
            <div className="container">
                <div className={styles.createBoxContent}>
                    <span>Вы можете создать свой  бокс</span>
                    <button className="btn" onClick={goConfigurator}>Создать</button>
                </div>

            </div>
        </div>
    )
}