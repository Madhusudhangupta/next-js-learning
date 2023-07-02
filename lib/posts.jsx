import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // get file names under /posts
    // yaha pe /posts k under ka files "get" karenge
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((fileName) => {
        // remove ".md" from file name to get id
        // yaha ham ".md" ko remove karenge taki hame id mile
        const id = fileName.replace(/\.md$/, '')

        // read markdown file as string
        // markdown file ko as a string read karenge
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // use gray matter to parse the post metadata section
        // yaha post metadata section ko parse krne k liye gray matter use karenge
        const matterResult = matter(fileContents)

        // combine the data with the id
        // yaha ham data ko id se combine karenge
        return  {
            id,
            ...matterResult.data,
        }
    })

    // sort posts by date
    // saare posts ko date k hisab se sort krenge
    return allPostsData.sort((a,b) => {
        if(a.date < b.date) {
            return 1;
        }
        else {
            return -1;
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // combine the data with the id
    return {
        id,
        ...matterResult.data,
    }
}