import {GetStaticProps} from 'next';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import api from '../services/api';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

import useReduceContent from '../hooks/useReduceContent';

import styles from '../styles/home.module.scss';

type Article = {
  id: string;
  slug: string;
  autor: string;
  title: string;
  description: string;
  imgURL: string;
}

type HomeProps = {
  articles: Article[];
}

export default function Home({articles}: HomeProps) {

  return (
    <main className={styles.homeContainer}>

      <Head>
        <title>andresargote | Compartiendo aprendizaje sobre programación y criptomonedas</title>
        <link rel="icon" href="/favicon.ico" />

        <meta name="description" content="Compartiendo mi proceso de aprendizaje en el mundo de la programación y las criptomonedas. Un lugar lleno de React, Node.js, MongoDB y mucho más.🚀" />

       {/*  <!-- Google / Search Engine Tags --> */}
        <meta itemProp="name" content="andresargote | Compartiendo aprendizaje sobre programación y criptomonedas" />
        <meta itemProp="description" content="Compartiendo mi proceso de aprendizaje en el mundo de la programación y las criptomonedas. Un lugar lleno de React, Node.js, MongoDB y mucho más.🚀" />
        <meta itemProp="image" content="/imageAlblanco.jpg" />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://alblan.co" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="andresargote | Compartiendo aprendizaje sobre programación y criptomonedas" />
        <meta property="og:description" content="Compartiendo mi proceso de aprendizaje en el mundo de la programación y las criptomonedas. Un lugar lleno de React, Node.js, MongoDB y mucho más.🚀" />
        <meta property="og:image" content="/imageAlblanco.jpg" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="andresargote | Compartiendo aprendizaje sobre programación y criptomonedas" />
        <meta name="twitter:description" content="Compartiendo mi proceso de aprendizaje en el mundo de la programación y las criptomonedas. Un lugar lleno de React, Node.js, MongoDB y mucho más.🚀" />
        <meta name="twitter:image" content="/imageAlblanco.jpg" />
      </Head>

      {
        articles.map(article => {
          return (
            <Link href={`/articles/${article.slug}`} key={article.id}>
              <a>
                <picture>
                  <Image 
                    src={article.imgURL}
                    alt={article.title}
                    width={800}
                    height={600}
                    objectFit='cover'
                  />
                </picture>

                <div>
                  <h2>{article.title}</h2>

                  {
                    unified()
                        .use(parse)
                        .use(remark2react)
                        .processSync(article.description).result
                  }

                  <span>por <strong>{article.autor}</strong></span>
                </div>

              </a>
            </Link>
          )
        })
      }

    </main>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const {data} = await api.get('articles');

  const articles = data.map(article => {
    return {
      id: article._id,
      slug: article.slug,
      autor: article.autor,
      title: article.title,
      imgURL: article.img[0].formats.small.url,
      description: useReduceContent(article.content)
    }
  }).reverse();//con el reverse logramos q el ultimo seal el primero

  return {
    props: {
      articles
    },
    revalidate: 60 * 60 * 8 //cada 8 horas
  }

};
