import Link from 'next/link';

import styles from '../components/styles/header.module.scss';

export default function Header() {
    return (
        <header className={styles.header}>
            <Link href='/'>
                <h1>andresargote</h1>
            </Link>
        </header>
    )
}