import Image from "next/image";
import { useRouter } from "next/router";

export default function NavButton({ label, path, icon, type = "text" }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(path);
    };

    return (
        <button className={`btn-${type}`} onClick={handleClick}>
            {icon && <Image src={icon} alt={label} />}
            {!icon && label}
        </button>
    );
}
