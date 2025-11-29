export const addFavotiteToLocalStorage = (data) => {
    const favorites = getLocalStorageFavorites();
    if(!favorites.find((item)=> item._id === data._id)){
        favorites.push(data);
        localStorage.setItem("favorites" , JSON.stringify(favorites));
    }

}
export const removeFavoriteFromLocalStorage = (data) => {
    const favorites = getLocalStorageFavorites();
    const updatedFavorites = favorites.filter((item) => item._id !== data._id);
    localStorage.setItem("favorites" , JSON.stringify(updatedFavorites));
}
export const getLocalStorageFavorites = () => {
    const favorites = localStorage.getItem("favorites");
    if(favorites){
        return JSON.parse(favorites);
    }
    return [];
}