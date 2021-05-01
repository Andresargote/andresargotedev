import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import {TwitterShareButton, WhatsappShareButton, TwitterIcon, WhatsappIcon} from 'react-share';

import api from '../../services/api';
import useFormatDate from '../../hooks/useFormatDate';
import useReduceContent from '../../hooks/useReduceContent';

import styles from '../../styles/articles.module.scss';
import React from 'react';


type Article = {
    id: string;
    shareURL: string;
    autor: string;
    title: string;
    imgURL: string;
    content: string;
    date: string;
    dateArticle: string;
    description: string;
}
  
type ArticleProps = {
    article: Article;
}


export default function Articles({article}: ArticleProps) {

    return (
        <>
            <Head>
                <title>{article.title} | Al blanco</title>
                <link rel="icon" href="/favicon.ico" />

                <meta name="description" content={article.description} />

                {/*  <!-- Google / Search Engine Tags --> */}
                <meta itemProp="name" content="Al blanco | Salud, Economía y Política" />
                <meta itemProp="description" content={article.description} />
                <meta itemProp="image" content={article.imgURL} />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content="https://alblan.co" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Al blanco | Salud, Economía y Política" />
                <meta property="og:description" content={article.description} />
                <meta property="og:image" content={article.imgURL} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Al blanco | Salud, Economía y Política" />
                <meta name="twitter:description" content={article.description} />
                <meta name="twitter:image" content={article.imgURL} />
            </Head>

            <article className={styles.article}>
                <h1>{article.title}</h1>

                <div className={styles.entryAutorAndSocial}>
                    <div className={styles.autorAndDate}>
                        <span>por <strong>{article.autor}</strong></span>
                        <time dateTime={article.date}>{article.dateArticle}</time>
                    </div>
                    <div className={styles.socials}>
                        <TwitterShareButton url={article.shareURL} title={article.title}>
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>

                        <WhatsappShareButton url={article.shareURL} title={article.title}>
                            <WhatsappIcon size={32} round={true} />
                        </WhatsappShareButton>
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
        </> 
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    
    const {data} = await api.get('articles');

    const paths = data.map(article => {
        return {
            params: {
                slug: article.slug
            }
        }
    });

    return {
        paths,
        fallback: 'blocking'
    }

}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const {slug} = ctx.params;

    const {data} = await api.get(`/articles/${slug}`);

    const article = {
        id: data._id,
        shareURL: `https://alblan.co/articles/${data.slug}`,
        autor: data.autor,
        title: data.title,
        imgURL:data.img[0].formats.small.url,
        content: data.content,
        date: data.date,
        dateArticle: useFormatDate(data.date),
        description: useReduceContent(data.content)
    }

    return {
        props: {
            article
        },
        revalidate: 60 * 60 * 24, //24 horas
    }
}