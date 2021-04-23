import {GetStaticProps} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import api from '../services/api';

import useReduceContent from '../hooks/useReduceContent';

import styles from '../styles/home.module.scss';

type Article = {
  id: string;
  autor: string;
  title: string;
  description: string;
  imgURL: string;
}

type HomeProps = {
  articles: Article[];
}

export default function Home({articles}: HomeProps) {

  console.log(articles);

  return (
    <main className={styles.homeContainer}>

      {
        articles.map(article => {
          return (
            <Link href={`/articles/${article.id}`}>
              <a key={article.id}>
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

                  <p>{article.description}</p>

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
      autor: article.autor,
      title: article.title,
      imgURL: article.img[0].formats.large.url,
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
