export default function useReduceContent(content: string){
    return content.substring(0, 160) + '...';
}