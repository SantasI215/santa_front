import styles from './Sorting.module.css'

export function Sorting({ params, selectSorting, sortingDirection, setSortingDirection, selectedItem }) {
    const changeSorting = (item) => {
        if (item === selectedItem) {
            setSortingDirection(sortingDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            selectSorting(item);
            setSortingDirection('desc');
        }
    }

    return (
        <ul className={styles.sorting}>
            {Object.entries(params).map(([key, item]) => {
                const isActive = key === selectedItem;
                const isDescending = isActive && sortingDirection === 'desc';
                
                return (
                    <li key={key} onClick={() => changeSorting(key)} className={`${styles.item__sorting} ${isActive ? styles.active : ''} ${!isDescending ? styles.desc : ''}`}>{item}</li>
                )
            })}
        </ul>
    )
}
