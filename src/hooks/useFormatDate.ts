export default function useFormatDate(dateString: string){
    const date = new Date(dateString);
    const spanishDate = new Intl.DateTimeFormat("es", {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
    
    return spanishDate;
}