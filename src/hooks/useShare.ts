export default function useShare(){

    const shareDataProcess = async (title: string, text: string, url:string) => {
        try {
            await navigator.share({
                title,
                text,
                url
            })
        }catch(error){
            console.log(error);
        }
    }

    return {
        shareDataProcess
    };

}