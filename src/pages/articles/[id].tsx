import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

import api from '../../services/api';
import useFormatDate from '../../hooks/useFormatDate';

import styles from '../../styles/articles.module.scss';


type Article = {
    id: string;
    autor: string;
    title: string;
    imgURL: string;
    content: string;
    date: string;
    dateArticle: string;
}
  
type ArticleProps = {
    article: Article;
}


export default function Articles({article}: ArticleProps) {
    return (
        <article className={styles.article}>
            <h1>{article.title}</h1>

            <div className={styles.entryAutorAndSocial}>
                <div className={styles.autorAndDate}>
                    <span>por <strong>{article.autor}</strong></span>
                    <time dateTime={article.date}>{article.dateArticle}</time>
                </div>
            </div>

            <picture>
                <Image 
                    src={article.imgURL}
                    alt={article.title}
                    width={800}
                    height={600}
                    objectFit='cover'
                />
            </picture>

            <div className={styles.content}>
                {
                    unified()
                        .use(parse)
                        .use(remark2react)
                        .processSync(article.content).result
                }
            </div>
        </article>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    
    const {data} = await api.get('articles');

    const paths = data.map(article => {
        return {
            params: {
                id: article.id
            }
        }
    });

    return {
        paths,
        fallback: 'blocking'
    }

}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const {id} = ctx.params;

    const {data} = await api.get(`/articles/${id}`);

    const article = {
        id: data._id,
        autor: data.autor,
        title: data.title,
        imgURL:data.img[0].formats.large.url,
        content: data.content,
        date: data.date,
        dateArticle: useFormatDate(data.date)
    }

    return {
        props: {
            article
        },
        revalidate: 60 * 60 * 24, //24 horas
    }
}